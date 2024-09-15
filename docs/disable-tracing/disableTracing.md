---
outline: deep
---

# disableTracing

Disable `tracing` for the given value.

The value will be modifiable, but the `mutations` will not be recorded.

Primarily used for static values that should not be traced or modified, also to reduce memory usage and improve performance.

## Arguments

* **value** - the value to disable tracing.

## Returns

Same as the given **value** with tracing disabled.

## Example

```typescript
const fabric = traceFabric({
  tracedArray: [1, 2, 3],
  untracedArray: disableTracing([4, 5, 6]),
});

console.log(isTracingEnabled(fabric.value.tracedArray)); // true;
console.log(isTracingEnabled(fabric.value.untracedArray)); // false;
```
