import { applyTrace, type JSONStructure } from '@traced-fabric/core';
import { ETFwsDataType, type TTFwsMessage } from '../server/types';

export type TTFStateMap = {
  [key: string]: JSONStructure;
};

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
