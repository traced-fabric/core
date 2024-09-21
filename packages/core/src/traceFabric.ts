import type { JSONStructure } from './types/json';
import type { TMutation, TMutationCallback } from './types/mutation';
import type { TOnMutation, TTracedFabric } from './types/tracedFabric';
import { deepTrace } from './core/proxy/deepTrace';
import { updateSubscribers } from './core/subscribers';
import { tracedFabricsTrace } from './core/traces';
import { isTracingEnabled } from './utils/disableTracing';
import { withoutTracing } from './utils/withoutTracing';

/**
 * Track the mutation of a given JSON-like object or array.
 * Other `tracedFabric` can be nested inside.
 *
 * The `trace` (array of `mutations`), that is produced by the `tracedFabric` on values mutation,
 * can be used to apply them to other objects or arrays, using the `applyTrace(...)` function.
 *
 * @see {@link https://traced-fabric.github.io/core/core-functions/traceFabric.html Wiki page.}
 *
 * @param {JSONStructure} value an object or array that will be deeply tracked. Value is JSON.stringify safe. The type of the value should be the same as JSONStructure.
 * @param {TOnMutation} [onMutation] a function that is triggered when the `traced` value is mutated. The function receives the `mutation` as an argument and should return the `mutation` to be saved to the `trace`. If no modification is needed, return the original mutation; otherwise, return the modified mutation for storage.
 *
 * @returns {TTracedFabric} Object with the following properties:
 * - **value** - the `traced` proxy of the given **value**.
 * - **trace** - the array of `mutations` that are made to the **value**.
 * - **clearTrace** - a function that clears the trace.
 *
 * @example
 * ```typescript
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
 * ```
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
  if (!isTracingEnabled(value)) throw new Error('Cannot create traceFabric when tracing is disabled.');

  let proxyRef: T;

  const trace = (): _MUTATION[] => tracedFabricsTrace.get(proxyRef)!;
  const setTrace = (newTrace: _MUTATION[]): void => {
    tracedFabricsTrace.set(proxyRef, newTrace);
  };
  const clearTrace = (): void => setTrace([]);

  const mutationCallback: TMutationCallback = (mutation) => {
    trace()?.push(onMutation?.(mutation) ?? mutation as _MUTATION);
    updateSubscribers(proxyRef, mutation);
  };

  proxyRef = withoutTracing(() => deepTrace(value, mutationCallback));

  return {
    value: proxyRef,

    get trace() { return trace(); },
    set trace(newTrace: _MUTATION[]) { setTrace(newTrace); },

    clearTrace,
  };
}
