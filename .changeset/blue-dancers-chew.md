---
"@traced-fabric/core": minor
---

#### New features

- Array **push** function adds one mutation to the trace. Push mutation definition will be added to the trace when pushing multiple values, otherwise, set mutation will be added.

- Array **shift** function adds one mutation to the trace.

- Array **unshift** function adds one mutation to the trace.

- `EArrayMutation` and `TArrayMutation` types extended to have **push**, **shift**, **unshift** mutations.

- Added better type support for `isStructure` function.
