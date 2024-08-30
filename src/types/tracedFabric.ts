import type { JSONStructure } from './json';
import type { TMutation } from './mutation';

export type TOnMutation<T = TMutation> = (mutation: TMutation) => T;

/**
 * The output of the traceFabric function
 *
 * @param T - The type of the original object, which will be traced
 * @param _OPTIONS - The options for the traceFabric (TTraceFabricOptions)
 */
export type TTracedFabric<
  T extends JSONStructure,
  _TRACE_CHANGE = TMutation,
> = {
  value: T;

  trace: _TRACE_CHANGE[];
  clearTrace: () => void;
};
