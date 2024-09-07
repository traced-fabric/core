import type { JSONStructure } from '../types/json';
import type { TTarget } from '../types/mutation';
import { isTracedFabric } from '../utils/isTraced';

export type TTracedValueMetadata = {
  parentRef: JSONStructure;
  key: TTarget;
};

export type TWeakTracedValueMetadata = {
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

  const parentRef = metadata.parentRef.deref();
  if (!parentRef) return;

  return { parentRef, key: metadata.key };
}

export function setMetadata(target: JSONStructure, metadata: Required<TTracedValueMetadata>): void {
  tracedValuesMetadata.set(target, {
    parentRef: new WeakRef(metadata.parentRef),
    key: metadata.key,
  });
}

export function getRootRef(target: JSONStructure): JSONStructure | undefined {
  if (isTracedFabric(target)) return target;

  const metadata = getStrongMetadata(target);
  if (!metadata) return undefined;

  return getRootRef(metadata.parentRef);
}

export function getTargetChain(target: JSONStructure): TTarget[] {
  const metadata = getStrongMetadata(target);
  const parentTargetChain = metadata?.parentRef ? getTargetChain(metadata.parentRef) : [];

  return metadata ? [...parentTargetChain, metadata.key] : [];
}
