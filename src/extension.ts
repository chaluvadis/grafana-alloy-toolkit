import * as vscode from 'vscode';

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

        // Check for unmatched braces
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        
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
        const blockPattern = /^\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s+"([^"]+)"\s*\{/;
        const blockMatch = line.match(blockPattern);
        if (blockMatch) {
            const blockName = blockMatch[1];
            // Warn if block name doesn't follow common patterns
            if (!blockName.includes('.')) {
                const range = new vscode.Range(lineNumber, 0, lineNumber, line.length);
                const diagnostic = new vscode.Diagnostic(
                    range,
                    'Block name should typically include a namespace (e.g., "prometheus.scrape", "loki.write")',
                    vscode.DiagnosticSeverity.Information
                );
                diagnostics.push(diagnostic);
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
        let line = lines[i].trim();
        
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
