---
outline: deep
---

# isStructure

Checks if the value is a typeof `object` and not `null`.

## Arguments

* **value** - value that needs to be checked

## Returns

`Boolean`

## Example

```typescript
console.log(isStructure({ hello: 'world' })); // true
console.log(isStructure(['hello', 'world'])); // true

console.log(isStructure(1)); // false
console.log(isStructure(true)); // false
console.log(isStructure('hello')); // false
console.log(isStructure(null)); // false
console.log(isStructure(undefined)); // false
console.log(isStructure(true)); // false
```
