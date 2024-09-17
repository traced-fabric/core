import type { TTFStateMap } from './_types';
import { applyTrace } from '@traced-fabric/core';
import { ETFwsDataType, type TTFwsMessage } from '../server/_types';

export function applyTFwsMessage(
  data: TTFwsMessage,
  stateMap: TTFStateMap,
): void {
  if (data.dataType === ETFwsDataType.set) {
    stateMap[data.stateName] = data.value;
    return;
  }

  applyTrace(stateMap[data.stateName], data.trace);
}
