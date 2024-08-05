import { describe, expect, test } from 'bun:test';
import { deepClone } from '../src/proxy/deepClone';

describe('deepClone result should match the origin', () => {
  test('string', () => {
    expect(deepClone('string')).toBe('string');
  });

  test('number', () => {
    expect(deepClone(1)).toBe(1);
  });

  test('boolean', () => {
    expect(deepClone(true)).toBe(true);
  });

  test('null', () => {
    expect(deepClone(null)).toBe(null);
  });

  test('undefined', () => {
    expect(deepClone(undefined)).toBe(undefined);
  });

  test('array', () => {
    const origin = [1, 2, [4, 5]];
    const clone = deepClone(origin);

    expect(clone).toEqual(origin);
    expect(clone).not.toBe(origin);
    expect(clone[2]).not.toBe(origin[2]);
  });

  test('object', () => {
    const origin = { a: 1, b: { c: 2 } };
    const clone = deepClone(origin);

    expect(clone).toEqual(origin);
    expect(clone).not.toBe(origin);
    expect(clone.b).not.toBe(origin.b);
  });

  test('without symbols', () => {
    const symbol = Symbol('symbol');
    const origin = { a: 1, [symbol]: 2 };
    const clone = deepClone(origin);

    expect(clone[symbol]).toBeUndefined();
  });
});
