# @traced-fabric/core

## 0.12.2

### Patch Changes

- Updated JSDoc for all exported functions

## 0.12.1

### Patch Changes

- 1032378: Updated JSDoc

## 0.12.0

### Minor Changes

#### New Features

- Added `isAssigning(...)` function to check if the `traced` structures will accept any modification.

- Added `withoutAssigning(...)` function to ignore any modification to a `traced` structures in the given function (deleting, adding, or changing the values). But the `mutations` will be recorded.

## 0.10.5

### Patch Changes

- Updated Readme to include license

## 0.10.4

### Patch Changes

- @traced-fabric/core now is a monorepo

## 0.10.3

### Patch Changes

- Minor improvements (code refactoring)

## 0.10.2

### Patch Changes

- 4ce7cb7: Fixed disableTracing.ts not being exported by the library

## 0.10.1

### Patch Changes

- Slightly reduced memory usage

## 0.10.0

### Minor Changes

#### New features

- Added `disableTracing(...)` function to disable `tracing` for a specific objects. Primarily used for static values that should not be traced or modified, also to reduce memory usage and improve performance. The value will be modifiable, but the `mutations` will not be recorded.

- Added `enableTracing(...)` function to enable `tracing` for a specific object if `tracing` been disabled for it. There is a caveat, if you will use this function on a `tracedFabric` value, this will not proxify the value again, it will just enable the `tracing` for it, so `traceFabric` will not ignore the value anymore.

- Added `isTracingEnabled(...)` function to check if `tracing` is enabled for a specific object.

## 0.9.0

### Minor Changes

#### ⚠️⚠️⚠️ BREAKING CHANGES ⚠️⚠️⚠️

- Renamed `isTracedRootValue` to `isTracedFabric`

#### New features

- Updated JS Doc for all exported functions.

## 0.8.2

### Patch Changes

- b23dc9d: Updated package details

## 0.8.1

### Patch Changes

- eaed3a6: Fixed array reverse mutation being pushed without calling the function

## 0.8.0

### Minor Changes

#### New features

- Array **push** function adds one mutation to the trace. Push mutation definition will be added to the trace when pushing multiple values, otherwise, set mutation will be added.
- Array **shift** function adds one mutation to the trace.
- Array **unshift** function adds one mutation to the trace.
- `EArrayMutation` and `TArrayMutation` types extended to have **push**, **shift**, **unshift** mutations.

- Added better type support for `isStructure` function.

## 0.7.1

### Patch Changes

- 6851dde: Updated Readme file

## 0.7.0

### Minor Changes

#### ⚠️⚠️⚠️ BREAKING CHANGES ⚠️⚠️⚠️

- Renamed `TTraceChange` to `TMutation`

- `traceFabric` no longer has a `getTrace()` method. Use `trace` value instead.
- `traceFabric` no longer has a `getTraceLength()` method. Use `trace.length` value instead.

#### New features

- Added `iterableWeakMap` to package exports.

## 0.6.0

### Minor Changes

#### ⚠️⚠️⚠️ BREAKING CHANGES ⚠️⚠️⚠️

- `deepTrace(...)` function is no longer exported from the package.
- `getTracedArray(...)` function is no longer exported from the package.
- `getTracedObject(...)` function is no longer exported from the package.

#### New features

- You can now add `onMutation` callback to the traced object as a second argument. With `onMutation` you can add additional logic when the object is mutated, and change the structure of trace that will be recorded to the traceLog.

- Added `TOnMutation` type for easier creation of `onMutation` callback.

- `JSONPrimitive` type is now also includes an **undefined** type in it.

- `TArrayMutation` and `TObjectMutation` are now contain the **value** definition no matter of type, defaults to `value?: never`.

#### Code Refactoring

- Added weakMap for tracedFabric mutationCallbacks that handles the `onMutation` callbacks. Primarily used for nested tracedFabrics to call dedicated `onMutation` callbacks.

## 0.5.0

### Minor Changes

- cb3f8c1: Reqursievly nested tracedFabrics now all get traceLogs updated if the deepest of them updates

## 0.4.2

### Patch Changes

- acc2efa: Fixed issue with FinalizationRegistry cleanup not being called on Bun.gc

## 0.4.1

### Patch Changes

- 7b2c5df: Increased garbage collection speed of IterableWeakMap

## 0.4.0

### Minor Changes

#### Fixes

- Fixed memory leak when using globally declared tracedFabric referenced by the locally created tracedFabrics.

#### Code Refactoring

- TracedFabric values sending the updates are now using iterable weakMap to store the subscribers. This removes memory leaks when the subscriber is not used anymore and is garbage collected (previously, despite subscribers being garbage collected, their weak ref was stored anyway).

#### New features

- Added `removeTraceSubscription(...)` function. This allows tracedFabric to be unsubscribed from trace updates of another nested tracedFabric. The main purpose of this function is to manually remove references when the parent tracedFabric is no longer needed. Please use it cautiously, as it can cause mutations not to be recorded in the parent tracedFabric. The main benefit of `removeTraceSubscription(...)` is that it will speed up garbage collection of unused values.

## 0.3.1

### Patch Changes

#### Fixes

- Fixed issue when deleted value with other tracedFabrics keeps updating the parent tracedFabric.

## 0.3.0

### Minor Changes

#### Code Refactoring

- Removed symbols that were indicating if the value is generated by the tracedFabric.

- Removed TTracedFabricValue type. Originally it was used to indicate that value is generated by the tracedFabric and it is traced. Now isTraced functions is a replacement for it (see New features).

#### New features

- Added isTraced. It checks if the given value is traced by the tracedFabric, and changes are recorded.

- Added isTracedRootValue. It checks if the given value is a root value of the tracedFabric.

- Added isTracedValue. It checks if the given value is a traced value, but not a root value.

## 0.2.0

### Minor Changes

#### Fixes

- Fixed children targetChain not being properly updated when the parent array is reversed, causing wrong targetChain output in mutations.

#### Code Refactoring

- Removed getTracedValue file and function. Its behaviour is now covered by the deepTrace function.

- The library is now using the metadata for the child structures that are inside tracedFabric values. This change allows storing references between children and parents. It is mainly used for the getTargetChain function.

- The tracedSubscribers weakMap, inside the references.ts file, is no longer exported. The usage of it is forward to smaller functions in the same file. the library does not export references.ts file to avoid uses interfering with the library behaviour.

- Removed onCaughtReference functions and all adjacent code. This behaviour is now covered by the deepTrace, getTracedArray/Object functions.

- applyObjectMutation, applyArrayMutation, getMutationTargetWithoutLastKey are no longer exported by the library. They are now used internally by the applyMutation function.

#### New features

- Added isStructure utility function - checks if the given object is a structure (Array or Object)

- Added withoutTracing utility function - ignores tracing recordings in the scope of the given function

## 0.1.4

### Patch Changes

- 5a85fa8: Exporting traceFabric unique symbols

## 0.1.3

### Patch Changes

- 3444856: Fixed package exports

## 0.1.1

### Patch Changes

- 4292aff: Fixed missing imports of the core fucntions
- bbeb7b5: Fixed readme code. stateOfTheApp should be stateOfTheApp.value when stringify.

## 0.1.0

### Minor Changes

- cc82cf9: Released the package
