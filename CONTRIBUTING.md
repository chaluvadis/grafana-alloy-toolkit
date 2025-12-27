# Contributing to Grafana Alloy Toolkit

Thank you for your interest in contributing to the Grafana Alloy Toolkit VSCode extension! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Visual Studio Code (v1.85.0 or higher)
- Git

### Setting Up the Development Environment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chaluvadis/grafana-alloy-toolkit.git
   cd grafana-alloy-toolkit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile the TypeScript code:**
   ```bash
   npm run compile
   ```

4. **Open in VSCode:**
   ```bash
   code .
   ```

### Running the Extension in Development Mode

1. Open the project in VSCode
2. Press `F5` to launch a new VSCode window with the extension loaded
3. Open or create an `.alloy` file to test the extension features
4. Make changes to the source code
5. Press `Ctrl+R` (or `Cmd+R` on Mac) in the extension development window to reload

## Development Workflow

### Project Structure

```
.
├── src/                    # TypeScript source files
│   └── extension.ts        # Main extension entry point
├── syntaxes/              # TextMate grammar files
│   └── alloy.tmLanguage.json
├── snippets/              # Code snippets
│   └── alloy.json
├── icons/                 # Extension and file icons
├── fileicons/            # File icon theme
├── .vscode/              # VSCode configuration
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
└── README.md             # Documentation
```

### Available Scripts

- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch mode for development (auto-compile on changes)
- `npm run lint` - Run ESLint on source files

### Making Changes

#### Syntax Highlighting

Edit `syntaxes/alloy.tmLanguage.json` to modify syntax highlighting rules. The file uses TextMate grammar format.

Key sections:
- `patterns` - Top-level patterns
- `repository` - Reusable pattern definitions

#### Snippets

Edit `snippets/alloy.json` to add or modify code snippets. Each snippet has:
- `prefix` - Trigger text
- `body` - Snippet content (array of lines)
- `description` - Displayed in IntelliSense

#### Validation and Formatting

Edit `src/extension.ts` to modify validation rules or formatting behavior.

Key functions:
- `validateAlloyDocument()` - Add validation rules
- `formatAlloyText()` - Modify formatting logic

### Testing Your Changes

1. **Manual Testing:**
   - Open the example.alloy file
   - Test syntax highlighting
   - Test code snippets (type snippet prefix and press Tab)
   - Test formatting (Right-click → Format Document)
   - Test validation (introduce syntax errors)

2. **Visual Verification:**
   - Ensure syntax highlighting looks correct
   - Check that error messages are helpful
   - Verify formatting produces readable code

## Contribution Guidelines

### Code Style

- Use TypeScript for all source code
- Follow the existing code style
- Run `npm run lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Use clear, descriptive commit messages:

```
Add validation for missing semicolons

- Detect missing semicolons in attribute assignments
- Add diagnostic message with severity warning
- Include test case in example.alloy
```

### Pull Request Process

1. **Fork the repository** and create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly:**
   - Compile without errors: `npm run compile`
   - Pass linting: `npm run lint`
   - Test manually in VSCode

4. **Update documentation:**
   - Update README.md if adding features
   - Update CHANGELOG.md with your changes
   - Add JSDoc comments to new functions

5. **Submit a pull request:**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

### What to Contribute

We welcome contributions in these areas:

- **Bug fixes** - Fix issues with syntax highlighting, validation, or formatting
- **New snippets** - Add snippets for common Alloy patterns
- **Improved validation** - Better error detection and messages
- **Documentation** - Improvements to README, examples, or inline docs
- **Tests** - Add test infrastructure and test cases
- **Performance** - Optimize validation or formatting performance

## Reporting Issues

When reporting issues, please include:

- VSCode version
- Extension version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Sample `.alloy` file demonstrating the issue (if applicable)

## Questions?

Feel free to:
- Open an issue for discussion
- Ask questions in pull request comments
- Check existing issues and pull requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Grafana Alloy Toolkit! 🚀
