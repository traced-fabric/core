import type { JSONObject } from '../types/json';
import { EMutated, EObjectMutation, type TMutationCallback } from '../types/mutation';
import { deepClone } from '../deepClone';
import { isTracing } from '../utils/withoutTracing';
import { type TTracedValueMetadata, getTargetChain } from '../core/metadata';
import { addTracedSubscriber, isTracedValue, removeTracedSubscriber } from '../core/references';
import type { TTracedFabricValue } from '../types/tracedValue';
import { deepTrace } from './deepTrace';

export function getTracedProxyObject<T extends JSONObject>(
  value: T,
  mutationCallback: TMutationCallback,
  metadata?: TTracedValueMetadata,
): T {
  const mutated = EMutated.object;

  return new Proxy(value, {
    set(target, key, value, receiver) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const targetChain = [...getTargetChain(receiver), key];

      // if the value that is overridden and it is a tracedFabric,
      // we should remove the subscriber from the old value
      if (isTracedValue(target[key])) {
        removeTracedSubscriber(target[key], {
          rootRef: metadata?.rootRef ?? receiver,
          parentRef: receiver,
          key,
        });
      }

      // if new value is tracedFabric, we should subscribe the current
      // tracedFabric to the new value mutations
      if (isTracedValue(value)) {
        addTracedSubscriber(value, {
          rootRef: metadata?.rootRef ?? receiver,
          parentRef: receiver,
          key,
        });
      }

      if (isTracing()) mutationCallback({ mutated, targetChain, value: deepClone(value), type: EObjectMutation.set });

      const proxy = deepTrace(value, mutationCallback, {
        rootRef: metadata ? metadata.rootRef : receiver,
        parentRef: receiver,
        key,
      });

      return Reflect.set(target, key, proxy);
    },

    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const targetChain = [...getTargetChain(target), key];

      if (isTracedValue(target[key])) {
        removeTracedSubscriber(target[key], {
          rootRef: metadata?.rootRef ?? target as unknown as TTracedFabricValue,
          parentRef: target,
          key,
        });
      }

      if (isTracing()) mutationCallback({ mutated, targetChain, type: EObjectMutation.delete });

      return Reflect.deleteProperty(target, key);
    },
  });
}
