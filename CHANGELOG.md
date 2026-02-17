# svg-path-properties

## 2.0.2

### Patch Changes

- 8ccfe06: Improve README documentation: add package size information and mention JSDoc support for better developer experience.

## 2.0.1

### Patch Changes

- 58a2cfd: Code quality improvements and dependency updates:
  - Optimized distance calculations using Math.hypot() for better performance
  - Removed duplicate boundary checks in arc.ts
  - Extracted and deduplicated tangent normalization logic in bezier.ts
  - Added comprehensive JSDoc documentation to all public APIs
  - Updated all npm dependencies to latest compatible versions
- 58a2cfd: Reduce npm package size by ~50% by removing src folder from published package. Fixes #97.

## 2.0.0

### Major Changes

- 5c64a39: - Rewrote all the library to use more modern libraries.

  - Fixed issue 69.

  The API didn't change but all the file names in dist are different and. are build using different tools too.
