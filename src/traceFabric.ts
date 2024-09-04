import { updateSubscribers } from './core/subscribers';
import type { JSONStructure } from './types/json';
import type { TMutation, TMutationCallback } from './types/mutation';
import { deepTrace } from './core/proxy/deepTrace';
import { withoutTracing } from './utils/withoutTracing';
import type { TOnMutation, TTracedFabric } from './types/tracedFabric';
import { mutationCallbacks } from './core/mutationCallback';
import { tracedFabricsTrace } from './core/traces';

/**
 * Track the mutation of a given JSON-like object or array.
 * Other `tracedFabric` can be nested inside.
 *
 * The `trace` (array of `mutations`), that is produced by the `tracedFabric` on values mutation,
 * can be used to apply them to other objects or arrays, using the `applyTrace(...)` function.
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-tracefabric Wiki page.}
 *
 * @param {JSONStructure} value an object or array that will be deeply tracked. Value is JSON.stringify safe. The type of the value should be the same as JSONStructure.
 * @param {TOnMutation} [onMutation] a function that is triggered when the `traced` value is mutated. The function receives the `mutation` as an argument and should return the `mutation` to be saved to the `trace`. If no modification is needed, return the original mutation; otherwise, return the modified mutation for storage.
 *
 * @returns {TTracedFabric} Object with the following properties:
 * **value** - the `traced` proxy of the given **value**.
 * **trace** - the array of `mutations` that are made to the **value**.
 * **clearTrace** - a function that clears the trace.
 *
 * @example
 * const bestDays = traceFabric([2, 7, 16]);
 * const fabric = traceFabric({
 *   season: 'winter',
 *   bestDays: bestDays.value,
 * });
 *
 * fabric.value.season = 'summer';
 * fabric.value.bestDays.push(25);
 * bestDays.value.push(26);
 *
 * console.log(fabric.trace);
 * // [{
 * //   mutated: 'object', type: 'set',
 * //   targetChain: ['season'],
 * //   value: 'summer',
 * // }, {
 * //   mutated: 'array', type: 'set',
 * //   targetChain: ['bestDays', 3],
 * //   value: 25,
 * // }, {
 * //   mutated: 'array', type: 'set',
 * //   targetChain: ['bestDays', 4],
 * //   value: 26,
 * // }]
 *
 * @since 0.0.1
 */
export function traceFabric<
  T extends JSONStructure = JSONStructure,
  _MUTATION = TMutation,
>(
  value: T,
  onMutation?: TOnMutation<_MUTATION>,
): TTracedFabric<T, _MUTATION> {
  let proxyRef: T;

  const trace = (): _MUTATION[] => tracedFabricsTrace.get(proxyRef)!;
  const clearTrace = (): void => {
    tracedFabricsTrace.set(proxyRef, []);
  };

  const mutationCallback: TMutationCallback = (mutation) => {
    trace()?.push(onMutation?.(mutation) ?? mutation as _MUTATION);
    updateSubscribers(proxyRef, mutation);
  };

  proxyRef = withoutTracing(() => deepTrace(value, mutationCallback));

  tracedFabricsTrace.set(proxyRef, []);
  mutationCallbacks.set(proxyRef, mutationCallback);

  return {
    value: proxyRef,

    get trace() { return trace(); },
    clearTrace,
  };
}
