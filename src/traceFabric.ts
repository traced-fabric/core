import { tracedLogs, updateSubscribers } from './core/references';
import { symbolTracedFabric } from './core/symbols';
import type { JSONStructure } from './types/json';
import type {
  TMutationCallback,
  TTraceChange,
} from './types/mutation';
import { deepTrace } from './proxy/deepTrace';
import type { TTracedFabricValue } from './types/tracedValue';

export type TTracedFabric<T extends JSONStructure> = {
  [symbolTracedFabric]: true;

  // not setting here TTracedFabricValue,
  // to avid typescript firing error about symbol.
  // If, for some reason, the value needs included symbols,
  // the type can be wrapped in TTracedFabricValue
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
 * const fabric = traceFabric({ season: 'winter', bestDays: [2, 7, 16] });
 *
 * fabric.value.season = 'summer';
 * fabric.value.bestDays.push(25);
 *
 * console.log(fabric.getTrace());
 *
 * @since 0.0.1
 */
export function traceFabric<T extends JSONStructure>(value: T): TTracedFabric<T> {
  let proxyRef: TTracedFabricValue<T>;

  const getTrace = (): TTraceChange[] => tracedLogs.get(proxyRef)!;
  const getTraceLength = (): number => getTrace().length;

  const clearTrace = (): void => {
    tracedLogs.set(proxyRef, []);
  };

  const mutationCallback: TMutationCallback = (mutation) => {
    getTrace()?.push(mutation);
    updateSubscribers(proxyRef, mutation);
  };

  proxyRef = deepTrace(
    value,
    mutationCallback,
  ) as TTracedFabricValue<T>;

  tracedLogs.set(proxyRef, []);

  return {
    [symbolTracedFabric]: true,

    value: proxyRef,

    getTrace,
    getTraceLength,

    clearTrace,
  };
}
