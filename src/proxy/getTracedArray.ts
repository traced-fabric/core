import type { JSONArray, JSONStructure } from '../types/json';
import { EArrayMutation, EMutated, type TRequiredApplyProxyParams } from '../types/mutation';
import { tracedSubscribers, tracedValues } from '../utils/references';
import { deepClone } from '../deepClone';
import { getTargetChain, tracedValuesMetadata } from '../utils/metadata';
import { isStructure } from '../utils/isStructure';
import { deepTrace } from './deepTrace';

export function getTracedProxyArray<T extends JSONArray>(data: TRequiredApplyProxyParams<T>): T {
  const mutatedType = EMutated.array;

  return new Proxy(data.value, {
    get(target, key, receiver) {
      if (key === EArrayMutation.reverse) {
        data.mutationCallback({
          mutated: mutatedType,
          targetChain: getTargetChain(receiver),
          type: EArrayMutation.reverse,
        });

        // if the array is reversed, we should update all nested values target chain,
        // so if in the future we will reference them, the reference chain will be correct
        return () => {
          const reflection = Reflect.apply(target.reverse, target, []);

          for (let i = 0; i < target.length; i++) {
            if (!isStructure(target[i])) continue;

            const metadata = tracedValuesMetadata.get(target[i] as JSONStructure);
            if (metadata) metadata.key = i;
          }

          return reflection;
        };
      }

      return Reflect.get(target, key);
    },

    set(target, key, value, receiver) {
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

        const proxy = deepTrace({ ...data, targetChain, value }).proxy;

        if (isStructure(proxy)) tracedValuesMetadata.set(proxy, { parentRef: receiver, key: index });

        return Reflect.set(target, key, proxy);
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
