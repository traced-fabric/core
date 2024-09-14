---
outline: deep
---

# isTracing

Check if tracing is enabled.
If the tracing is enabled, the `mutations` are recorded in the `trace`.

## Returns

`Boolean`

## Example

```typescript
console.log(isTracing()); // true

withoutTracing(() => {
  console.log(isTracing()); // false
});
```
