import { beforeEach, describe, expect, test } from 'bun:test';
import { applyTFwsMessage, type TTFStateMap } from '../src/client/applyMessage';
import { ETFwsDataType } from '../src/server/types';

let stateMap = {
  testState1: { key: 'value' },
  testState2: { key: 'value' },
} satisfies TTFStateMap;

beforeEach(() => {
  stateMap = {
    testState1: { key: 'value' },
    testState2: { key: 'value' },
  };
});

describe('applyTFwsMessage', () => {
  test('should apply trace with correct stateName', () => {
    applyTFwsMessage({
      dataType: ETFwsDataType.set,
      type: '@traced-fabric/ws',
      stateName: 'testState1',
      value: { key: 'newValue' },
    }, stateMap);

    expect(stateMap.testState1).toEqual({ key: 'newValue' });
  });

  test('should set add state when given new stateName', () => {
    applyTFwsMessage({
      dataType: ETFwsDataType.set,
      type: '@traced-fabric/ws',
      stateName: 'testState3',
      value: { key: 'newValue' },
    }, stateMap);

    expect((stateMap as any).testState3).toEqual({ key: 'newValue' });
  });
});
