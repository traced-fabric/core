import type { JSONObject } from '../types/json';
import { EMutated, EObjectMutation, type TRequiredApplyProxyParams } from '../types/mutation';
import { tracedSubscribers, tracedValues } from '../utils/references';
import { getTracedProxyValue } from './getTracedValue';
import { removeProxy } from './removeProxy';

export function getTracedProxyObject<T extends JSONObject>(data: TRequiredApplyProxyParams<T>): T {
  const mutatedType = EMutated.object;

  return new Proxy(data.value, {
    set(target, key, value) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const targetChain = [...data.targetChain, key];

      if (tracedValues.has(target[key] as any)) {
        const subscribers = tracedSubscribers.get(target[key] as any)![data.originId];
        if (subscribers) delete subscribers[targetChain.join('')];
      }

      data.mutationCallback({
        mutatedType,
        key,
        value: removeProxy(value),
        targetChain: data.targetChain?.length ? data.targetChain : undefined,
        mutationType: EObjectMutation.set,
      });

      if (tracedValues.has(value)) {
        data.onCaughtTrace({ subscriber: value, targetChain });
        return Reflect.set(target, key, value);
      }

      const proxyValue = getTracedProxyValue({ ...data, targetChain, value });

      return Reflect.set(target, key, proxyValue);
    },
    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.deleteProperty(target, key);

      if (tracedValues.has(target[key] as any)) {
        const subscribers = tracedSubscribers.get(target[key] as any)![data.originId];
        if (subscribers) delete subscribers[data.targetChain.join('')];
      }

      data.mutationCallback({
        mutatedType,
        key,
        targetChain: data.targetChain?.length ? data.targetChain : undefined,
        mutationType: EObjectMutation.delete,
      });

      return Reflect.deleteProperty(target, key);
    },
  });
}
