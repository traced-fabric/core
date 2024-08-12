import {
  getTracedValueId,
  tracedLogs,
  tracedSubscribers,
  tracedValues,
} from './utils/references';
import { symbolTracedFabric, symbolTracedFabricRootId } from './utils/symbols';
import type { JSONStructure } from './types/json';
import type {
  TCaughtReference,
  TMutationCallback,
  TTraceChange,
} from './types/mutation';
import { deepTrace } from './proxy/deepTrace';

export type TTracedFabric<T extends JSONStructure> = {
  [symbolTracedFabric]: true;

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
  const id = getTracedValueId();

  let proxyRef: T;

  const getTrace = (): TTraceChange[] => tracedLogs.get(proxyRef)!;
  const getTraceLength = (): number => getTrace().length;

  const clearTrace = (): void => {
    tracedLogs.set(proxyRef, []);
  };

  const mutationCallback: TMutationCallback = (mutation) => {
    getTrace()?.push(mutation);

    const tracedSubscriber = tracedSubscribers.get(proxyRef);
    if (!tracedSubscriber) return;

    for (const trace of Object.values(tracedSubscriber)) {
      for (const { subscriber, targetChain } of Object.values(trace)) {
        const subscriberTraceLog = tracedLogs.get(subscriber);

        if (!subscriberTraceLog) return;

        subscriberTraceLog.push({
          ...mutation,
          targetChain: targetChain.concat(mutation.targetChain),
        });
      }
    }
  };

  const onCaughtTrace = (references: TCaughtReference): void => {
    if (!tracedSubscribers.has(references.subscriber)) tracedSubscribers.set(references.subscriber, { [id]: {} });
    if (!tracedSubscribers.get(references.subscriber)![id]) tracedSubscribers.get(references.subscriber)![id] = {};

    tracedSubscribers.get(references.subscriber)![id]![references.targetChain.join('')] = {
      subscriber: proxyRef,
      targetChain: references.targetChain,
    };
  };

  const tracing = deepTrace({
    originId: id,
    value,
    targetChain: [],
    mutationCallback,
    onCaughtTrace,
  });

  proxyRef = tracing.proxy;
  (proxyRef as any)[symbolTracedFabricRootId] = id;

  tracedValues.add(proxyRef);
  clearTrace();

  tracing.caughtReferences.forEach(onCaughtTrace);

  return {
    [symbolTracedFabric]: true,

    value: proxyRef,

    getTrace,
    getTraceLength,

    clearTrace,
  };
}
