## 🔮 wTF (What is the Trace Fabric) ?

Traced Fabric is a JavaScript library designed to track value changes across different environments where direct memory access is not possible, such as WebSockets, Workers, iframes, and Chrome extensions.

Originally developed to streamline the management of complex data structures in real-time WebSocket applications, the package's flexible implementation makes it suitable for use in any environment requiring consistent state synchronization across multiple instances.

## ⚙️ How it works

This package operates similarly to modern frontend frameworks with reactive state management. For instance, in Vue.js, the ref and reactive functions track value changes, updating the DOM accordingly.

As a starting point you can check the core package where all of the magic happens, visit the [core package README](./packages/core/README.md) to learn more.
