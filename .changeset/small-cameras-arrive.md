---
"@traced-fabric/core": patch
---

traceFabric(...) now exposes setter for trace. This allows you to change the trace after the fact, or make trace with a proxy, if you want to use with Vue or other reactive frameworks.
