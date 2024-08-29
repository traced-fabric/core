import type { JSONStructure } from './json';
import type { TTraceChange } from './mutation';

export type TOnMutation<T = TTraceChange> = (mutation: TTraceChange) => T;

/**
 * The output of the traceFabric function
 *
 * @param T - The type of the original object, which will be traced
 * @param _OPTIONS - The options for the traceFabric (TTraceFabricOptions)
 */
export type TTracedFabric<
  T extends JSONStructure,
  _TRACE_CHANGE = TTraceChange,
> = {
  value: T;

  getTrace: () => _TRACE_CHANGE[];
  getTraceLength: () => number;

  clearTrace: () => void;
};
