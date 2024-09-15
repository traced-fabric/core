---
outline: deep
---

# isAssigning

Check if `assigning` is enabled. If the assigning is enabled, the `traced` object assignment works as usual. If the assigning is disabled, the `traced` object assignment does not work.

## Returns

`true` if assigning is enabled, `false` otherwise

## Example

```typescript
console.log(isAssigning()); // true

withoutAssigning(() => {
  console.log(isAssigning()); // false
});
```
