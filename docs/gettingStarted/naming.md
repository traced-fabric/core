---
outline: deep
---

# 📜 Naming

## Common

The common naming conventions in the Traced Fabric (TF) package reflect its fundamental purpose. For those interested in a deeper understanding of the project’s internals, exploring the core functionality and key naming conventions will provide valuable insights into how the system operates.

* `traceFabric` - function that will process data and make it `traceable`
* `traced` - data whose changes are recorded
* `tracedFabric` - data that is `traced` by `traceFabric`
* `tracedValue` - array or object inside of `tracedFabric`. Can be inside of other `tracedValues`

* `mutation` - single change inside of `tracedFabric` of `tracedValue`
* `trace` - array of `mutations`

* `mutationCallback` - function that will be triggered when `mutation` happens

## Core functionality

This section is intended for those who wish to understand how TF operates and explore its key concepts.

* `sender` - `tracedFabric` that contains inside of another `tracedFabric` *(receiver)*
* `receiver` / `subscriber` - `tracedFabric` that will receive `mutations` from nested `senders`

* `metadata` - data that is used for indexing `tracedValues`. Contains:
  * `tracedFabric` reference - reference to the `tracedFabric` that contains value with current `metadata`, no mater how deep it is nested
  * parent reference - reference to `tracedValue` that contains value with current `metadata`. It can be empty if the value is contained inside `tracedFabric`
  * key - indicates the key to access value with current `metadata` in *parent reference* or *tracedFabric reference* if previous does not exists
