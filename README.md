# Traced Fabric / core

Allows any given JS json-like objects to be tracked. The changes of the tracked object can then be applied to other objects with the same initial state.

## 📦 Installation

```bash
npm install @traced-fabric/core
```

## 🦄 Usage

```javascript
import { applyTrace, traceFabric } from '@traced-fabric/core';

const origin = traceFabric({ count: 1 });
const follower = { count: 1 };

origin.value.count = 2;

applyTrace(follower, origin.getTrace());

console.log(origin.value); // { count: 2 }
console.log(follower); // { count: 2 }
```
