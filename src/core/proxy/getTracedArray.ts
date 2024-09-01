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
  metadata?: TTracedValueMetadata,
): T {
  const mutated = EMutated.array;

  const proxy = new WeakRef(new Proxy(value, {
    get(target, key, receiver) {
      if (key === EArrayMutation.push) {
        return (...args: JSONValue[]) => {
          const initialLength = target.length;
          const tracedArgs = args.map((arg, i) => deepTrace(arg, mutationCallback, {
            rootRef: metadata?.rootRef ?? receiver,
            parentRef: receiver,
            key: initialLength + i,
          }));

          const reflection = Reflect.apply(target.push, target, tracedArgs);

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

          return reflection;
        };
      }

      else if (
        key === EArrayMutation.reverse
        || key === EArrayMutation.shift
      ) {
        if (isTracing()) mutationCallback({ mutated, targetChain: getTargetChain(receiver), type: key });

        // if majority of array items are changed their positions
        // their target chain should be updated
        // so if in the future we will reference them, the reference chain will be correct
        return () => {
          const reflection = Reflect.apply(target[key], target, []);

          for (let i = 0; i < target.length; i++) {
            if (!isStructure(target[i])) continue;

            const metadata = getMetadata(target[i] as JSONStructure);
            if (metadata) metadata.key = i;
          }

          return reflection;
        };
      }

      else if (key === EArrayMutation.unshift) {
        return (...args: JSONValue[]) => {
          const initialLength = target.length;
          const tracedArgs = args.map((arg, i) => deepTrace(arg, mutationCallback, {
            rootRef: metadata?.rootRef ?? receiver,
            parentRef: receiver,
            key: initialLength + i,
          }));

          // before unshifting we should update the target chain of all items
          // that are already nested in the array
          for (let i = 0; i < target.length; i++) {
            if (!isStructure(target[i])) continue;

            const metadata = getMetadata(target[i] as JSONStructure);
            if (metadata) metadata.key = initialLength + i;
          }

          const reflection = Reflect.apply(target.unshift, target, tracedArgs);

          if (isTracing()) {
            mutationCallback({
              mutated,
              targetChain: getTargetChain(receiver),
              value: deepClone(args),
              type: key,
            });
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
      if (Number.isNaN(index)) return Reflect.set(target, key, value);

      const childMetadata: TTracedValueMetadata = {
        rootRef: metadata?.rootRef ?? receiver,
        parentRef: receiver,
        key: index,
      };

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
          rootRef: metadata?.rootRef ?? ref,
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
