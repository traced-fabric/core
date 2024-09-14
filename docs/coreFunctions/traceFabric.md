---
outline: deep
---

# 🔧 `traceFabric(...)`

Track the mutation of a given JSON-like object or array. Other `tracedFabric` can be nested inside.

The `trace` (array of `mutations`), that is produced by the `tracedFabric` on values mutation, can be used to apply them to other objects or arrays, using the `applyTrace(...)` function.

## Arguments

* **value** - an object or array that will be deeply tracked. Value is JSON.stringify safe. The type of the value should be the same as JSONStructure.
* **onMutation** _optional_ - a function that is triggered when the `traced` value is mutated. The function receives the `mutation` as an argument and should return the `mutation` to be saved to the `trace`. If no modification is needed, return the original mutation; otherwise, return the modified mutation for storage.

## Returns

Object with the following properties:

* **value** - the `traced` proxy of the given **value**.
* **trace** - the array of `mutations` that are made to the **value**.
* **clearTrace** - a function that clears the trace.

## Example

```typescript
const bestDays = traceFabric([2, 7, 16]);
const fabric = traceFabric({
  season: 'winter',
  bestDays: bestDays.value,
});

fabric.value.season = 'summer';
fabric.value.bestDays.push(25);
bestDays.value.push(26);

console.log(fabric.trace);
// [{
//   mutated: 'object', type: 'set',
//   targetChain: ['season'],
//   value: 'summer',
// }, {
//   mutated: 'array', type: 'set',
//   targetChain: ['bestDays', 3],
//   value: 25,
// }, {
//   mutated: 'array', type: 'set',
//   targetChain: ['bestDays', 4],
//   value: 26,
// }]
```

With the custom `onMutation` function, that adds a timestamp to the mutation.
```typescript
const bestDays = traceFabric([2, 7, 16]);
const fabric = traceFabric({
  season: 'winter',
  bestDays: bestDays.value,
}, mutation => ({
  ...mutation,
  timestamp: Date.now(),
}));

fabric.value.season = 'summer';
fabric.value.bestDays.push(25);
bestDays.value.push(26);

console.log(fabric.trace);
// [{
//   mutated: 'object',
//   targetChain: ['season'],
//   value: 'summer',
//   type: 'set',
//   timestamp: 1725368703427,
// }, {
//   mutated: 'array',
//   targetChain: ['bestDays', 3],
//   value: 25,
//   type: 'set',
//   timestamp: 1725368703428,
// }, {
//   mutated: 'array',
//   targetChain: ['bestDays', 4],
//   value: 26,
//   type: 'set',
//   timestamp: 1725368703428,
// }]
```
