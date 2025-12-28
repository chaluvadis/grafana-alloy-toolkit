import * as vscode from 'vscode';
import * as path from 'path';

// Shared regex patterns
const BLOCK_PATTERN = /^\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s+"([^"]+)"\s*\{/;
const ATTRIBUTE_PATTERN = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;

/**
 * Activate the Grafana Alloy Toolkit extension
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Grafana Alloy Toolkit extension is now active!');

    // Register validation provider
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('alloy');
    context.subscriptions.push(diagnosticCollection);

    // Validate on document open and change
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(doc => validateAlloyDocument(doc, diagnosticCollection))
    );
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => validateAlloyDocument(event.document, diagnosticCollection))
    );
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(doc => diagnosticCollection.delete(doc.uri))
    );

    // Validate all open documents
    vscode.workspace.textDocuments.forEach(doc => validateAlloyDocument(doc, diagnosticCollection));

    // Register document formatter
    context.subscriptions.push(
        vscode.languages.registerDocumentFormattingEditProvider('alloy', {
            provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
                return formatAlloyDocument(document);
            }
        })
    );

    // Register document range formatter
    context.subscriptions.push(
        vscode.languages.registerDocumentRangeFormattingEditProvider('alloy', {
            provideDocumentRangeFormattingEdits(
                document: vscode.TextDocument,
                range: vscode.Range
            ): vscode.TextEdit[] {
                return formatAlloyRange(document, range);
            }
        })
    );

    // Register documentation generation command
    context.subscriptions.push(
        vscode.commands.registerCommand('alloy.generateDocumentation', () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }
            
            if (editor.document.languageId !== 'alloy') {
                vscode.window.showErrorMessage('Current file is not an Alloy file');
                return;
            }

            const documentation = generateDocumentation(editor.document);
            
            // Create a new untitled document with the documentation
            vscode.workspace.openTextDocument({
                content: documentation,
                language: 'markdown'
            }).then(doc => {
                return vscode.window.showTextDocument(doc);
            }, error => {
                console.error('Failed to open or display generated documentation.', error);
                const message = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage('Failed to open generated documentation: ' + message);
            });
        })
    );
}

/**
 * Validate an Alloy document and provide diagnostics
 */
function validateAlloyDocument(document: vscode.TextDocument, diagnosticCollection: vscode.DiagnosticCollection): void {
    if (document.languageId !== 'alloy') {
        return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    // Check for common syntax errors
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i;

        // Check for missing equals in attribute assignment
        const attributePattern = /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*[^=\s]/;
        if (attributePattern.test(line) && !line.includes('=') && !line.includes('{') && !line.includes('}') && line.trim() !== '' && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
            const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
            const diagnostic = new vscode.Diagnostic(
                range,
                'Attribute assignment may be missing "=" operator',
                vscode.DiagnosticSeverity.Warning
            );
            diagnostics.push(diagnostic);
        }

        // Check for unclosed strings
        const doubleQuotes = (line.match(/(?<!\\)"/g) || []).length;
        if (doubleQuotes % 2 !== 0 && !line.trim().startsWith('//')) {
            const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
            const diagnostic = new vscode.Diagnostic(
                range,
                'Unclosed string literal',
                vscode.DiagnosticSeverity.Error
            );
            diagnostics.push(diagnostic);
        }

        // Check for invalid block names (basic check)
        const blockMatch = line.match(BLOCK_PATTERN);
        if (blockMatch) {
            const blockName = blockMatch[1];
            
            // Warn if block name doesn't follow common patterns
            if (!blockName.includes('.')) {
                const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
                const diagnostic = new vscode.Diagnostic(
                    range,
                    'Block name should typically include a namespace (e.g., "prometheus.scrape", "loki.write", "prometheus.exporter.postgres")',
                    vscode.DiagnosticSeverity.Information
                );
                diagnostics.push(diagnostic);
            }
            
            // Validate postgres exporter specific attributes if it's a postgres block
            if (blockName === 'prometheus.exporter.postgres') {
                validatePostgresBlock(lines, i, diagnostics);
            }
        }
    }

    // Check for overall brace matching
    const openBraces = (text.match(/\{/g) || []).length;
    const closeBraces = (text.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        const lastLine = lines.length - 1;
        const range = new vscode.Range(lastLine, 0, lastLine, lines[lastLine].length);
        const diagnostic = new vscode.Diagnostic(
            range,
            `Unmatched braces: ${openBraces} opening, ${closeBraces} closing`,
            vscode.DiagnosticSeverity.Error
        );
        diagnostics.push(diagnostic);
    }

    diagnosticCollection.set(document.uri, diagnostics);
}

/**
 * Format an entire Alloy document
 */
function formatAlloyDocument(document: vscode.TextDocument): vscode.TextEdit[] {
    const text = document.getText();
    const formatted = formatAlloyText(text);
    
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const range = new vscode.Range(firstLine.range.start, lastLine.range.end);
    
    return [vscode.TextEdit.replace(range, formatted)];
}

/**
 * Format a range in an Alloy document
 */
function formatAlloyRange(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
    const text = document.getText(range);
    const formatted = formatAlloyText(text);
    
    return [vscode.TextEdit.replace(range, formatted)];
}

/**
 * Format Alloy text with proper indentation and spacing
 */
function formatAlloyText(text: string): string {
    const lines = text.split('\n');
    const formatted: string[] = [];
    let indentLevel = 0;
    const indentString = '\t';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip empty lines (preserve them)
        if (line === '') {
            formatted.push('');
            continue;
        }

        // Skip comments (preserve indentation)
        if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
            formatted.push(indentString.repeat(indentLevel) + line);
            continue;
        }

        // Decrease indent for closing braces
        if (line.startsWith('}')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }

        // Apply current indentation
        const indentedLine = indentString.repeat(indentLevel) + line;
        formatted.push(indentedLine);

        // Increase indent for opening braces
        if (line.endsWith('{')) {
            indentLevel++;
        }
        // Handle closing brace on same line as opening
        if (line.includes('{') && line.includes('}')) {
            const openCount = (line.match(/\{/g) || []).length;
            const closeCount = (line.match(/\}/g) || []).length;
            indentLevel += (openCount - closeCount);
        }
    }

    return formatted.join('\n');
}

/**
 * Deactivate the extension
 */
export function deactivate() {
    console.log('Grafana Alloy Toolkit extension is now deactivated');
}

/**
 * Validate a postgres exporter block
 */
function validatePostgresBlock(lines: string[], startLine: number, diagnostics: vscode.Diagnostic[]): void {
    let braceCount = 0;
    let foundDataSourceNames = false;
    let inBlock = false;
    
    for (let i = startLine; i < lines.length; i++) {
        const line = lines[i];
        
        // Count braces to find the end of the block
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceCount += openBraces - closeBraces;
        
        if (openBraces > 0) {
            inBlock = true;
        }
        
        // Check for required data_source_names attribute
        const attrMatch = line.match(ATTRIBUTE_PATTERN);
        if (attrMatch && attrMatch[1] === 'data_source_names') {
            foundDataSourceNames = true;
        }
        
        // Exit when block closes
        if (inBlock && braceCount === 0) {
            break;
        }
    }
    
    // Warn if data_source_names is not found
    if (!foundDataSourceNames) {
        const range = new vscode.Range(startLine, 0, startLine, lines[startLine].length);
        const diagnostic = new vscode.Diagnostic(
            range,
            'prometheus.exporter.postgres requires "data_source_names" attribute',
            vscode.DiagnosticSeverity.Warning
        );
        diagnostics.push(diagnostic);
    }
}

/**
 * Generate documentation for an Alloy file
 */
function generateDocumentation(document: vscode.TextDocument): string {
    const text = document.getText();
    const lines = text.split('\n');
    // Extract just the filename (without path) for the documentation header
    const fileName = path.basename(document.fileName);
    
    let markdown = `# Alloy Configuration Documentation\n\n`;
    markdown += `**File:** ${fileName}\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
    markdown += `---\n\n`;
    
    // Parse blocks and components
    const blocks: Array<{name: string, label: string, line: number, attributes: string[]}> = [];
    let currentBlock: {name: string, label: string, line: number, attributes: string[]} | null = null;
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Skip comments and empty lines
        if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine === '') {
            continue;
        }
        
        // Match block definitions
        const blockMatch = line.match(BLOCK_PATTERN);
        
        if (blockMatch) {
            const blockName = blockMatch[1];
            const label = blockMatch[2];
            currentBlock = {name: blockName, label, line: i + 1, attributes: []};
            // Count opening braces on this line
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            braceCount = openBraces - closeBraces;
        } else if (currentBlock) {
            // Count braces
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            braceCount += openBraces - closeBraces;
            
            // Extract attributes
            const attrMatch = trimmedLine.match(ATTRIBUTE_PATTERN);
            if (attrMatch && !trimmedLine.includes('{')) {
                currentBlock.attributes.push(attrMatch[1]);
            }
            
            // Block ended
            if (braceCount === 0) {
                blocks.push(currentBlock);
                currentBlock = null;
            }
        }
    }
    
    // Generate documentation sections
    if (blocks.length === 0) {
        markdown += `## Summary\n\nNo Alloy components found in this file.\n\n`;
    } else {
        markdown += `## Summary\n\n`;
        markdown += `This configuration file contains **${blocks.length}** component(s).\n\n`;
        
        // Group by component type
        const groupedBlocks = new Map<string, typeof blocks[number][]>();
        for (const block of blocks) {
            const componentType = block.name.split('.')[0];
            if (!groupedBlocks.has(componentType)) {
                groupedBlocks.set(componentType, []);
            }
            groupedBlocks.get(componentType)!.push(block);
        }
        
        markdown += `### Component Types\n\n`;
        for (const [type, typeBlocks] of groupedBlocks) {
            markdown += `- **${type}**: ${typeBlocks.length} component(s)\n`;
        }
        markdown += `\n`;
        
        // Detailed component documentation
        markdown += `## Components\n\n`;
        
        for (const block of blocks) {
            markdown += `### ${block.name} "${block.label}"\n\n`;
            markdown += `**Line:** ${block.line}\n\n`;
            
            // Add component description based on type
            const description = getComponentDescription(block.name);
            if (description) {
                markdown += `**Description:** ${description}\n\n`;
            }
            
            if (block.attributes.length > 0) {
                markdown += `**Configured Attributes:**\n\n`;
                for (const attr of block.attributes) {
                    markdown += `- \`${attr}\`\n`;
                }
                markdown += `\n`;
            } else {
                markdown += `*No attributes configured.*\n\n`;
            }
        }
    }
    
    return markdown;
}

/**
 * Get description for a component type
 */
function getComponentDescription(componentName: string): string {
    const descriptions: {[key: string]: string} = {
        'prometheus.scrape': 'Scrapes Prometheus metrics from targets',
        'prometheus.remote_write': 'Writes Prometheus metrics to a remote endpoint',
        'prometheus.exporter.postgres': 'Exports PostgreSQL database metrics for Prometheus',
        'loki.write': 'Writes logs to a Loki endpoint',
        'loki.source.file': 'Reads log files from the filesystem',
        'loki.process': 'Processes and transforms log entries',
        'otelcol.receiver.otlp': 'Receives OpenTelemetry data via OTLP protocol',
        'otelcol.processor.batch': 'Batches OpenTelemetry telemetry data',
        'otelcol.exporter.otlp': 'Exports OpenTelemetry data via OTLP protocol',
        'discovery.kubernetes': 'Discovers Kubernetes resources for monitoring',
        'local.file': 'Reads content from a local file',
        'logging': 'Configures Alloy logging settings',
        'tracing': 'Configures distributed tracing settings'
    };
    
    return descriptions[componentName] || '';
}
