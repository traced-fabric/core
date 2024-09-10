# Traced Fabric / ws / Server - bun example

```javascript
import {
  traceFabric
} from '@traced-fabric/core';
import {
  createTFwsMessageSet,
  createTFwsMessageUpdate
} from '@traced-fabric/ws';

const chatStateName = 'chat';
const privateUserDataStateName = 'privateUserData';

const chat = traceFabric({
  messages: [],
});

const usersData = new WeakMap();
function createPrivateUserData(ws) {
  const privateUserData = tracedFabric({
    id: crypto.randomUUID(),
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
  });

  usersData.set(ws, privateUserData);
}
const getPrivateUserData = ws => usersData.get(ws);

Bun.serve({
  fetch() {}, // upgrade logic

  websocket: {
    open(ws) {
      createPrivateUserData(ws);
      const privateUserData = getPrivateUserData(ws);

      // sending the initial state of the app when user connects
      // createTFwsMessageSet will wrap the message to a specific
      // tracedFabric format
      ws.send(JSON.stringify(createTFwsMessageSet(
        chat.value,
        chatStateName
      )));
      ws.send(JSON.stringify(createTFwsMessageSet(
        privateUserData.value,
        privateUserDataStateName
      )));

      ws.subscribe(chatStateName);
    },

    message(ws, message) {
      chat.value.messages.push(message);

      server.publish(chatStateName, createTFwsMessageUpdate(
        chat.getTrace(),
        chatStateName
      ));

      chat.clearTrace();
    },
  },
});
```
