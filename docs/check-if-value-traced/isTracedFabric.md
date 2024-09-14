---
outline: deep
---

# isTracedFabric

Checks if the given value is a `tracedFabric`.

## Arguments

* **value** - value that needs to be checked

## Returns

`Boolean`

## Example

```typescript
const traced = traceFabric({ // --> tracedFabric AND traced
  innerArray: [1, 2, 3], // --> tracedValue AND traced
});

console.log(isTracedFabric(traced.value)); // true
console.log(isTracedFabric(traced.value.innerArray)); // false
```
