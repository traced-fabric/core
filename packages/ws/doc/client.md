# Traced Fabric / ws / Client - browser example

```javascript
import {
  applyTFwsMessage,
  isTFwsMessage
} from '@traced-fabric/ws';

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

const chat = undefined;
const privateData = undefined;

// map of the states so the tracedFabricWs
// can update them accordingly
const stateMap = {
  chat,
  privateUserData: privateData
};

// Listen for messages
socket.addEventListener('message', (event) => {
  const { data: unparsedData } = event;

  const data = JSON.parse(unparsedData);

  // give tracedFabricWs do the job
  if (isTFwsMessage(data)) applyTFwsMessage(data, stateMap);
});
```
