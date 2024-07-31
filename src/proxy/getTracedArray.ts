import type { JSONArray } from '../types/json';
import { EArrayMutation, EMutated, type TRequiredApplyProxyParams } from '../types/mutation';
import { tracedSubscribers, tracedValues } from '../utils/references';
import { getTracedProxyValue } from './getTracedValue';
import { removeProxy } from './removeProxy';

export function getTracedProxyArray<T extends JSONArray>(data: TRequiredApplyProxyParams<T>): T {
  const mutatedType = EMutated.array;

  return new Proxy(data.value, {
    get(target, key) {
      if (key === EArrayMutation.reverse) {
        data.mutationCallback({
          mutatedType,
          targetChain: data.targetChain?.length ? data.targetChain : undefined,
          mutationType: EArrayMutation.reverse,
        });

        return () => Reflect.apply(target.reverse, target, []);
      }
      return Reflect.get(target, key);
    },

    set(target, key, value) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const targetChain = [...data.targetChain, key];

      const index = +key;
      if (Number.isInteger(index)) {
        if (target[index] && tracedValues.has(target[index] as any)) {
          const subscribers = tracedSubscribers.get(target[index] as any)![data.originId];
          if (subscribers) delete subscribers[targetChain.join('')];
        }

        data.mutationCallback({
          mutatedType,
          key: index,
          value: removeProxy(value),
          targetChain: data.targetChain?.length ? data.targetChain : undefined,
          mutationType: EArrayMutation.set,
        });

        if (tracedValues.has(value)) {
          data.onCaughtTrace({ subscriber: value, targetChain });
          return Reflect.set(target, key, value);
        }

        const proxyValue = getTracedProxyValue({ ...data, targetChain, value });

        return Reflect.set(target, key, proxyValue);
      }

      return Reflect.set(target, key, value);
    },

    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.deleteProperty(target, key);

      const index = +key;
      if (Number.isInteger(index)) {
        if (tracedValues.has(target[index] as any)) {
          const subscribers = tracedSubscribers.get(target[index] as any)![data.originId];
          if (subscribers) delete subscribers[data.targetChain.join('')];
        }

        data.mutationCallback({
          mutatedType,
          key: index,
          targetChain: data.targetChain?.length ? data.targetChain : undefined,
          mutationType: EArrayMutation.delete,
        });
      }

      return Reflect.deleteProperty(target, key);
    },
  });
}
