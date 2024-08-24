import type { JSONStructure } from '../types/json';
import type { TTarget } from '../types/mutation';
import type { TTracedFabricValue } from '../types/tracedValue';

export type TTracedValueMetadata<T extends JSONStructure = JSONStructure> = {
  // [ ] - make it a weak map
  rootRef: TTracedFabricValue<T>;
  // [ ] - make it a weak map
  parentRef: JSONStructure;
  key: TTarget;
};

const tracedValuesMetadata = new WeakMap<JSONStructure, TTracedValueMetadata>();

export function getTargetChain(target: JSONStructure): TTarget[] {
  const metadata = tracedValuesMetadata.get(target);

  if (!metadata) return [];

  return [...getTargetChain(metadata.parentRef), metadata.key];
}

export function hasMetadata(target: JSONStructure): boolean {
  return tracedValuesMetadata.has(target);
}

export function getMetadata(target: JSONStructure): TTracedValueMetadata | undefined {
  return tracedValuesMetadata.get(target);
}

export function setMetadata(target: JSONStructure, metadata: TTracedValueMetadata): void {
  tracedValuesMetadata.set(target, metadata);
}
