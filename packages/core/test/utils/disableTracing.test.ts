import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../../src/traceFabric';
import { disableTracing, enableTracing, isTracingEnabled } from '../../src/utils/disableTracing';
import { EArrayMutation, EMutated, EObjectMutation } from '../../src/types/mutation';
import { withoutTracing } from '../../src/utils/withoutTracing';

describe('isTracingEnabled(...)', () => {
  test('returns true for default values', () => {
    expect(isTracingEnabled({ a: 1, b: 2 })).toBe(true);
    expect(isTracingEnabled([1, 2, 3])).toBe(true);
  });

  test('returns true if given a tracedFabric', () => {
    const traced = traceFabric({
      innerArray: [1, 2, 3],
      innerObject: { a: 1, b: 2 },
    });

    expect(isTracingEnabled(traced.value)).toBe(true);
  });

  test('returns true if given a tracedValue', () => {
    const traced = traceFabric({
      innerArray: [1, 2, 3],
      innerObject: { a: 1, b: 2 },
    });

    expect(isTracingEnabled(traced.value.innerArray)).toBe(true);
    expect(isTracingEnabled(traced.value.innerObject)).toBe(true);
  });

  test('returns false if given a disabled value', () => {
    const disabled = disableTracing({ a: 1, b: 2 });

    expect(isTracingEnabled(disabled)).toBe(false);
  });

  test('returns false if given a disabled tracedValue', () => {
    const disabled = traceFabric({ tracingDisabled: disableTracing([1, 2, 3]) });

    expect(isTracingEnabled(disabled.value)).toBe(true);
    expect(isTracingEnabled(disabled.value.tracingDisabled)).toBe(false);
  });
});

describe('disableTracing(...)', () => {
  test('returns the same origin', () => {
    const value = { a: 1, b: 2 };

    expect(disableTracing(value)).toBe(value as any);
  });

  test('throw an error if passed to traceFabric(...)', () => {
    expect(() => traceFabric(disableTracing({}))).toThrowError();
  });

  test('not record mutations for tracedValue', () => {
    const traced = traceFabric({
      tracedValue: 'not changed',
      nestedObject: disableTracing({ name: 'not changed' }),
      nestedArray: disableTracing([1, 2, 3]),
    });

    traced.value.tracedValue = 'changed';
    traced.value.nestedObject.name = 'changed';
    traced.value.nestedArray.push(4);

    const trace = traced.trace;
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['tracedValue'],
      value: 'changed',
    });
    expect(traced.trace.length).toBe(1);
  });
});

describe('enableTracing(...)', () => {
  test('returns the same origin', () => {
    const value = { a: 1, b: 2 };

    expect(enableTracing(value)).toBe(value);
  });

  test('discards the disabled tracing', () => {
    const disabled = disableTracing({ a: 1, b: 2 });
    const enabled = enableTracing(disabled);

    expect(isTracingEnabled(enabled)).toBe(true);
  });

  test('not record mutations for tracedValue after disabling', () => {
    const traced = traceFabric({
      tracedValue: 'not changed',
      nestedObject: disableTracing({ name: 'not changed' }),
      nestedArray: disableTracing([1, 2, 3]),
    });
    enableTracing(traced.value.nestedObject);
    enableTracing(traced.value.nestedArray);

    traced.value.tracedValue = 'changed';
    traced.value.nestedObject.name = 'changed';
    traced.value.nestedArray.push(4);

    const trace = traced.trace;
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['tracedValue'],
      value: 'changed',
    });
    expect(traced.trace.length).toBe(1);
  });

  test('to record mutation after value reassignment', () => {
    const traced = traceFabric({
      tracedValue: 'not changed',
      nestedObject: disableTracing({ name: 'not changed' }),
      nestedArray: disableTracing([1, 2, 3]),
    });
    withoutTracing(() => {
      traced.value.nestedObject = enableTracing(traced.value.nestedObject);
      traced.value.nestedArray = enableTracing(traced.value.nestedArray);
    });

    traced.value.nestedObject.name = 'changed';
    traced.value.nestedArray.push(4);

    const trace = traced.trace;
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['nestedObject', 'name'],
      value: 'changed',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.array,
      type: EArrayMutation.set,
      targetChain: ['nestedArray', 3],
      value: 4,
    });
    expect(traced.trace.length).toBe(2);
  });
});
