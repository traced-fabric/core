---
outline: deep
---

# withoutTracing

Ignores recording of all `mutations` to `trace` in the given function.
The function should not be async, as it turns off the tracing globally.

> [!WARNING]
> Use with caution, as it can lead to breaking `applyTrace` function, because of the missing mutations.

## Arguments

* **callback** - function in which `tracing` is disabled

## Returns

Same as the return value of the given function

## Example

```typescript
const fabric = traceFabric({ season: 'winter' });

fabric.value.season = 'spring'; // adds mutation to the traceLogs
withoutTracing(() => {
  fabric.value.season = 'summer'; // no mutation is added to the traceLogs
});

console.log(fabric.trace);
// [{
//   mutated: "object",
//   targetChain: [ "season" ],
//   value: "spring",
//   type: "set",
// }]
```
