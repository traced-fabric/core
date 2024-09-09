import { describe, expect, test } from 'bun:test';
import { isStructure } from '../../src/utils/isStructure';

describe('isStructure(...)', () => {
  test('returns false if given a number', () => {
    expect(isStructure(1)).toBe(false);
  });

  test('returns false if given a string', () => {
    expect(isStructure('string')).toBe(false);
  });

  test('returns false if given a boolean', () => {
    expect(isStructure(true)).toBe(false);
  });

  test('returns false if given null', () => {
    expect(isStructure(null)).toBe(false);
  });

  test('returns false if given undefined', () => {
    expect(isStructure(undefined)).toBe(false);
  });

  test('returns true if given an array', () => {
    expect(isStructure([1, 2, 3])).toBe(true);
  });

  test('returns true if given an object', () => {
    expect(isStructure({ a: 1, b: 2 })).toBe(true);
  });

  test('returns false if given a symbol', () => {
    expect(isStructure(Symbol('symbol'))).toBe(false);
  });

  test('returns false if given a function', () => {
    expect(isStructure(() => {})).toBe(false);
  });
});
