---
"@traced-fabric/core": minor
---

## Fixes

* Fixed children targetChain not being properly updated when the parent array is reversed, causing wrong targetChain output in mutations.

## Code Refactoring

* Removed getTracedValue file and function. Its behaviour is now covered by the deepTrace function.

* The library is now using the metadata for the child structures that are inside tracedFabric values. This change allows storing references between children and parents. It is mainly used for the getTargetChain function.

* The tracedSubscribers weakMap, inside the references.ts file, is no longer exported. The usage of it is forward to smaller functions in the same file. the library does not export references.ts file to avoid uses interfering with the library behaviour.

* Removed onCaughtReference functions and all adjacent code. This behaviour is now covered by the deepTrace, getTracedArray/Object functions.

* applyObjectMutation, applyArrayMutation, getMutationTargetWithoutLastKey are no longer exported by the library. They are now used internally by the applyMutation function.

## New features

* Added isStructure utility function - checks if the given object is a structure (Array or Object)

* Added withoutTracing utility function - ignores tracing recordings in the scope of the given function
