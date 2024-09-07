import type { JSONArray, JSONStructure, JSONValue } from '../../types/json';
import { EArrayMutation, EMutated, type TMutationCallback } from '../../types/mutation';
import { removeNestedTracedSubscribers } from '../subscribers';
import { deepClone } from '../../deepClone';
import { type TTracedValueMetadata, getMetadata, getTargetChain } from '../metadata';
import { isStructure } from '../../utils/isStructure';
import { isTracing } from '../../utils/withoutTracing';
import { deepTrace } from './deepTrace';

export function getTracedProxyArray<T extends JSONArray>(
  value: T,
  mutationCallback: TMutationCallback,
): T {
  const mutated = EMutated.array;

  const proxy = new WeakRef(new Proxy(value, {
    get(target, key, receiver) {
      if (key === EArrayMutation.push) {
        return (...args: JSONValue[]) => {
          const initialLength = target.length;
          const tracedArgs = args.map((arg, i) => deepTrace(arg, mutationCallback, {
            parentRef: receiver,
            key: initialLength + i,
          }));

          if (isTracing()) {
            if (args.length > 1) {
              mutationCallback({
                mutated,
                targetChain: getTargetChain(receiver),
                value: deepClone(args),
                type: key,
              });
            }
            else {
              mutationCallback({
                mutated,
                targetChain: [...getTargetChain(receiver), initialLength],
                value: deepClone(args[0]),
                type: EArrayMutation.set,
              });
            }
          }

          return Reflect.apply(target.push, target, tracedArgs);
        };
      }

      else if (
        key === EArrayMutation.reverse
        || key === EArrayMutation.shift
      ) {
        // if majority of array items are changed their positions
        // their target chain should be updated
        // so if in the future we will reference them, the reference chain will be correct
        return () => {
          for (let i = 0; i < target.length; i++) {
            if (!isStructure(target[i])) continue;

            const metadata = getMetadata(target[i] as JSONStructure);
            if (metadata) metadata.key = target.length - i - 1;
          }

          if (isTracing()) mutationCallback({ mutated, targetChain: getTargetChain(receiver), type: key });

          return Reflect.apply(target[key], target, []);
        };
      }

      else if (key === EArrayMutation.unshift) {
        return (...args: JSONValue[]) => {
          const initialLength = target.length;
          const tracedArgs = args.map((arg, i) => deepTrace(arg, mutationCallback, {
            parentRef: receiver,
            key: initialLength + i,
          }));

          if (isTracing()) {
            mutationCallback({
              mutated,
              targetChain: getTargetChain(receiver),
              value: deepClone(args),
              type: key,
            });
          }

          // before unshifting we should update the target chain of all items
          // that are already nested in the array
          for (let i = 0; i < target.length; i++) {
            if (!isStructure(target[i])) continue;

            const metadata = getMetadata(target[i] as JSONStructure);
            if (metadata) metadata.key = initialLength + i;
          }

          return Reflect.apply(target.unshift, target, tracedArgs);
        };
      }

      return Reflect.get(target, key);
    },

    set(target, key, value, receiver) {
      if (typeof key === 'symbol') return Reflect.set(target, key, value);

      const index = +key;

      // ignoring non-integer keys (for example 'length')
      if (Number.isNaN(index)) return Reflect.set(target, key, value);

      const childMetadata: TTracedValueMetadata = { parentRef: receiver, key: index };

      // if the value that is overridden and it is a tracedFabric,
      // we should remove the subscriber from the old value
      if (isStructure(target[index]))
        removeNestedTracedSubscribers(target[index] as JSONStructure, childMetadata);

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

      if (Number.isNaN(index)) return Reflect.deleteProperty(target, key);

      const ref = proxy.deref();
      if (!ref) return Reflect.deleteProperty(target, key);

      if (isStructure(target[index])) {
        removeNestedTracedSubscribers(target[index] as JSONStructure, {
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
