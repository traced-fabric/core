import type { JSONArray, JSONObject, JSONStructure } from './types/json';
import {
  EArrayMutation,
  EMutated,
  EObjectMutation,
  type TArrayMutation,
  type TMutation,
  type TObjectMutation,
  type TTarget,
} from './types/mutation';

function applyObjectMutation(value: JSONObject, mutation: TObjectMutation): void {
  const lastKey = mutation.targetChain.at(-1);
  if (lastKey === undefined) throw new Error('Invalid target chain');

  if (mutation.type === EObjectMutation.set) {
    value[lastKey] = mutation.value;
  }
  else if (mutation.type === EObjectMutation.delete) {
    delete value[lastKey.toString()];
  }
}

function applyArrayMutation(value: JSONArray, mutation: TArrayMutation): void {
  const lastKey = mutation.targetChain.at(-1);
  if (lastKey === undefined) throw new Error('Invalid target chain');

  if (mutation.type === EArrayMutation.set) value[lastKey as number] = mutation.value;
  else if (mutation.type === EArrayMutation.delete) value.splice(lastKey as number, 1);
  else if (mutation.type === EArrayMutation.push) value.push(...mutation.value);
  else if (mutation.type === EArrayMutation.reverse) value.reverse();
  else if (mutation.type === EArrayMutation.shift) value.shift();
  else if (mutation.type === EArrayMutation.unshift) value.unshift(...mutation.value);
}

function getMutationTargetWithoutLastKey(
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

/**
 * Applies `tracedFabric` `mutations` to the given value.
 * The value should have the same state as the `traceFabric` value before allied mutations.
 *
 * @WARN This function mutates the value directly.
 *
 * @see {@link https://traced-fabric.github.io/core/core-functions/applyTrace.html Wiki page.}
 *
 * @param value - the object to which the **trace** will be directly applied.
 * @param trace - the `trace` (array of `mutations`) to apply to the given **value**.
 *
 * @example
 * ```typescript
 * const fabric = traceFabric({ season: 'winter' });
 * const target = { season: 'winter' };
 *
 * target.season = 'summer';
 *
 * applyTrace(target, fabric.trace);
 *
 * console.log(target); // { season: 'summer' }
 * ```
 *
 * @since 0.0.1
 */
export function applyTrace<T extends JSONStructure>(
  value: T,
  trace: TMutation[],
): void {
  for (const mutation of trace) {
    const mutationTarget = getMutationTargetWithoutLastKey(value, mutation.targetChain);

    if (mutation.mutated === EMutated.object) applyObjectMutation(mutationTarget as JSONObject, mutation);
    else if (mutation.mutated === EMutated.array) applyArrayMutation(mutationTarget as JSONArray, mutation);
  }
}
