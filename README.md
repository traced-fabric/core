# Traced Fabric / core

```traceFabric(...)``` allows any given JavaScript JSON-like objects to be tracked.
The traceChanges *(mutations)*, that are produced by the tracedFabric on values mutation, can be used to apply them to other objects or arrays.

This is needed primarily for sharing the same object state between different environments, where simple object references can't be used. (e.g. Workers, WebSockets, iframes, etc.)

## 📦 Installation

```bash
npm install @traced-fabric/core
```

## 🌌 Usage between environments

```javascript
// environment A
import { traceFabric } from '@traced-fabric/core';

const stateOfTheApp = traceFabric({
  season: 'winter',
  bestDays: ['saturday', 'sunday'],
  seasonEmotes: ['❄️', '🎄', '🎅'],
});

// set_state_of_environment_b - is your implementation
// of a function that sends state to environment B
set_state_of_environment_b(
  JSON.stringify(stateOfTheApp)
);

stateOfTheApp.value.season = 'summer';
stateOfTheApp.value.bestDays.push('friday');
stateOfTheApp.value.seasonEmotes = ['🌞', '🌊', '🍦'];

// update_state_of_environment_a - is your implementation
// of a function that sends state updates to environment B
update_state_of_environment_b(
  JSON.stringify(stateOfTheApp.getTrace())
);
```

```javascript
// environment B
import { applyTrace } from '@traced-fabric/core';

let stateOfTheApp;

// on_state_set_from_environment_a - is your implementation
// of a function that receives state from environment A
on_state_set_from_environment_a((state) => {
  stateOfTheApp = state;
});

// on_state_update_from_environment_a - is your implementation
// of a function that receives state updates from environment A
on_state_update_from_environment_a((trace) => {
  applyTrace(stateOfTheApp, trace);
});
```
