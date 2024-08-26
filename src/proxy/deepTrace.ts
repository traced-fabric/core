import type { JSONStructure } from '../types/json';
import type { TMutationCallback } from '../types/mutation';
import { type TTracedValueMetadata, setMetadata } from '../core/metadata';
import { addTracedSubscriber } from '../core/references';
import { isStructure } from '../utils/isStructure';
import { isTracedRootValue } from '../utils/isTraced';
import { getTracedProxyArray } from './getTracedArray';
import { getTracedProxyObject } from './getTracedObject';

// what this function should do:
// * will trace the given value recursively
// * will set the tracedFabric references
// * will set the tracedValues metadata
// * if the value is already a traced fabric, return as is
// * if the value is not a structure (Object/Array), return as is
export function deepTrace<T extends JSONStructure>(
  value: T,
  mutationCallback: TMutationCallback,
  metadata?: TTracedValueMetadata,
): T {
  // if data type is common and not structure-like, return as is
  if (!isStructure(value)) return value;

  // if the given value is already traced (tracedFabric),
  // we should subscribe the current value to metadata root(tracedFabric)
  if (isTracedRootValue(value)) {
    if (metadata) addTracedSubscriber(value, metadata);

    return value;
  }

  // if we found that the given value is an object-like structure:
  // 1. apply the tracing behavior to the given value
  // 2. iterate over the object, to see if keys
  //    are also objects-like structures and trace them recursively
  const proxy = Array.isArray(value)
    ? getTracedProxyArray(value, mutationCallback, metadata)
    : getTracedProxyObject(value, mutationCallback, metadata);

  if (metadata) setMetadata(proxy, metadata);

  for (const key in value) {
    if (!isStructure(value[key])) continue;

    (value[key] as JSONStructure) = deepTrace(value[key] as JSONStructure, mutationCallback, {
      rootRef: metadata ? metadata.rootRef : proxy,
      parentRef: proxy,
      key: Number.isNaN(+key) ? key : +key,
    });
  }

  return proxy as T;
}
