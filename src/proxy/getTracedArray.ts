import type { JSONArray } from '../types/json';
import { EArrayMutation, EMutated, type TRequiredApplyProxyParams } from '../types/mutation';
import { tracedSubscribers, tracedValues } from '../utils/references';
import { deepClone } from '../deepClone';
import { deepTrace } from './deepTrace';

export function getTracedProxyArray<T extends JSONArray>(data: TRequiredApplyProxyParams<T>): T {
  const mutatedType = EMutated.array;

  return new Proxy(data.value, {
    get(target, key) {
      if (key === EArrayMutation.reverse) {
        data.mutationCallback({
          mutated: mutatedType,
          targetChain: data.targetChain,
          type: EArrayMutation.reverse,
        });

        return () => Reflect.apply(target.reverse, target, []);
      }

      return Reflect.get(target, key);
    },

    set(target, key, value) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const index = +key;
      const targetChain = [...data.targetChain, index];

      if (Number.isInteger(index)) {
        const subscribers = tracedSubscribers.get(target[index] as any)?.[data.originId];

        if (
          subscribers
          && tracedValues.has(target[index] as object)
        ) {
          delete subscribers[targetChain.join('')];
        }

        data.mutationCallback({
          mutated: mutatedType,
          value: deepClone(value),
          targetChain,
          type: EArrayMutation.set,
        });

        if (tracedValues.has(value)) {
          data.onCaughtTrace({ subscriber: value, targetChain });
          return Reflect.set(target, key, value);
        }

        const proxyValue = deepTrace({ ...data, targetChain, value }).proxy;

        return Reflect.set(target, key, proxyValue);
      }

      return Reflect.set(target, key, value);
    },

    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.deleteProperty(target, key);

      const index = +key;
      const targetChain = [...data.targetChain, index];

      if (Number.isInteger(index)) {
        if (tracedValues.has(target[index] as any)) {
          const subscribers = tracedSubscribers.get(target[index] as any)![data.originId];
          if (subscribers) delete subscribers[data.targetChain.concat(key).join('')];
        }

        data.mutationCallback({
          mutated: mutatedType,
          targetChain,
          type: EArrayMutation.delete,
        });
      }

      return Reflect.deleteProperty(target, key);
    },
  });
}
