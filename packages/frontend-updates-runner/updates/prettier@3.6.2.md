# Prettier 3.6.2

This update brings Prettier from 3.5.x to 3.6.2. The experimental CLI is particularly noteworthy for teams working with large codebases.

## Major Features from 3.6.0

### Experimental Fast CLI

Prettier 3.6 introduces an experimental high-performance CLI that can be enabled with the `--experimental-cli` flag or `PRETTIER_EXPERIMENTAL_CLI=1` environment variable. This provides significant performance improvements for large codebases.

### New Official Plugins

- **@prettier/plugin-oxc**: Based on OXC (fast JavaScript/TypeScript parser in Rust), providing `oxc` and `oxc-ts` parsers
- **@prettier/plugin-hermes**: Based on Hermes JS Engine, providing a new `hermes` parser for Flow syntax (planned to replace `babel-flow` in v4)

### JavaScript Formatting Improvements

- **SequenceExpression Parentheses**: Added parentheses to `SequenceExpression` in `ReturnStatement` and `ExpressionStatement` for better code clarity
- **AssignmentExpression Consistency**: Added parentheses to `AssignmentExpression` in class property keys for consistency with object keys

### TypeScript Formatting Improvements

- **Consistent Number Parentheses**: Added parentheses to numbers in optional member expressions (e.g., `(1)?.toString()`) for consistency across all parsers and to prevent syntax errors when removing optional chaining
- **Parser Consistency**: Resolved inconsistencies between Babel and TypeScript parsers for better cross-parser compatibility

## Bug Fixes

- **3.6.1**: Fixed "Warning: File descriptor 39 closed but not opened in unmanaged mode" error when running `--experimental-cli`
- **3.6.2**: Added missing blank line around code blocks for better formatting output readability

[Full release notes](https://github.com/prettier/prettier/blob/main/CHANGELOG.md#362)
