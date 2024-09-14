---
outline: deep
---

# 🔧 `applyTrace(...)`

Applies `tracedFabric` `mutations` to the given value. The value should have the same state as the `traceFabric` value before allied mutations.

> [!WARNING]
> This function mutates the value directly.

## Arguments

* **value** - the object to which the **trace** will be directly applied.
* **trace** - the `trace` (array of `mutations`) to apply to the given **value**.

## Example

```typescript
const fabric = traceFabric({
  season: 'winter',
  besetDays: [12, 15, 17],
});
const target = {
  season: 'winter',
  besetDays: [12, 15, 17],
};

target.season = 'summer';
target.besetDays.push(20);

applyTrace(target, fabric.trace);

console.log(target);
// {
//   season: "summer",
//   besetDays: [ 12, 15, 17, 20 ],
// }
```
