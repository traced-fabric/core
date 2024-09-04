import type { JSONStructure } from '../types/json';
import type { TMutation } from '../types/mutation';
import { isStructure } from '../utils/isStructure';
import { isTracedFabric } from '../utils/isTraced';
import { IterableWeakMap } from '../utils/iterableWeakMap';
import { type TTracedValueMetadata, type TWeakTracedValueMetadata, getStrongMetadata, getTargetChain } from './metadata';
import { mutationCallbacks } from './mutationCallback';
import { tracedFabricsTrace } from './traces';

const tracedFabricSubscribers = new WeakMap<
  JSONStructure, // the sender of the updates (if update happen, this value will send the updates to receivers)
  IterableWeakMap<
    TTracedValueMetadata['rootRef'], // receiver of the updates
    Pick<TWeakTracedValueMetadata, 'key' | 'parentRef'>[] // set of childMetadata (the path to the sender in receiver's value)
  >
>();

export function addTracedSubscriber(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const subscribers
    = tracedFabricSubscribers.get(changesSender)
    ?? tracedFabricSubscribers.set(changesSender, new IterableWeakMap()).get(changesSender)!;

  const receiver
    = subscribers.get(metadata.rootRef)
    ?? subscribers.set(metadata.rootRef, []).get(metadata.rootRef)!;

  receiver.push({ parentRef: new WeakRef(metadata.parentRef), key: metadata.key });
}

/**
 * Will drop the subscription of the sender from the receiver.
 * Sender and receiver are both tracedFabric values.
 * After calling, receiver will no longer receive any updates from the sender,
 * but objects will still be linked.
 *
 * Needs to be used to avoid memory leaks.
 *
 * @param changesSender the sender of the updates (value that is a part of the receiver)
 * @param changesReceiver reviver of the updates
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
 *   // The `globalMessages` binds itself to the `user`, to provide updates.
 *   // To remove the binding and avoid memory leaks, we should remove the subscription
 *   // at the end of the `user` lifecycle.
 *   removeTraceSubscription(globalMessages.value, user.value);
 * }
 * ```
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

  const receiver = subscribers.get(metadata.rootRef);
  if (!receiver) return;

  const index = receiver.findIndex(m => m.key === metadata.key && m.parentRef.deref() === metadata.parentRef);

  if (index !== -1) receiver.splice(index, 1);
}

export function removeNestedTracedSubscribers(
  changesSender: JSONStructure,
  metadata: TTracedValueMetadata,
): void {
  const target = (metadata.parentRef as any)[metadata.key] as JSONStructure;

  if (isTracedFabric(target)) return removeTracedSubscriber(changesSender, metadata);

  for (const key in target) {
    const maybeIndex = Number.isNaN(+key) ? key : +key;
    const child = (target as any)[maybeIndex] as JSONStructure;

    if (!isStructure(child)) continue;

    const childMetadata = getStrongMetadata(child);

    if (childMetadata)
      removeNestedTracedSubscribers(target, childMetadata);
    else if (isTracedFabric(child))
      removeTracedSubscriber(child, { rootRef: metadata.rootRef, parentRef: target, key: maybeIndex });
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
