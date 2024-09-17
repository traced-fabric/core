import type { JSONStructure } from '@traced-fabric/core';
import { describe, expect, test } from 'bun:test';
import { createTFwsMessageSet } from '../src/server/createMessageSet';
import { ETFwsDataType } from '../src/server/types';

describe('createTFwsMessageSet', () => {
  test('should create a valid TTFwsMessageSet object', () => {
    const value = { key: 'value' };
    const stateName = 'someState';

    const result = createTFwsMessageSet(value, stateName);

    expect(result).toEqual({
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.set,
      value,
      stateName,
    });
  });

  test('should handle object', () => {
    const value = {};
    const stateName = 'emptyState';

    const result = createTFwsMessageSet(value, stateName);

    expect(result).toEqual({
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.set,
      value,
      stateName,
    });
  });

  test('should handle array', () => {
    const value = [] as JSONStructure[];
    const stateName = 'emptyArrayState';

    const result = createTFwsMessageSet(value, stateName);

    expect(result).toEqual({
      type: '@traced-fabric/ws',
      dataType: ETFwsDataType.set,
      value,
      stateName,
    });
  });
});
