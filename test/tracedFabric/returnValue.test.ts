import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../../src/traceFabric';
import { EMutated, EObjectMutation } from '../../src/types/mutation';
import { deepClone } from '../../src/deepClone';

describe('tracedFabric should return ', () => {
  test('to have proxy value', () => {
    const tracing = traceFabric({ string: 'string' });

    expect(deepClone(tracing.value)).toEqual({ string: 'string' });
  });

  test('function to clear trace', () => {
    const tracing = traceFabric({ string: 'string' });

    tracing.value.string = 'new string';

    expect(tracing.trace).toEqual([{
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['string'],
      value: 'new string',
    }]);

    tracing.clearTrace();

    expect(tracing.trace).toEqual([]);
    expect(tracing.trace.length).toEqual(0);
  });

  test('function to get trace length', () => {
    const tracing = traceFabric({ string: 'string' });

    tracing.value.string = 'new string';
    tracing.value.string = 'new string 1';
    tracing.value.string = 'new string 2';
    tracing.value.string = 'new string 3';

    expect(tracing.trace.length).toEqual(4);
  });

  test('function to get trace', () => {
    const tracing = traceFabric({ string: 'string' });

    tracing.value.string = 'new string';

    expect(tracing.trace).toEqual([{
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['string'],
      value: 'new string',
    }]);

    tracing.value.string = 'new string 2';

    expect(tracing.trace).toEqual([{
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['string'],
      value: 'new string',
    }, {
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['string'],
      value: 'new string 2',
    }]);
  });
});
