import type { TTarget, TTraceChange, TTracedFabricValue, TTracedValueId } from '../types/mutation';
import { symbolTracedFabricRootId } from './symbols';

let id: TTracedValueId = 0;
export const getTracedValueId = (): number => id++;

// export const tracedValues = new WeakSet<object>([]);
export const tracedLogs = new WeakMap<object, TTraceChange[]>();

export const tracedSubscribers = new WeakMap<
  TTracedFabricValue, // the sender of the updates (if update happen, this value will send the updates to receivers)
  Record<
    // !WARN - Potential memory leak
    TTracedValueId, // receiver id of the updates
    Set<string> // set of the joined targetChains (the path to the sender in receiver's value)
  >
>();

export function addTracedSubscriber(
  changesSender: TTracedFabricValue,
  changesReceiver: TTracedFabricValue,

  targetChain: TTarget[],
): void {
  const changesReceiverId = changesReceiver[symbolTracedFabricRootId];

  if (!tracedSubscribers.has(changesSender)) tracedSubscribers.set(changesSender, {});

  const senderSubscribers = tracedSubscribers.get(changesSender)!;
  if (!senderSubscribers[changesReceiverId]) senderSubscribers[changesReceiverId] = new Set();

  senderSubscribers[changesReceiverId].add(targetChain.join(''));
}
