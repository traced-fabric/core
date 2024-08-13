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
  // if the given value is already traced,
  // we should subscribe the current value to the caught references
  if (tracedValues.has(data.value)) {
    return {
      proxy: data.value,
      caughtReferences: [{
        subscriber: data.value,
        targetChain: data.targetChain,
      }],
    };
  }

  // if we found that the given value is an object-like structure,
  // we should iterate over the object, to see if keys
  // are also objects-like structures and trace them recursively
  // finally apply the tracing behavior to the given object
  if (typeof data.value === 'object' && data.value !== null) {
    const caughtReferences = [] as TCaughtReference[];
    const tracedInnerValues = [] as { key: number | string; proxy: JSONStructure }[];

    for (const valueKey in data.value) {
      if (
        data.value[valueKey] === null
        || typeof data.value[valueKey] !== 'object'
        || typeof valueKey === 'symbol'
      ) { continue; }

      const maybeNumber = +valueKey;
      const key = Number.isInteger(maybeNumber) ? maybeNumber : valueKey;
      const targetChain = data.targetChain.concat(key);

      const structure = deepTrace({ ...data, targetChain, value: data.value[key] as JSONStructure });

      (data.value[key] as JSONStructure) = structure.proxy;
      caughtReferences.push(...structure.caughtReferences);
      tracedInnerValues.push({ key, proxy: structure.proxy });
    }

    const proxy = Array.isArray(data.value)
      ? getTracedProxyArray(data as TRequiredApplyProxyParams<JSONArray>)
      : getTracedProxyObject(data as TRequiredApplyProxyParams<JSONObject>);

    for (const value of tracedInnerValues) {
      tracedValuesMetadata.set(value.proxy, {
        parentRef: proxy,
        key: value.key,
      });
    }

    return {
      proxy: proxy as T,
      caughtReferences,
    };
  }

  // if the value is not traced and cannot be traced,
  // we should return the value as is
  return {
    proxy: data.value,
    caughtReferences: [],
  };
}
