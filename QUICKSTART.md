# Quick Start Guide - Grafana Alloy Toolkit

This guide will help you get started with the Grafana Alloy Toolkit VSCode extension.

## Installation

### Development/Testing Installation

Since this is the initial scaffolding version, you can install it locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chaluvadis/grafana-alloy-toolkit.git
   cd grafana-alloy-toolkit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile the extension:**
   ```bash
   npm run compile
   ```

4. **Run in VSCode:**
   - Open the project in VSCode
   - Press `F5` to launch a new VSCode window with the extension loaded
   - Or use the command: `Developer: Inspect Editor Tokens and Scopes`

## Features Overview

### 1. Syntax Highlighting

Open any `.alloy` file and you'll automatically get:
- Color coding for keywords, strings, numbers, and operators
- Block name highlighting (e.g., `prometheus.scrape`, `loki.write`)
- Comment highlighting (both `//` and `/* */` styles)
- Function and attribute highlighting

### 2. Code Snippets

Type a snippet prefix and press `Tab` to expand:

| Prefix | Description |
|--------|-------------|
| `prom-scrape` | Prometheus scrape configuration |
| `prom-remote-write` | Prometheus remote write endpoint |
| `loki-write` | Loki write endpoint |
| `loki-source-file` | Loki file source |
| `loki-process` | Loki process stage |
| `otel-receiver-otlp` | OpenTelemetry OTLP receiver |
| `otel-processor-batch` | OpenTelemetry batch processor |
| `otel-exporter-otlp` | OpenTelemetry OTLP exporter |
| `discovery-kubernetes` | Kubernetes service discovery |
| `logging` | Logging configuration |
| `tracing` | Tracing configuration |
| `basic-auth` | Basic authentication block |

### 3. Validation

The extension provides real-time validation:
- **Errors** (red underlines): Unmatched braces, unclosed strings
- **Warnings** (yellow underlines): Missing equals operators
- **Info** (blue underlines): Block name suggestions

### 4. Formatting

Format your code with:
- `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (Mac) - Format entire document
- Right-click → "Format Document"
- Right-click → "Format Selection" (for selected text)

### 5. File Icons

The extension provides a custom icon for `.alloy` files in the file explorer.

To enable the custom icon theme:
1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "File Icon Theme"
3. Select "Alloy File Icons"

## Example Usage

1. **Create a new file** named `config.alloy`

2. **Start typing a snippet:**
   ```
   prom<Tab>
   ```
   This expands to a Prometheus scrape configuration

3. **Fill in the placeholders** by pressing `Tab` to move between fields

4. **Format the document** with `Shift+Alt+F`

5. **Save the file** - validation will run automatically

## Working with the Example File

The repository includes `example.alloy` which demonstrates:
- Logging configuration
- Prometheus scraping and remote write
- Loki log collection and processing
- OpenTelemetry receiver, processor, and exporter
- Kubernetes service discovery
- Comments and multi-line blocks

Open this file to see syntax highlighting and test the features!

## Troubleshooting

### Syntax Highlighting Not Working

1. Check that your file has the `.alloy` extension
2. Look at the bottom-right corner of VSCode - it should say "Alloy"
3. If it says "Plain Text", click it and select "Alloy"

### Snippets Not Appearing

1. Make sure you're in an `.alloy` file
2. Try typing the full prefix (e.g., `prom-scrape`)
3. Check that IntelliSense is enabled in VSCode settings

### Validation Errors

The validation is basic and may show false positives. You can:
- Ignore informational messages (blue underlines)
- Use the Alloy CLI for comprehensive validation
- Report bugs to help improve the extension

## Next Steps

- Explore the `snippets/alloy.json` file to see all available snippets
- Read the `CONTRIBUTING.md` file to learn how to add features
- Check the Grafana Alloy documentation: https://grafana.com/docs/alloy/latest/

## Getting Help

- Report issues: https://github.com/chaluvadis/grafana-alloy-toolkit/issues
- Read the full README: https://github.com/chaluvadis/grafana-alloy-toolkit
- Grafana Alloy docs: https://grafana.com/docs/alloy/latest/

---

Happy configuring! 🚀
