import type { JSONArray, JSONStructure } from '../types/json';
import { EArrayMutation, EMutated, type TMutationCallback } from '../types/mutation';
import { isTracedValue, removeTracedSubscriber } from '../core/references';
import { deepClone } from '../deepClone';
import { type TTracedValueMetadata, getMetadata, getTargetChain } from '../core/metadata';
import { isStructure } from '../utils/isStructure';
import { isTracing } from '../utils/withoutTracing';
import type { TTracedFabricValue } from '../types/tracedValue';
import { deepTrace } from './deepTrace';

export function getTracedProxyArray<T extends JSONArray>(
  value: T,
  mutationCallback: TMutationCallback,
  metadata?: TTracedValueMetadata,
): T {
  const mutated = EMutated.array;

  const proxy = new WeakRef(new Proxy(value, {
    get(target, key, receiver) {
      if (key === EArrayMutation.reverse) {
        if (isTracing()) mutationCallback({ mutated, targetChain: getTargetChain(receiver), type: key });

        // if the array is reversed, we should update all nested values target chain,
        // so if in the future we will reference them, the reference chain will be correct
        return () => {
          const reflection = Reflect.apply(target.reverse, target, []);

          for (let i = 0; i < target.length; i++) {
            if (!isStructure(target[i])) continue;

            const metadata = getMetadata(target[i] as JSONStructure);
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

      // ignoring non-integer keys (for example 'length')
      if (!Number.isInteger(index)) return Reflect.set(target, key, value);

      const childMetadata: TTracedValueMetadata = {
        rootRef: metadata?.rootRef ?? receiver,
        parentRef: receiver,
        key: index,
      };

      // if the value that is overridden and it is a tracedFabric,
      // we should remove the subscriber from the old value
      if (isTracedValue(target[index])) removeTracedSubscriber(target[index], childMetadata);

      if (isTracing()) {
        mutationCallback({
          mutated,
          targetChain: [...getTargetChain(receiver), index],
          value: deepClone(value),
          type: EArrayMutation.set,
        });
      }

      const childProxy = deepTrace(value, mutationCallback, childMetadata);

      return Reflect.set(target, key, childProxy);
    },

    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const index = +key;

      if (!Number.isInteger(index)) return Reflect.deleteProperty(target, key);

      const ref = proxy.deref();
      if (!ref) return Reflect.deleteProperty(target, key);

      if (isTracedValue(target[index])) {
        removeTracedSubscriber(target[index], {
          rootRef: metadata?.rootRef ?? ref as unknown as TTracedFabricValue,
          parentRef: ref,
          key: index,
        });
      }

      if (isTracing()) {
        mutationCallback({
          mutated,
          targetChain: [...getTargetChain(ref), index],
          type: EArrayMutation.delete,
        });
      }

      return Reflect.deleteProperty(target, key);
    },
  }));

  return proxy.deref() as T;
}
