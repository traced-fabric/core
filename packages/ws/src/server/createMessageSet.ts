import type { JSONStructure, TTracedFabric } from '@traced-fabric/core';
import { ETFwsDataType, type TTFStateName, type TTFwsMessageSet } from './types';

export function createTFwsMessageSet<T extends JSONStructure>(
  value: TTracedFabric<T>['value'],
  stateName: TTFStateName,
): TTFwsMessageSet {
  return {
    type: '@traced-fabric/ws',
    dataType: ETFwsDataType.set,
    value,
    stateName,
  };
}
