# Grafana Alloy Toolkit

A comprehensive Visual Studio Code extension for working with Grafana Alloy configuration files.

## Features

### 🎨 Syntax Highlighting
- Full syntax highlighting for `.alloy` configuration files
- Support for blocks, attributes, comments, strings, numbers, and operators
- Recognizes common Grafana Alloy components:
  - Prometheus (scrape, remote_write, exporters)
  - Loki (write, source, process)
  - OpenTelemetry (receivers, processors, exporters)
  - Discovery mechanisms
  - And more!

### ✅ Validation
- Real-time validation of Alloy configuration files
- Detects common syntax errors:
  - Unmatched braces
  - Unclosed strings
  - Missing equals operators in attribute assignments
  - Invalid block name patterns
- Helpful error messages and warnings

### 🎯 Code Formatting
- Automatic code formatting for Alloy files
- Proper indentation and spacing
- Format entire document or selected ranges
- Respects comments and preserves structure

### 📦 Code Snippets
Includes snippets for commonly used Grafana Alloy patterns:
- `prom-scrape` - Prometheus scrape configuration
- `prom-remote-write` - Prometheus remote write endpoint
- `loki-write` - Loki write endpoint
- `loki-source-file` - Loki file source
- `loki-process` - Loki process stage
- `otel-receiver-otlp` - OpenTelemetry OTLP receiver
- `otel-processor-batch` - OpenTelemetry batch processor
- `otel-exporter-otlp` - OpenTelemetry OTLP exporter
- `discovery-kubernetes` - Kubernetes service discovery
- `local-file` - Local file reference
- `logging` - Logging configuration
- `tracing` - Tracing configuration
- `basic-auth` - Basic authentication block

### 🎨 Custom File Icon
- Unique file icon for `.alloy` files
- Easy visual identification in the file explorer

## Installation

### From Source
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press F5 to open a new VSCode window with the extension loaded

### From VSIX (when available)
1. Download the `.vsix` file
2. In VSCode, go to Extensions view
3. Click on the "..." menu and select "Install from VSIX..."
4. Select the downloaded `.vsix` file

## Usage

### Syntax Highlighting
Simply open any `.alloy` file and syntax highlighting will be automatically applied.

### Using Snippets
1. Open an `.alloy` file
2. Start typing a snippet prefix (e.g., `prom-scrape`)
3. Press Tab to expand the snippet
4. Use Tab to navigate between placeholder fields

### Formatting
- **Format entire document**: Right-click and select "Format Document" or use `Shift+Alt+F`
- **Format selection**: Select code, right-click, and choose "Format Selection"

### Validation
Validation happens automatically as you type. Look for:
- Red underlines for errors
- Yellow underlines for warnings
- Blue underlines for informational messages

## Example Alloy Configuration

```alloy
// Logging configuration
logging {
    level = "info"
    format = "logfmt"
}

// Prometheus scrape job
prometheus.scrape "my_app" {
    targets = [
        { "__address__" = "localhost:9090" },
    ]
    forward_to = [prometheus.remote_write.default.receiver]
    scrape_interval = "15s"
}

// Prometheus remote write
prometheus.remote_write "default" {
    endpoint {
        url = "http://localhost:9090/api/v1/write"
        
        basic_auth {
            username = "admin"
            password = sys.env("PROM_PASSWORD")
        }
    }
}

// Loki log source
loki.source.file "logs" {
    targets = [
        { "__path__" = "/var/log/*.log" },
    ]
    forward_to = [loki.write.default.receiver]
}

// Loki write endpoint
loki.write "default" {
    endpoint {
        url = "http://localhost:3100/loki/api/v1/push"
    }
}
```

## Requirements

- Visual Studio Code version 1.85.0 or higher

## Extension Settings

This extension contributes the following settings:

- Language ID: `alloy`
- File extensions: `.alloy`

## Known Issues

- Advanced validation features are limited (basic syntax checking only)
- Formatting is opinionated and may not match all style preferences
- Custom icon theme needs to be manually selected in VSCode settings

## Release Notes

### 0.1.0

Initial release of Grafana Alloy Toolkit:
- Syntax highlighting for Alloy files
- Basic validation
- Code formatting
- Comprehensive snippets
- Custom file icon

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Resources

- [Grafana Alloy Documentation](https://grafana.com/docs/alloy/latest/)
- [Grafana Alloy GitHub](https://github.com/grafana/alloy)
- [Alloy Configuration Syntax](https://grafana.com/docs/alloy/latest/get-started/syntax/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Grafana Labs for creating Grafana Alloy
- The VSCode extension development community

---

**Enjoy working with Grafana Alloy!** 🚀
