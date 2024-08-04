import type { JSONArray, JSONObject, JSONStructure } from './types/json';
import {
  EArrayMutation,
  EMutated,
  EObjectMutation,
  type TArrayMutation,
  type TObjectMutation,
  type TTarget,
  type TTraceChange,
} from './types/mutation';

export function applyObjectMutation(value: JSONObject, mutation: TObjectMutation): void {
  const lastKey = mutation.targetChain.at(-1);
  if (lastKey === undefined) throw new Error('Invalid target chain');

  if (mutation.type === EObjectMutation.set) {
    value[lastKey] = mutation.value;
  }
  else if (mutation.type === EObjectMutation.delete) {
    delete value[lastKey.toString()];
  }
}

export function applyArrayMutation(value: JSONArray, mutation: TArrayMutation): void {
  const lastKey = mutation.targetChain.at(-1);
  if (lastKey === undefined) throw new Error('Invalid target chain');

  if (mutation.type === EArrayMutation.set) value[lastKey as number] = mutation.value;
  else if (mutation.type === EArrayMutation.delete) value.splice(lastKey as number, 1);
  else if (mutation.type === EArrayMutation.reverse) value.reverse();
}

export function getMutationTargetWithoutLastKey(
  value: JSONStructure,
  targetChain: TTarget[],
): JSONStructure {
  let target = value;

  for (let i = 0; i < targetChain.length - 1; i++) {
    if (targetChain[i] in target) target = (target as any)[targetChain[i]];
    else throw new Error('Invalid target chain');
  }

  return target;
}

export function applyMutations<T extends JSONStructure>(
  value: T,
  traceChain: TTraceChange[],
): void {
  for (const mutation of traceChain) {
    const mutationTarget = getMutationTargetWithoutLastKey(value, mutation.targetChain);

    if (mutation.mutated === EMutated.object) applyObjectMutation(mutationTarget as JSONObject, mutation);
    else if (mutation.mutated === EMutated.array) applyArrayMutation(mutationTarget as JSONArray, mutation);
  }
}
