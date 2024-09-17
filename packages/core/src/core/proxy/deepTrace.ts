import type { JSONValue } from '../../types/json';
import type { TMutationCallback } from '../../types/mutation';
import { isTracingEnabled } from '../../utils/disableTracing';
import { isStructure } from '../../utils/isStructure';
import { isTracedFabric } from '../../utils/isTraced';
import { setMetadata, type TTracedValueMetadata } from '../metadata';
import { mutationCallbacks } from '../mutationCallback';
import { addTracedSubscriber } from '../subscribers';
import { tracedFabricsTrace } from '../traces';
import { getTracedProxyArray } from './getTracedArray';
import { getTracedProxyObject } from './getTracedObject';

// what this function should do:
// * will trace the given value recursively
// * will set the tracedFabric references
// * will set the tracedValues metadata
// * if the value is already a traced fabric, return as is
// * if the value is not a structure (Object/Array), return as is
export function deepTrace<T extends JSONValue>(
  value: T,
  mutationCallback: TMutationCallback,
  metadata?: TTracedValueMetadata,
): T {
  // if data type is common and not structure-like, return as is
  if (!isStructure(value)) return value;

  // if the given value is already disabled for tracing, return as is
  if (!isTracingEnabled(value)) return value;

  // if the given value is already traced (tracedFabric),
  // we should subscribe the current value to metadata root(tracedFabric)
  if (isTracedFabric(value)) {
    if (metadata) addTracedSubscriber(value, metadata);

    return value;
  }

  // if we found that the given value is an object-like structure:
  // 1. apply the tracing behavior to the given value
  // 2. iterate over the object, to see if keys
  //    are also objects-like structures and trace them recursively
  const proxy = Array.isArray(value)
    ? getTracedProxyArray(value, mutationCallback)
    : getTracedProxyObject(value, mutationCallback);

  if (metadata) {
    setMetadata(proxy, metadata);
  }
  else {
    tracedFabricsTrace.set(proxy, []);
    mutationCallbacks.set(proxy, mutationCallback);
  }

  for (const key in value) {
    if (!isStructure(value[key])) continue;

    const maybeNumber = Number.isNaN(+key) ? key : +key;
    value[key] = deepTrace(value[key], mutationCallback, { parentRef: proxy, key: maybeNumber });
  }

  return proxy as T;
}
