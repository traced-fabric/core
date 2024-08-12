import type { JSONArray, JSONObject, JSONStructure } from '../types/json';
import type { TCaughtReference, TRequiredApplyProxyParams } from '../types/mutation';
import { tracedValuesMetadata } from '../utils/metadata';
import { tracedValues } from '../utils/references';
import { getTracedProxyArray } from './getTracedArray';
import { getTracedProxyObject } from './getTracedObject';

export function deepTrace<T extends JSONStructure>(data: TRequiredApplyProxyParams<T>): {
  proxy: T;
  caughtReferences: TCaughtReference[];
} {
  const caughtReferences = [] as TCaughtReference[];

  // if the given value is already traced,
  // we should subscribe the current value to the caught references
  if (tracedValues.has(data.value)) {
    caughtReferences.push({
      subscriber: data.value,
      targetChain: data.targetChain,
    });

    return {
      proxy: data.value,
      caughtReferences,
    };
  }

  // if we found that the given value is an object-like structure,
  // we should iterate over the object, to see if keys
  // are also objects-like structures and trace them recursively
  // finally apply the tracing behavior to the given object
  if (typeof data.value === 'object' && data.value !== null) {
    for (const key in data.value) {
      if (
        data.value[key] === null
        || typeof data.value[key] !== 'object'
        || typeof key === 'symbol'
      ) { continue; }

      const maybeNumber = +key;
      const targetChain = data.targetChain.concat(Number.isInteger(maybeNumber) ? maybeNumber : key);

      const tracedValue = deepTrace({ ...data, targetChain, value: data.value[key] as JSONStructure });

      (data.value[key] as JSONStructure) = tracedValue.proxy;
      caughtReferences.push(...tracedValue.caughtReferences);
    }

    const proxyValue = Array.isArray(data.value)
      ? getTracedProxyArray(data as TRequiredApplyProxyParams<JSONArray>)
      : getTracedProxyObject(data as TRequiredApplyProxyParams<JSONObject>);

    tracedValuesMetadata.set(proxyValue, { targetChain: data.targetChain });

    return {
      proxy: proxyValue as T,
      caughtReferences,
    };
  }

  // if the value is not traced and cannot be traced,
  // we should return the value as is
  return {
    proxy: data.value,
    caughtReferences,
  };
}
