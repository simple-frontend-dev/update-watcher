## TypeScript 5.9.2

### **Minimal and Updated `tsc --init`**

The TypeScript compiler now generates a more streamlined `tsconfig.json` with better defaults: [details](https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/#minimal-and-updated-tsc---init)

### **Support for `import defer`**

TypeScript 5.9 introduces support for ECMAScript's deferred module evaluation proposal using the new `import defer` syntax. This feature allows you to import a module without immediately executing the module and its dependencies, providing better control over when work and side-effects occur.

**Key Benefits:**

- Module evaluation is deferred until you access a property of the imported namespace
- Only namespace imports are supported: `import defer * as feature from "./some-feature.js"`
- Useful for conditionally loading modules with expensive initialization
- Can improve startup performance by deferring module evaluation until needed

**Usage Example:**

```typescript
import defer * as feature from "./some-feature.js";

// No side effects have occurred yet
// Module is only evaluated when accessing a property:
console.log(feature.specialConstant); // Now side effects occur
```

**Limitations:**

- Only works with `--module` modes `preserve` and `esnext`
- Not transformed by TypeScript - requires runtime support or bundler transformation
- Named imports and default imports are not supported

### **Summary Descriptions in DOM APIs**

TypeScript now includes summary descriptions for many DOM APIs based on MDN documentation, providing quick context without needing to visit external documentation.

### **Expandable Hovers (Preview)**

New preview feature that allows expanding quick info tooltips to see deeper type information with configurable maximum hover length.

### **Performance Optimizations** with cache instantiations on mappers and file system optimizations

### **Notable Behavioral Changes**: **lib.d.ts Changes**

- `ArrayBuffer` is no longer a supertype of `TypedArray` types
- May affect code using `Buffer` from Node.js with `ArrayBuffer` types
- New error messages for type mismatches between `ArrayBufferLike` and `BufferSource`

## **Migration Notes**

- Review any code using `ArrayBuffer` with `TypedArray` or `Buffer` types
- Consider updating `tsconfig.json` files to use new defaults
- Test expandable hovers feature in your editor
- Update hover length settings if needed

## **Resources**

- [TypeScript 5.9 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/)
- [TypeScript Configuration Reference](https://www.typescriptlang.org/tsconfig/)

Happy update!
