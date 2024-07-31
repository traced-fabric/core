import type { JSONArray, JSONObject } from '../types/json';
import type { TCaughtReference, TRequiredApplyProxyParams } from '../types/mutation';
import { tracedValues } from '../utils/references';
import { getTracedProxyValue } from './getTracedValue';

export function deepTrace<T extends JSONObject | JSONArray>(data: TRequiredApplyProxyParams<T>): {
  proxy: T;
  caughtReferences: TCaughtReference[];
} {
  const caughtReferences = [] as TCaughtReference[];

  if (typeof data.value === 'object' && data.value !== null) {
    const objectKeys = Object.keys(data.value);

    for (const k of objectKeys) {
      const key = k as keyof typeof data.value;

      if (
        data.value[key] === null
        || typeof data.value[key] !== 'object'
        || typeof key === 'symbol'
      ) { continue; }

      const tracedValue = deepTrace({
        ...data,
        value: data.value[key] as T,
        targetChain: [...data.targetChain, key],
      });

      (data.value[key] as T) = tracedValue.proxy;
      caughtReferences.push(...tracedValue.caughtReferences);
    }
  }

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

  return {
    proxy: getTracedProxyValue(data),
    caughtReferences,
  };
}
