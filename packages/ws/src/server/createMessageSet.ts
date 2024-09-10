import type { JSONStructure, TTracedFabric } from '@traced-fabric/core';
import { ETFwsDataType, type TTFStateName, type TTFwsMessageSet } from './_types';

export function createTFwsMessageSet<V extends JSONStructure>(
  value: TTracedFabric<V>['value'],
  stateName: TTFStateName,
): TTFwsMessageSet {
  return {
    type: '@traced-fabric/ws',
    dataType: ETFwsDataType.set,
    value,
    stateName,
  };
}
