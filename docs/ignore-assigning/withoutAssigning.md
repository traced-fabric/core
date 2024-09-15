---
outline: deep
---

# withoutAssigning

Ignores any modification to a `traced` structure in the given function (deleting, adding, or changing the values). The function should not be async, as it turns off the `assigning` globally.

> [!WARNING]
> Use with caution, as it can lead to breaking `applyTrace` function, because `traced` items inside of the function will not recorded any modification.

## Arguments

* **callback** - function in which `assigning` is disabled

## Returns

Same as the return value of the given function

## Example

```typescript
const fabric = traceFabric({ season: 'winter' });
fabric.value.season = 'spring'; // assignment is recorded

withoutAssigning(() => {
  fabric.value.season = 'summer'; // assignment is NOT recorded
});

console.log(fabric.value);
// { season: 'spring' }
```
