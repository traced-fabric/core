import { describe, expect, test } from 'bun:test';
import { removeTraceSubscription } from '../../src/core/subscribers';
import { deepClone } from '../../src/deepClone';
import { traceFabric } from '../../src/traceFabric';
import { EArrayMutation, EMutated } from '../../src/types/mutation';

describe('removeTraceSubscription(...)', () => {
  test('should unsubscribe sender from subscriber', () => {
    const child = traceFabric([1, 2, 3]);
    const parent = traceFabric({ array: child.value });

    child.value.push(4);
    removeTraceSubscription(child.value, parent.value);
    child.value.push(5);

    expect(deepClone(parent.value.array)).toEqual([1, 2, 3, 4, 5]);
    expect(parent.trace).toEqual([{
      mutated: EMutated.array,
      targetChain: ['array', 3],
      type: EArrayMutation.set,
      value: 4,
    }]);
    expect(parent.trace.length).toBe(1);
  });
});
