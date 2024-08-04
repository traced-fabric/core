import {
  getTracedValueId,
  tracedLogs,
  tracedSubscribers,
  tracedValues,
} from './utils/references';
import { symbolTracedDataId, symbolTracedDataIndication, symbolTracedFabric } from './utils/tracedDataSymbol';
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

  const { proxy, caughtReferences } = deepTrace({
    originId: id,
    value,
    targetChain: [],
    mutationCallback,
    onCaughtTrace,
  });

  proxyRef = proxy;
  (proxyRef as any)[symbolTracedDataIndication] = true;
  (proxyRef as any)[symbolTracedDataId] = id;

  tracedValues.add(proxyRef);
  clearTrace();

  caughtReferences.forEach(onCaughtTrace);

  return {
    [symbolTracedFabric]: true,

    value: proxyRef,

    getTrace,
    getTraceLength,

    clearTrace,
  };
}
