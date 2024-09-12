---
"@traced-fabric/core": minor
---

#### New Features

- Added `isAssigning(...)` function to ignore any modification to a `traced` structures in the given function (deleting, adding, or changing the values). But the `mutations` will be recorded.

- Added `isisAssigning(...)` function to check if the `traced` structures will accept any modification.
