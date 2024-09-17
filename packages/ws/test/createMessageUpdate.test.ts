import { EArrayMutation, EMutated, type TMutation } from '@traced-fabric/core';
import { describe, expect, test } from 'bun:test';
import { createTFwsMessageUpdate } from '../src/server/createMessageUpdate';
import { ETFwsDataType, type TTFStateName, type TTFwsMessageUpdate } from '../src/server/types';

describe('createTFwsMessageUpdate', () => {
  test('should create a valid TTFwsMessageUpdate object', () => {
    const trace: TMutation[] = [{
      mutated: EMutated.array,
      type: EArrayMutation.set,
      targetChain: [],
      value: 'someValue',
    }];
    const stateName: TTFStateName = 'someStateName';
    const expected: TTFwsMessageUpdate = {
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.update,
      trace,
      stateName,
    };

    const result = createTFwsMessageUpdate(trace, stateName);

    expect(result).toEqual(expected);
  });

  test('should handle an empty trace array', () => {
    const trace: TMutation[] = [];
    const stateName: TTFStateName = 'emptyTraceState';
    const expected: TTFwsMessageUpdate = {
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.update,
      trace,
      stateName,
    };

    const result = createTFwsMessageUpdate(trace, stateName);

    expect(result).toEqual(expected);
  });

  test('should handle different state names', () => {
    const trace: TMutation[] = [{
      mutated: EMutated.array,
      type: EArrayMutation.set,
      targetChain: [],
      value: 'someValue',
    }];
    const stateName: TTFStateName = 'anotherStateName';

    const expected: TTFwsMessageUpdate = {
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.update,
      trace,
      stateName,
    };

    const result = createTFwsMessageUpdate(trace, stateName);

    expect(result).toEqual(expected);
  });
});
