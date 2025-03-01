# TypeScript 5.8

The most impactful update for this release is the new `--erasableSyntaxOnly` option.

As Node.js 23.6 unflagged [experimental support for running TypeScript files directly](https://nodejs.org/api/typescript.html#type-stripping), we can now run TypeScript navitely using Node.js. However this obviously would not work if you have TypeScript-specific syntax with runtime semantics like enums. When the `--erasableSyntaxOnly` is enabled, Typescript will now prevent you to use constructs that cannot be erased.

Another important thing to note is import assertions restriction under `--module nodenext`. TypeScript 5.8 now aligns with Node.j 22 and no longer accepts import assertions using the `assert` syntax and you have to use the `with` keyword.

```typescript
// An import assertion ❌ - not future-compatible with most runtimes.
import data from "./data.json" assert { type: "json" };

// An import attribute ✅ - the preferred way to import a JSON file.
import data from "./data.json" with { type: "json" };
```

Read the full release notes [here](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/) and happy update!
