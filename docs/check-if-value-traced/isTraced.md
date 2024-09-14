---
outline: deep
---

# isTraced

Checks if the given value is a `traced`.

## Arguments

* **value** - value that needs to be checked

## Returns

`Boolean`

## Example

```typescript
const traced = traceFabric({ // --> tracedFabric AND traced
  innerArray: [1, 2, 3], // --> tracedValue AND traced
});

console.log(isTraced(traced.value)); // true
console.log(isTraced(traced.value.innerArray)); // true
```
