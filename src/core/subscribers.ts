import type { JSONStructure, JSONValue } from '../types/json';
import type { TMutation } from '../types/mutation';
import { isStructure } from '../utils/isStructure';
import { isTracedFabric } from '../utils/isTraced';
import { IterableWeakMap } from '../utils/iterableWeakMap';
import { type TTracedValueMetadata, type TWeakTracedValueMetadata, getRootRef, getStrongMetadata, getTargetChain } from './metadata';
import { mutationCallbacks } from './mutationCallback';
import { tracedFabricsTrace } from './traces';

const tracedFabricSubscribers = new WeakMap<
  JSONStructure, // the sender of the updates (if update happen, this value will send the updates to receivers)
  IterableWeakMap<
    JSONStructure, // receiver of the updates
    TWeakTracedValueMetadata[] // set of childMetadata (the path to the sender in receiver's value)
  >
>();

export function addTracedSubscriber(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const subscribers
    = tracedFabricSubscribers.get(changesSender)
    ?? tracedFabricSubscribers.set(changesSender, new IterableWeakMap()).get(changesSender)!;

  const rootRef = getRootRef(metadata.parentRef);
  if (!rootRef) return;

  const receiver = subscribers.get(rootRef) ?? subscribers.set(rootRef, []).get(rootRef)!;

  receiver.push({ parentRef: new WeakRef(metadata.parentRef), key: metadata.key });
}

/**
 * Will unsubscribe the `receiver` from the `sender`.
 * So after mutating the `sender`, the `receiver` will not receive any updates.
 *
 * Needs to be used to speed up garbage collection.
 *
 * @param changesSender the `sender` of the updates (value that is a part of the receiver).
 * @param changesReceiver `receiver` of the updates.
 *
 * @example
 * ```typescript
 * const globalMessages = traceFabric(['Welcome!']);
 *
 * function userLifecycle(): void {
 *   const user = traceFabric({
 *     globalMessages: globalMessages.value,
 *   });
 *
 *   // The `globalMessages` subscribes to the `user` value to send updates.
 *   // To speed up the gc, remove the subscription, at the end of the `user` lifecycle.
 *   removeTraceSubscription(globalMessages.value, user.value);
 * }
 * ```
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-removetracesubscription Wiki page.}
 *
 * @since 0.4.0
 */
export function removeTraceSubscription(
  changesSender: JSONStructure,
  changesReceiver: JSONStructure,
): void {
  const subscribers = tracedFabricSubscribers.get(changesSender);
  if (!subscribers) return;

  subscribers.delete(changesReceiver);
}

export function removeTracedSubscriber(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const subscribers = tracedFabricSubscribers.get(changesSender);
  if (!subscribers) return;

  const rootRef = getRootRef(metadata.parentRef);
  if (!rootRef) return;

  const receiver = subscribers.get(rootRef);
  if (!receiver) return;

  const index = receiver.findIndex(m => m.key === metadata.key && m.parentRef.deref() === metadata.parentRef);

  if (index !== -1) receiver.splice(index, 1);
}

export function removeNestedTracedSubscribers(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const target = (metadata.parentRef as any)[metadata.key] as JSONValue | undefined;
  if (!isStructure(target)) return;

  if (isTracedFabric(target)) return removeTracedSubscriber(changesSender, metadata);

  for (const key in target) {
    const maybeIndex = Number.isNaN(+key) ? key : +key;
    const child = (target as any)[maybeIndex] as JSONValue;

    if (!isStructure(child)) continue;

    const childMetadata = getStrongMetadata(child);

    if (childMetadata) removeNestedTracedSubscribers(target, childMetadata);
    else if (isTracedFabric(child)) removeTracedSubscriber(child, { parentRef: target, key: maybeIndex });
  }
}

export function updateSubscribers(
  changesSender: JSONStructure,
  mutation: TMutation,
): void {
  const subscribers = tracedFabricSubscribers.get(changesSender);
  if (!subscribers) return;

  for (const [receiver, metadata] of subscribers.entries()) {
    const trace = tracedFabricsTrace.get(receiver);
    const receiverMutationCallback = mutationCallbacks.get(receiver);

    if (!trace || !receiverMutationCallback) continue;

    for (const trace of metadata) {
      const parentRef = trace.parentRef.deref();

      const targetChain = (parentRef ? getTargetChain(parentRef) : [])
        .concat(trace.key)
        .concat(mutation.targetChain);

      const traceLog = { ...mutation, targetChain };

      receiverMutationCallback(traceLog);
    }
  }
}
