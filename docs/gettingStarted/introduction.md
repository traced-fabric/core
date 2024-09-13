---
outline: deep
---

# Introduction

## 🔮 wTF (What is the Trace Fabric) ?

Traced Fabric Core is a JavaScript library designed to track value changes across different environments where direct memory access is not possible, such as WebSockets, Workers, iframes, and Chrome extensions.

Originally developed to streamline the management of complex data structures in real-time WebSocket applications, the package's flexible implementation makes it suitable for use in any environment requiring consistent state synchronization across multiple instances.

## ⚙️ How it works

This package operates similarly to modern frontend frameworks with reactive state management. For instance, in Vue.js, the ref and reactive functions track value changes, updating the DOM accordingly.

Traced Fabric adopts a comparable approach. By proxying values through the `traceFabric()` function, it enables tracking of those values. When changes occur, a corresponding mutation is recorded in the trace.

The trace serves as a log of changes for the tracked value. You can then apply this trace to another value with the same initial state using the `applyTrace()` function, ensuring consistency across different instances.
