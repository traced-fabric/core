import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../src/traceFabric';
import { isTraced, isTracedRootValue, isTracedValue } from '../src/utils/isTraced';

describe('isTracedRootValue function', () => {
  test('returns false if given a non-traced value', () => {
    expect(isTracedRootValue(1)).toBe(false);
    expect(isTracedRootValue('string')).toBe(false);
    expect(isTracedRootValue(true)).toBe(false);
    expect(isTracedRootValue(null)).toBe(false);
    expect(isTracedRootValue(undefined)).toBe(false);
    expect(isTracedRootValue(Symbol('symbol'))).toBe(false);
    expect(isTracedRootValue({ a: 1, b: 2 })).toBe(false);
    expect(isTracedRootValue([1, 2, 3])).toBe(false);
    expect(isTracedRootValue(() => {})).toBe(false);
  });

  test('returns true if given a traced root value', () => {
    const traced = traceFabric({
      innerArray: [1, 2, 3],
      innerObject: { a: 1, b: 2 },
    });

    expect(isTracedRootValue(traced.value)).toBe(true);
    expect(isTracedRootValue(traced.value.innerArray)).toBe(false);
    expect(isTracedRootValue(traced.value.innerObject)).toBe(false);
  });
});

describe('isTracedValue function', () => {
  test('returns false if given a non-traced value', () => {
    expect(isTracedValue(1)).toBe(false);
    expect(isTracedValue('string')).toBe(false);
    expect(isTracedValue(true)).toBe(false);
    expect(isTracedValue(null)).toBe(false);
    expect(isTracedValue(undefined)).toBe(false);
    expect(isTracedValue(Symbol('symbol'))).toBe(false);
    expect(isTracedValue({ a: 1, b: 2 })).toBe(false);
    expect(isTracedValue([1, 2, 3])).toBe(false);
    expect(isTracedValue(() => {})).toBe(false);
  });

  test('returns true if given a traced root value', () => {
    const traced = traceFabric({
      innerArray: [1, 2, 3],
      innerObject: { a: 1, b: 2 },
    });

    expect(isTracedValue(traced.value)).toBe(false);
    expect(isTracedValue(traced.value.innerArray)).toBe(true);
    expect(isTracedValue(traced.value.innerObject)).toBe(true);
  });
});

describe('isTraced function', () => {
  test('returns false if given a non-traced value', () => {
    expect(isTraced(1)).toBe(false);
    expect(isTraced('string')).toBe(false);
    expect(isTraced(true)).toBe(false);
    expect(isTraced(null)).toBe(false);
    expect(isTraced(undefined)).toBe(false);
    expect(isTraced(Symbol('symbol'))).toBe(false);
    expect(isTraced({ a: 1, b: 2 })).toBe(false);
    expect(isTraced([1, 2, 3])).toBe(false);
    expect(isTraced(() => {})).toBe(false);
  });

  test('returns true if given a traced root value', () => {
    const traced = traceFabric({
      innerArray: [1, 2, 3],
      innerObject: { a: 1, b: 2 },
    });

    expect(isTraced(traced.value)).toBe(true);
    expect(isTraced(traced.value.innerArray)).toBe(true);
    expect(isTraced(traced.value.innerObject)).toBe(true);
  });
});
