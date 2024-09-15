---
outline: deep
---

# isTracingEnabled

Check if the given value has `tracing` enabled.

## Arguments

* **value** - the value to check

## Returns

`true` if the value is enabled for tracing, `false` otherwise.

## Example

```typescript
const fabric = traceFabric({
  tracedArray: [1, 2, 3],
  untracedArray: disableTracing([4, 5, 6]),
});

console.log(isTracingEnabled(fabric.value.tracedArray)); // true;
console.log(isTracingEnabled(fabric.value.untracedArray)); // false;
```
