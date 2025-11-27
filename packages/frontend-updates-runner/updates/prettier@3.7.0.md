# Prettier 3.7.0

This update polishes formatting consistency (especially for TypeScript classes and interfaces) and improves plugin capabilities.

We suggest to run to `prettier --write` across the repo to review for style-only changes.

## Major changes

- **TypeScript & Flow formatting**: Aligns class and interface formatting (heritage clauses and generics) for more predictable output and tweaks brace placement behavior for multi-heritage classes and interfaces.
- **GraphQL**: Adds support for executable descriptions (e.g. leading string descriptions before `query`), avoiding syntax errors on valid GraphQL 16.12 syntax.
- **HTML/Handlebars/MDX/YAML**: Reduces unnecessary blank lines and unwanted wrapping, improves table alignment in Markdown, and preserves more original intent in YAML documents.

## Migration notes

- **Formatting diffs**: Expect small but widespread diffs in TypeScript where classes/interfaces have generics or multiple `extends`/`implements` clauses.
- **Plugins**: If you maintain custom Prettier plugins, you may be able to simplify comment handling and ignored-node behavior using the new APIs. Consider updating your plugin to take advantage of these.

References

- **Official 3.7.0 blog post**: https://prettier.io/blog/2025/11/27/3.7.0
