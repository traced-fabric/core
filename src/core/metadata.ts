import type { JSONStructure } from '../types/json';
import type { TTarget } from '../types/mutation';

export type TTracedValueMetadata = {
  rootRef: JSONStructure;
  parentRef: JSONStructure;
  key: TTarget;
};

export type TWeakTracedValueMetadata = {
  rootRef: WeakRef<JSONStructure>;
  parentRef: WeakRef<JSONStructure>;
  key: TTarget;
};

export const tracedValuesMetadata = new WeakMap<JSONStructure, TWeakTracedValueMetadata>();

/**
 * Will return the metadata of the target if it exists,
 * no matter if rootRef and parentRef are garbage collected.
 */
export function getMetadata(target: JSONStructure): TWeakTracedValueMetadata | undefined {
  return tracedValuesMetadata.get(target);
}

/**
 * Will return the metadata of the target if it exists,
 * and if rootRef and parentRef are NOT garbage collected.
 */
export function getStrongMetadata(target: JSONStructure): TTracedValueMetadata | undefined {
  const metadata = getMetadata(target);
  if (!metadata) return;

  const rootRef = metadata?.rootRef.deref();
  const parentRef = metadata?.parentRef.deref();
  if (!rootRef || !parentRef) return;

  return { rootRef, parentRef, key: metadata.key };
}

export function setMetadata(target: JSONStructure, metadata: TTracedValueMetadata): void {
  tracedValuesMetadata.set(target, {
    rootRef: new WeakRef(metadata.rootRef),
    parentRef: new WeakRef(metadata.parentRef),
    key: metadata.key,
  });
}

export function getTargetChain(target: JSONStructure): TTarget[] {
  const metadata = getMetadata(target);
  const parentRef = metadata?.parentRef.deref();

  const parentTargetChain = parentRef ? getTargetChain(parentRef) : [];

  return metadata ? [...parentTargetChain, metadata.key] : [];
}
