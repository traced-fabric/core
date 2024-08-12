import type { JSONObject } from '../types/json';
import { EMutated, EObjectMutation, type TRequiredApplyProxyParams } from '../types/mutation';
import { tracedSubscribers, tracedValues } from '../utils/references';
import { deepClone } from '../deepClone';
import { deepTrace } from './deepTrace';

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
        mutated: mutatedType,
        value: deepClone(value),
        targetChain,
        type: EObjectMutation.set,
      });

      if (tracedValues.has(value)) {
        data.onCaughtTrace({ subscriber: value, targetChain });
        return Reflect.set(target, key, value);
      }

      const proxyValue = deepTrace({ ...data, targetChain, value }).proxy;

      return Reflect.set(target, key, proxyValue);
    },
    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.deleteProperty(target, key);

      const subscribers = tracedSubscribers.get(target[key] as any)?.[data.originId];

      if (
        subscribers
        && tracedValues.has(target[key] as any)
      ) {
        delete subscribers[data.targetChain.concat(key).join('')];
      }

      data.mutationCallback({
        mutated: mutatedType,
        targetChain: [...data.targetChain, key],
        type: EObjectMutation.delete,
      });

      return Reflect.deleteProperty(target, key);
    },
  });
}
