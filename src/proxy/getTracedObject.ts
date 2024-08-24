import type { JSONObject } from '../types/json';
import { EMutated, EObjectMutation, type TMutationCallback } from '../types/mutation';
import { deepClone } from '../deepClone';
import { isTracing } from '../utils/withoutTracing';
import { type TTracedValueMetadata, getTargetChain } from '../core/metadata';
import { isTracedValue, removeTracedSubscriber } from '../core/references';
import type { TTracedFabricValue } from '../types/tracedValue';
import { deepTrace } from './deepTrace';

export function getTracedProxyObject<T extends JSONObject>(
  value: T,
  mutationCallback: TMutationCallback,
  metadata?: TTracedValueMetadata,
): T {
  const mutated = EMutated.object;

  const proxy = new WeakRef(new Proxy(value, {
    set(target, key, value, receiver) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const childMetadata: TTracedValueMetadata = {
        rootRef: metadata?.rootRef ?? receiver,
        parentRef: receiver,
        key,
      };

      // if the value that is overridden and it is a tracedFabric,
      // we should remove the subscriber from the old value
      if (isTracedValue(target[key])) removeTracedSubscriber(target[key], childMetadata);

      if (isTracing()) {
        mutationCallback({
          mutated,
          targetChain: [...getTargetChain(receiver), key],
          value: deepClone(value),
          type: EObjectMutation.set,
        });
      }

      const proxy = deepTrace(value, mutationCallback, childMetadata);

      return Reflect.set(target, key, proxy);
    },

    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const ref = proxy.deref();
      if (!ref) return Reflect.deleteProperty(target, key);

      if (isTracedValue(target[key])) {
        removeTracedSubscriber(target[key], {
          rootRef: metadata?.rootRef ?? ref as unknown as TTracedFabricValue,
          parentRef: ref,
          key,
        });
      }

      if (isTracing()) {
        mutationCallback({
          mutated,
          targetChain: [...getTargetChain(ref), key],
          type: EObjectMutation.delete,
        });
      }

      return Reflect.deleteProperty(target, key);
    },
  }));

  return proxy.deref() as T;
}
