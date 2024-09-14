---
outline: deep
---

# isTracedValue

Checks if the given value is a `tracedValue`.

## Arguments

* **value** - value that needs to be checked

## Returns

`Boolean`

## Example

```typescript
const traced = traceFabric({ // --> tracedFabric AND traced
  innerArray: [1, 2, 3], // --> tracedValue AND traced
});

console.log(isTracedValue(traced.value)); // false
console.log(isTracedValue(traced.value.innerArray)); // true
```
