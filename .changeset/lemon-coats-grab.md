---
"@traced-fabric/core": minor
---

#### Fixes

- Fixed memory leak when using globally declared tracedFabric referenced by the locally created tracedFabrics.

#### Code Refactoring

- TracedFabric values sending the updates are now using iterable weakMap to store the subscribers. This removes memory leaks when the subscriber is not used anymore and is garbage collected (previously, despite subscribers being garbage collected, their weak ref was stored anyway).

#### New features

- Added `removeTraceSubscription(...)` function. This allows tracedFabric to be unsubscribed from trace updates of another nested tracedFabric. The main purpose of this function is to manually remove references when the parent tracedFabric is no longer needed. Please use it cautiously, as it can cause mutations not to be recorded in the parent tracedFabric. The main benefit of `removeTraceSubscription(...)` is that it will speed up garbage collection of unused values.
