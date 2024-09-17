import type { JSONStructure, TTracedFabric } from '@traced-fabric/core';
import { describe, expect, test } from 'bun:test';
import { createTFwsMessageSet } from '../src/server/createMessageSet';
import { ETFwsDataType } from '../src/server/types';

describe('createTFwsMessageSet', () => {
  test('should create a valid TTFwsMessageSet object', () => {
    const value: TTracedFabric<JSONStructure>['value'] = { key: 'value' };
    const stateName = 'someState';

    const result = createTFwsMessageSet(value, stateName);

    expect(result).toEqual({
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.set,
      value,
      stateName,
    });
  });

  test('should handle empty value', () => {
    const value: TTracedFabric<JSONStructure>['value'] = {};
    const stateName = 'emptyState';

    const result = createTFwsMessageSet(value, stateName);

    expect(result).toEqual({
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.set,
      value,
      stateName,
    });
  });

  test('should handle null value', () => {
    const value: TTracedFabric<JSONStructure>['value'] = null;
    const stateName = 'nullState';

    const result = createTFwsMessageSet(value, stateName);

    expect(result).toEqual({
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.set,
      value,
      stateName,
    });
  });
});
