import type { TMutation } from '@traced-fabric/core';
import { ETFwsDataType, type TTFStateName, type TTFwsMessageUpdate } from './types';

export function createTFwsMessageUpdate(
  trace: TMutation[],
  stateName: TTFStateName,
): TTFwsMessageUpdate {
  return {
    type: '@traced-fabric/ws',
    dataType: ETFwsDataType.update,
    trace,
    stateName,
  };
}
