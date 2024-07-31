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
  if (mutation.mutationType === EObjectMutation.set) {
    value[mutation.key] = mutation.value;
  }
  else if (mutation.mutationType === EObjectMutation.delete) {
    delete value[mutation.key.toString()];
  }
}

export function applyArrayMutation(value: JSONArray, mutation: TArrayMutation): void {
  if (mutation.mutationType === EArrayMutation.set) value[mutation.key] = mutation.value;
  else if (mutation.mutationType === EArrayMutation.delete) value.splice(mutation.key, 1);
  else if (mutation.mutationType === EArrayMutation.reverse) value.reverse();
}

export function getMutationTarget(
  value: JSONStructure,
  targetChain: TTarget[],
): JSONStructure {
  let target = value;

  for (const trace of targetChain) {
    if (trace in target) target = (target as any)[trace];
    else throw new Error('Invalid trace chain');
  }

  return target;
}

export function applyTrace<T extends JSONStructure>(
  value: T,
  traceChain: TTraceChange[],
): void {
  for (const mutation of traceChain) {
    const mutationTarget = mutation.targetChain
      ? getMutationTarget(value, mutation.targetChain)
      : value;

    switch (mutation.mutatedType) {
      case EMutated.object:
        applyObjectMutation(mutationTarget as JSONObject, mutation as TObjectMutation);
        break;

      case EMutated.array:
        applyArrayMutation(mutationTarget as JSONArray, mutation as TArrayMutation);
        break;

      default:
        break;
    }
  }
}
