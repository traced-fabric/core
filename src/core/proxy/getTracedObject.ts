import type { JSONObject, JSONStructure } from '../../types/json';
import { EMutated, EObjectMutation, type TMutationCallback } from '../../types/mutation';
import { deepClone } from '../../deepClone';
import { isTracing } from '../../utils/withoutTracing';
import { type TTracedValueMetadata, getTargetChain } from '../metadata';
import { removeNestedTracedSubscribers } from '../subscribers';
import { isStructure } from '../../utils/isStructure';
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
      if (isStructure(target[key]))
        removeNestedTracedSubscribers(target[key] as JSONStructure, childMetadata);

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

      if (isStructure(target[key])) {
        removeNestedTracedSubscribers(target[key] as JSONStructure, {
          rootRef: metadata?.rootRef ?? ref,
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
