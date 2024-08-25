import type { JSONStructure } from '../types/json';
import type { TTraceChange } from '../types/mutation';
import { isStructure } from '../utils/isStructure';
import { isTracedRootValue } from '../utils/isTraced';
import { type TTracedValueMetadata, getMetadata, getTargetChain } from './metadata';

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

  receiver.push({
    parentRef: metadata.parentRef,
    key: metadata.key,
  });
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

export function removeNestedTracedSubscribers(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const target = (metadata.parentRef as any)[metadata.key] as JSONStructure;

  if (isTracedRootValue(target)) return removeTracedSubscriber(changesSender, metadata);

  for (const key in target) {
    const maybeIndex = Number.isNaN(+key) ? key : +key;
    const child = (target as any)[maybeIndex] as JSONStructure;

    if (!isStructure(child)) continue;

    const childMetadata = getMetadata(child);

    if (childMetadata)
      removeNestedTracedSubscribers(target, childMetadata);
    else if (isTracedRootValue(child))
      removeTracedSubscriber(child, { rootRef: metadata.rootRef, parentRef: target, key: maybeIndex });
  }
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
