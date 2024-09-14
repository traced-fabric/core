---
outline: deep
---

# deepClone

Deep clone an object or array.

Primarily used to clone `tracedFabric` and `tracedValues` without inheriting proxy traps, and potentially breaking tracedFabric.

> [!NOTE]
> `deepClone(...)` will not copy symbols

## Arguments

* **value** - The value to clone

## Returns

The cloned value

## Example

```typescript
const fabric = traceFabric({ season: 'winter', bestDays: [2, 7, 16] });
const clone = deepClone(fabric.value);

console.log(clone); // { season: 'winter', bestDays: [2, 7, 16] }
console.log(clone === fabric.value); // false
console.log(clone.bestDays === fabric.value.bestDays); // false
```
