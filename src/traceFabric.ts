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
 * Other tracedFabric objects can be used as children.
 *
 * The traceChanges *(mutations)*, that are produced by the tracedFabric on values mutation,
 * can be used to apply them to other objects or arrays.
 * This is needed primarily for sharing the same object state between different environments,
 * where simple object references can't be used. (e.g. Workers, WebSockets, iframes, etc.)
 *
 * @param value JS object or array that resembles a JSON structure
 * @returns The tracedFabric object
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
