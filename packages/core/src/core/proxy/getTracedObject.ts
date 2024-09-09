import type { JSONObject } from '../../types/json';
import { EMutated, EObjectMutation, type TMutationCallback } from '../../types/mutation';
import { deepClone } from '../../deepClone';
import { isTracing } from '../../utils/withoutTracing';
import { type TTracedValueMetadata, getTargetChain } from '../metadata';
import { removeNestedTracedSubscribers } from '../subscribers';
import { isStructure } from '../../utils/isStructure';
import { deepTrace } from './deepTrace';

const mutated = EMutated.object;

export function getTracedProxyObject<T extends JSONObject>(
  value: T,
  mutationCallback: TMutationCallback,
): T {
  const proxy = new WeakRef(new Proxy(value, {
    set(target, key, value, receiver) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const childMetadata: TTracedValueMetadata = { parentRef: receiver, key };

      // if the value that is overridden and it is a tracedFabric,
      // we should remove the subscriber from the old value
      if (isStructure(target[key])) removeNestedTracedSubscribers(target[key], childMetadata);

      if (isTracing()) {
        mutationCallback({
          mutated,
          targetChain: [...getTargetChain(receiver), key],
          value: deepClone(value),
          type: EObjectMutation.set,
        });
      }

      return Reflect.set(target, key, deepTrace(value, mutationCallback, childMetadata));
    },

    deleteProperty(target, key) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const ref = proxy.deref();
      if (!ref) return Reflect.deleteProperty(target, key);

      if (isStructure(target[key])) removeNestedTracedSubscribers(target[key], { parentRef: ref, key });

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
