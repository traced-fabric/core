import type { JSONStructure } from './json';
import type { TTraceChange } from './mutation';

export type TTraceFabricOptionUnknown = Partial<Record<keyof TTraceFabricOptionDefaults, unknown>>;
export type TTraceFabricOptionDefaults = {
  TraceChange: TTraceChange;
};

export type TTracedFabricMutationMap<T = TTraceChange> = (mutation: TTraceChange) => T;
export type TTracedFabricMutationUnMap<T = TTraceChange> = (mutationMap: T) => TTraceChange;

export type TTraceFabricOptions<_OPTIONS extends TTraceFabricOptionUnknown = TTraceFabricOptionDefaults> = {
  mutationMap: TTracedFabricMutationMap<_OPTIONS['TraceChange']>;
};

/**
 * The output of the traceFabric function
 *
 * @param T - The type of the original object, which will be traced
 * @param _OPTIONS - The options for the traceFabric (TTraceFabricOptions)
 */
export type TTracedFabric<
  T extends JSONStructure,
  _OPTIONS extends TTraceFabricOptionUnknown = TTraceFabricOptionDefaults,
> = {
  value: T;

  getTrace: () => _OPTIONS['TraceChange'][];
  getTraceLength: () => number;

  clearTrace: () => void;
};
