---
outline: deep
---

# Set of: `isTracedFabric(...)` `isTracedValue(...)` `isTraced(...)`

## 🪛 `isTracedFabric(...)`

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

## 🪛 `isTracedValue(...)`

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

## 🪛 `isTraced(...)`

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
