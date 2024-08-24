import type { symbolTracedFabricRootId } from '../core/symbols';
import type { JSONStructure } from './json';

export type TTracedValueId = number;

export type TTracedFabricValue<T extends JSONStructure = JSONStructure> = T & {
  [symbolTracedFabricRootId]: TTracedValueId;
};
