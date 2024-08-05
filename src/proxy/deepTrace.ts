import type { JSONStructure } from '../types/json';
import type { TCaughtReference, TRequiredApplyProxyParams } from '../types/mutation';
import { tracedValues } from '../utils/references';
import { getTracedProxyValue } from './getTracedValue';

export function deepTrace<T extends JSONStructure>(data: TRequiredApplyProxyParams<T>): {
  proxy: T;
  caughtReferences: TCaughtReference[];
} {
  const caughtReferences = [] as TCaughtReference[];

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
  else if (typeof data.value === 'object' && data.value !== null) {
    for (const key in data.value) {
      if (
        data.value[key] === null
        || typeof data.value[key] !== 'object'
        || typeof key === 'symbol'
      ) { continue; }

      const maybeNumber = +key;
      const targetChain = data.targetChain.concat(Number.isInteger(maybeNumber) ? maybeNumber : key);

      const tracedValue = deepTrace({
        originId: data.originId,
        value: data.value[key] as T,
        targetChain,
        mutationCallback: data.mutationCallback,
        onCaughtTrace: data.onCaughtTrace,
      });

      (data.value[key] as T) = tracedValue.proxy;
      caughtReferences.push(...tracedValue.caughtReferences);
    }
  }

  return {
    proxy: getTracedProxyValue(data),
    caughtReferences,
  };
}
