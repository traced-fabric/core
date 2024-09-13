# 🚀 WebSockets Client + Bun Server

This example demonstrates how to create and synchronize data between a web client and a server built with Bun.

The guide will include instructions on setting up both broadcast data and private user data.

## 📱 Client example

```typescript
import { applyTrace } from '@traced-fabric/core';

// creating data storage that will be set and updated
// here is used 'let' because initially client does not have
// the data, but it will be set by the server
let broadcastData, userPrivateData;

// creating a new WebSocket connection
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
  const { type, channel, data } = JSON.parse(event.data);

  if (type === 'setData') {
    if (channel === 'userPrivateData') userPrivateData = data;
    else if (channel === 'broadcast') broadcastData = data;
  }

  else if (type === 'updateData') {
    if (data.channel === 'userPrivateData') userPrivateData = applyTrace(userPrivateData, data);
    else if (data.channel === 'broadcast') broadcastData = applyTrace(broadcastData, data);
  }
};
```

## 🌐 Server example

```typescript
import { traceFabric } from '@traced-fabric/core';

type TUserPublicData = {
  id: string;
  joinedAt: number;
};

type TUserPrivateData = {
  youSecretEmoji: string;
};

// some sort of a broadcast data
// here we will store all the users that joined the server
// and their public data
const joinedUsers = traceFabric<{
  [_key: TUserPublicData['id']]: TUserPublicData;
}>({});

// defining the ws connection data type
const server = Bun.serve<{
  userPublicData: TTracedFabric<TUserPublicData>;
  userPrivateData: TTracedFabric<TUserPrivateData>;
}>({
  fetch(req, server) {
    // creating a new user public data
    const userPublicData = traceFabric<TUserPublicData>({
      id: Math.random().toString(36).slice(2),
      joinedAt: Date.now(),
    });

    // creating a new user private data
    const userPrivateData = traceFabric<TUserPrivateData>({
      youSecretEmoji: ['☕', '🦄', '🐲', '⚗️'][Math.floor(Math.random() * 4)],
    });

    const success = server.upgrade(req, { data: { userPublicData, userPrivateData } });
    if (success) return undefined;
  },

  websocket: {
    // in the open function you will need to send
    // the current state of user's data
    // that will be updated in the future
    //
    // in the message we need to set 'type', for the client
    // to understand what to do with the upcoming data
    // and 'channel' to understand what data to update
    open(ws) {
      // NOTE: we don't need to send the user's public data here,
      // as it comes as a part of the broadcast data
      // to avoid duplication of the updates

      // sending the current state of the user's private data
      ws.send(JSON.stringify({
        type: 'setData',
        channel: 'userPrivateData',
        data: ws.data.userPrivateData.value,
      }));

      // updating all the users with the new user id and data
      joinedUsers.value[ws.data.userPublicData.value.id]
        = ws.data.userPublicData.value;
      server.publish('broadcast', JSON.stringify({
        type: 'setData',
        channel: 'broadcast',
        data: joinedUsers.trace,
      }));
      // after updating all the users with the new user id
      // we need to clear the trace, because if we don't
      // the user will receive the same data again
      joinedUsers.clearTrace();

      // to receive the updates from the server we need
      // to subscribe the user to the broadcast channel
      ws.subscribe('broadcast');

      // and at the end we need to send
      // the current state of the broadcast data
      // so the user can follow the updates
      ws.send(JSON.stringify({
        type: 'setData',
        channel: 'broadcast',
        data: joinedUsers.value,
      }));
    },

    // here will go your logic of handling the incoming messages
    message(ws, message) { },

    close(ws) {
      // removing the user from the broadcast data
      delete joinedUsers.value[ws.data.userPublicData.value.id];
      server.publish('broadcast', JSON.stringify({
        type: 'setData',
        channel: 'broadcast',
        data: joinedUsers.trace,
      }));
      joinedUsers.clearTrace();
    },
  },
});
```
