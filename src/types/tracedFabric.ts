import type { JSONStructure } from './json';
import type { TTraceChange } from './mutation';

export type TTracedFabric<T extends JSONStructure> = {
  // The proxy object that is used to trace the mutations
  value: T;

  getTrace: () => TTraceChange[];
  getTraceLength: () => number;

  clearTrace: () => void;
};
