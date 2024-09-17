# Traced Fabric / ws / Server - node example

```javascript
import {
  traceFabric
} from '@traced-fabric/core';
import {
  createTFwsMessageSet,
  createTFwsMessageUpdate
} from '@traced-fabric/ws';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const chatStateName = 'chat';
const privateUserDataStateName = 'privateUserData';

const chat = traceFabric({
  messages: [],
});

// sending the chat updates to all connected clients
function broadcastChatUpdates() {
  const updates = createTFwsMessageUpdate(
    chat.getTrace(),
    chatStateName
  );

  // clearing the updates of the chat
  chat.clearTrace();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) client.send(updates);
  });
}

wss.on('connection', (ws) => {
  const privateUserData = tracedFabric({
    id: crypto.randomUUID(),
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
  });

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

  ws.on('message', (data) => {
    chat.value.messages.push(data);
    broadcastChatUpdates();
  });
});
```
