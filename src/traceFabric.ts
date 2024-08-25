import { tracedLogs, updateSubscribers } from './core/references';
import type { JSONStructure } from './types/json';
import type {
  TMutationCallback,
  TTraceChange,
} from './types/mutation';
import { deepTrace } from './proxy/deepTrace';
import { withoutTracing } from './utils/withoutTracing';

export type TTracedFabric<T extends JSONStructure> = {
  // The proxy object that is used to trace the mutations
  value: T;

  getTrace: () => TTraceChange[];
  getTraceLength: () => number;

  clearTrace: () => void;
};

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
 * console.log(fabric.getTrace());
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
export function traceFabric<T extends JSONStructure>(value: T): TTracedFabric<T> {
  let proxyRef: T;

  const getTrace = (): TTraceChange[] => tracedLogs.get(proxyRef)!;
  const getTraceLength = (): number => getTrace().length;

  const clearTrace = (): void => {
    tracedLogs.set(proxyRef, []);
  };

  const mutationCallback: TMutationCallback = (mutation) => {
    getTrace()?.push(mutation);
    updateSubscribers(proxyRef, mutation);
  };

  proxyRef = withoutTracing(() => deepTrace(
    value,
    mutationCallback,
  ));

  tracedLogs.set(proxyRef, []);

  return {
    value: proxyRef,

    getTrace,
    getTraceLength,

    clearTrace,
  };
}
