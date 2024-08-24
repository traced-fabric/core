---
"@traced-fabric/core": minor
---

## Fixes

* Fixed children targetChain not being properly updated when parent structure is reversed, that was causing wrong targetChain output in mutations.

## Code Refactoring

* Removed getTracedValue file and function. It's behavior is now covered by the deepTrace function.

* The library is now using the metadata for the child structures that are inside tracedFabric values. This change allows storing references between children and parent. Mainly used for getTargetChain function.

* The tracedSubscribers weakMap, inside references.ts file, is no longer exported. The usage of it is forward to smaller functions in the same file. references.ts file is not exported by the library to avoid uses interfere with the library behavior.

* Removed onCaughtReference functions and all adjacent code. This behaviour is now covered by the deepTrace, getTracedArray/Object functions.

## New features

* Added isStructure utility function - checks if the given object is a structure (Array or Object)

* Added withoutTracing utility function - ignores tracing recordings in the scope of the given function
