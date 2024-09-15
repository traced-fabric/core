---
outline: deep
---

# enableTracing

Enable `tracing` for the given value.

> [!NOTE]
> This function will not enable `mutations` recording for the value that is
> already part of the `tracedFabric`, because it was not processed to be a `tracedValue`.
> To do so, please use this approach:
> ```typescript
> withoutTracing(() => {
>   fabric.value.untracedArray = enableTracing(fabric.value.untracedArray);
> });
> ```

## Arguments

* **value** - the value to enable tracing.

## Returns

Same as the given **value** with tracing enabled.

## Example

```typescript
const fabric = traceFabric({
  tracedArray: [1, 2, 3],
  untracedArray: disableTracing([4, 5, 6]),
});

console.log(isTracingEnabled(fabric.value.tracedArray)); // true;
console.log(isTracingEnabled(fabric.value.untracedArray)); // false;

withoutTracing(() => {
  fabric.value.untracedArray = enableTracing(fabric.value.untracedArray);
});

console.log(isTracingEnabled(fabric.value.untracedArray)); // true;
```
