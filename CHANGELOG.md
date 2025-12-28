# Change Log

All notable changes to the "Grafana Alloy Toolkit" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2024-12-28

### Added
- **Documentation Generation**: New command to automatically generate Markdown documentation from Alloy files
  - Accessible via context menu and command palette
  - Generates comprehensive documentation with component summaries
  - Includes component descriptions, attributes, and line references
- **PostgreSQL Exporter Support**: Enhanced validation for `prometheus.exporter.postgres` components
  - Validates required `data_source_names` attribute
  - Provides helpful warnings for missing configuration
- **New Snippet**: Added `prom-exporter-postgres` snippet for PostgreSQL exporter configuration
  - Includes data source names, collector configuration, and custom queries setup

### Changed
- Updated validation messages to include PostgreSQL exporter examples
- Enhanced component descriptions in documentation generator

### Fixed
- Improved file icon configuration for better visibility in VSCode

## [0.1.0] - 2024-12-27

### Added
- Initial release of Grafana Alloy Toolkit VSCode extension
- Syntax highlighting for `.alloy` configuration files
  - Support for blocks, attributes, comments, strings, numbers
  - Recognition of common Alloy components (Prometheus, Loki, OpenTelemetry)
  - Keyword, operator, and constant highlighting
- Real-time validation and diagnostics
  - Unmatched braces detection
  - Unclosed string detection
  - Missing equals operator warnings
  - Block name pattern validation
- Document formatting support
  - Automatic indentation with tabs
  - Format entire document or selection
  - Preserves comments and empty lines
- Comprehensive code snippets
  - `prom-scrape` - Prometheus scrape configuration
  - `prom-remote-write` - Prometheus remote write
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
  - `basic-auth` - Basic authentication
- Custom file icon for `.alloy` files
- Language configuration
  - Auto-closing pairs for brackets, quotes
  - Comment toggling support
  - Bracket matching and folding
- Development infrastructure
  - TypeScript compilation setup
  - ESLint configuration
  - VSCode debugging configuration
  - Example `.alloy` file for testing
- Documentation
  - Comprehensive README with usage examples
  - MIT License
  - This CHANGELOG

### Technical Details
- Minimum VSCode version: 1.85.0
- Language ID: `alloy`
- File extension: `.alloy`
- Grammar scope: `source.alloy`

---

## Future Enhancements

Potential features for future releases:
- Enhanced validation using Alloy CLI integration
- Auto-completion for block names and attributes
- Hover documentation for components
- Go-to-definition for component references
- Symbol navigation and outline
- Integration with Alloy runtime for live validation
- Debugging support for Alloy configurations
- Integration with Grafana for deployment

---

[Unreleased]: https://github.com/chaluvadis/grafana-alloy-toolkit/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/chaluvadis/grafana-alloy-toolkit/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/chaluvadis/grafana-alloy-toolkit/releases/tag/v0.1.0
