import type { JSONStructure } from '../types/json';
import type { TTraceChange } from '../types/mutation';
import { type TTracedValueMetadata, getTargetChain } from './metadata';

export const tracedLogs = new WeakMap<JSONStructure, TTraceChange[]>();

const tracedSubscribers = new WeakMap<
  JSONStructure, // the sender of the updates (if update happen, this value will send the updates to receivers)
  Map<
    TTracedValueMetadata['rootRef'], // receiver of the updates
    Pick<TTracedValueMetadata, 'key' | 'parentRef'>[] // set of childMetadata (the path to the sender in receiver's value)
  >
>();

export function addTracedSubscriber(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const subscribers
    = tracedSubscribers.get(changesSender)
    ?? tracedSubscribers.set(changesSender, new Map()).get(changesSender)!;

  const receiver
    = subscribers.get(metadata.rootRef)
    ?? subscribers.set(metadata.rootRef, []).get(metadata.rootRef)!;

  receiver.push(metadata);
}

export function removeTracedSubscriber(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const subscribers = tracedSubscribers.get(changesSender);
  if (!subscribers) return;

  const receiver = subscribers.get(metadata.rootRef);
  if (!receiver) return;

  const index = receiver.findIndex(m => m.key === metadata.key && m.parentRef === metadata.parentRef);

  if (index !== -1) receiver.splice(index, 1);
}

export function updateSubscribers(
  changesSender: JSONStructure,
  mutation: TTraceChange,
): void {
  const subscribers = tracedSubscribers.get(changesSender);
  if (!subscribers) return;

  for (const [receiver, metadata] of subscribers.entries()) {
    const traceLog = tracedLogs.get(receiver);
    if (!traceLog) continue;

    for (const trace of metadata) {
      const targetChain = getTargetChain(trace.parentRef).concat(trace.key);

      traceLog.push({
        ...mutation,
        targetChain: targetChain.concat(mutation.targetChain),
      });
    }
  }
}
