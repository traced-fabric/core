import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../../src/traceFabric';
import { EArrayMutation, EMutated, EObjectMutation } from '../../src/types/mutation';

describe('tracedFabric mutation', () => {
  test('should match if string changes', () => {
    const tracing = traceFabric({ string: 'string 1' });

    tracing.value.string = 'string 2';

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['string'],
      type: EObjectMutation.set,
      value: 'string 2',
    }]);
  });

  test('should match if number changes', () => {
    const tracing = traceFabric({ number: 1 });

    tracing.value.number = 2;

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['number'],
      type: EObjectMutation.set,
      value: 2,
    }]);
  });

  test('should match if nullOrNumber changes', () => {
    const tracing = traceFabric({ nullOrNumber: null });

    tracing.value.nullOrNumber = 1;

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['nullOrNumber'],
      type: EObjectMutation.set,
      value: 1,
    }]);
  });

  test('should match if boolean changes', () => {
    const tracing = traceFabric({ boolean: (true) as boolean });

    tracing.value.boolean = false;

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['boolean'],
      type: EObjectMutation.set,
      value: false,
    }]);
  });

  test('should match if array changes', () => {
    const tracing = traceFabric<any>({ array: [1, 2] });

    tracing.value.array.push([4, 5]);
    tracing.value.array[2].pop();

    const trace = tracing.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.array,
      targetChain: ['array', 2],
      type: EArrayMutation.set,
      value: [4, 5],
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.array,
      targetChain: ['array', 2, 1],
      type: EArrayMutation.delete,
    });
  });

  test('should match if object changes', () => {
    const tracing = traceFabric<any>({ object: { key: 'value' } });

    tracing.value.object.key = 'value 2';
    tracing.value.object.key2 = 'value 3';
    tracing.value.object.anotherKey = 'another';
    delete tracing.value.object.anotherKey;

    const trace = tracing.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['object', 'key'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['object', 'key2'],
      type: EObjectMutation.set,
      value: 'value 3',
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.object,
      targetChain: ['object', 'anotherKey'],
      type: EObjectMutation.set,
      value: 'another',
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.object,
      targetChain: ['object', 'anotherKey'],
      type: EObjectMutation.delete,
    });
  });
});
