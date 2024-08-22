import type { JSONStructure } from '../types/json';
import type { TTarget, TTracedFabricValue } from '../types/mutation';

export type TTracedValueMetadata = {
  rootRef: TTracedFabricValue;
  parentRef: JSONStructure;
  key: TTarget;
};

export const tracedValuesMetadata = new WeakMap<JSONStructure, TTracedValueMetadata>();

export function getTargetChain(target: JSONStructure): TTarget[] {
  const metadata = tracedValuesMetadata.get(target);

  if (!metadata) return [];

  return [...getTargetChain(metadata.parentRef), metadata.key];
}
