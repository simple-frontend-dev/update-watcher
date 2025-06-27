# Vite 7.0.0

Major release with significant improvements to browser targeting, Node.js support, and new experimental features.

## Key Changes

**Node.js Support**

- **Requires Node.js 20.19+ or 22.12+** (dropped Node.js 18 support)
- **ESM-only distribution** with `require(esm)` support for better compatibility

**Browser Targeting**

- **New default**: `'baseline-widely-available'` (was `'modules'`)
- **Updated browser targets**:
  - Chrome: 87 → 107
  - Edge: 88 → 107
  - Firefox: 78 → 104
  - Safari: 14.0 → 16.0

**Experimental Features**

- **Environment API**: Enhanced with new `buildApp` hook for plugin coordination
- **Rolldown integration**: Try `rolldown-vite` package for faster builds (future default bundler)
- **Vite DevTools**: Coming soon for deeper debugging and analysis

## Migration Notes

- **Smooth upgrade** from Vite 6 with minimal breaking changes
- **Removed deprecated features**: Sass legacy API, `splitVendorChunkPlugin`
- **Vitest 3.2+** required for Vite 7 compatibility

This release focuses on modern browser support, improved performance, and laying groundwork for future bundler improvements.

[Vite 7 blog post](https://vite.dev/blog/announcing-vite7.html) | [Migration guide](https://vite.dev/guide/migration.html) | [Full Changelog](https://github.com/vitejs/vite/blob/v7.0.0/packages/vite/CHANGELOG.md)
