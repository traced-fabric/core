---
"@traced-fabric/core": minor
---

#### ⚠️⚠️⚠️ BREAKING CHANGES ⚠️⚠️⚠️

- `deepTrace(...)` function is no longer exported from the package.
- `getTracedArray(...)` function is no longer exported from the package.
- `getTracedObject(...)` function is no longer exported from the package.

#### New features

- You can now add `onMutation` callback to the traced object as a second argument.
With `onMutation` you can add additional logic when the object is mutated, and change the structure of trace that will be recorded to the traceLog.

- Added `TOnMutation` type for easier creation of `onMutation` callback.

- `JSONPrimitive` type is now also includes an **undefined** type in it.

- `TArrayMutation` and `TObjectMutation` are now contain the **value** definition no matter of type, defaults to `value?: never`.

#### Code Refactoring

- Added weakMap for tracedFabric mutationCallbacks that handles the `onMutation` callbacks. Primarily used for nested tracedFabrics to call dedicated `onMutation` callbacks.
