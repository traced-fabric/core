---
"@traced-fabric/core": minor
---

#### New features

- Added `disableTracing(...)` function to disable `tracing` for a specific objects. Primarily used for static values that should not be traced or modified, also to reduce memory usage and improve performance. The value will be modifiable, but the `mutations` will not be recorded.

- Added `enableTracing(...)` function to enable `tracing` for a specific object if `tracing` been disabled for it. There is a caveat, if you will use this function on a `tracedFabric` value, this will not proxify the value again, it will just enable the `tracing` for it, so `traceFabric` will not ignore the value anymore.

- Added `isTracingEnabled(...)` function to check if `tracing` is enabled for a specific object.
