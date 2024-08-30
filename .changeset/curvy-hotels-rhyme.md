---
"@traced-fabric/core": minor
---

#### ⚠️⚠️⚠️ BREAKING CHANGES ⚠️⚠️⚠️

* Renamed `TTraceChange` to `TMutation`

* `traceFabric` no longer has a `getTrace()` method. Use `trace` value instead.

* `traceFabric` no longer has a `getTraceLength()` method. Use `trace.length` value instead.

#### New features

* Added `iterableWeakMap` to package exports.
