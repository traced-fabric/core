import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../src/traceFabric';
import { removeTraceSubscription } from '../src/core/references';
import { deepClone } from '../src/deepClone';
import { EArrayMutation, EMutated } from '../src/types/mutation';

describe('removeTraceSubscription', () => {
  test('should unsubscribe trace sender from trace subscriber', () => {
    const tracedChild = traceFabric([1, 2, 3]);
    const tracedParent = traceFabric({ innerArray: tracedChild.value });

    tracedChild.value.push(4);
    removeTraceSubscription(tracedChild.value, tracedParent.value);
    tracedChild.value.push(5);

    expect(deepClone(tracedParent.value.innerArray)).toEqual([1, 2, 3, 4, 5]);
    expect(tracedParent.getTrace()).toEqual([{
      mutated: EMutated.array,
      targetChain: ['innerArray', 3],
      type: EArrayMutation.set,
      value: 4,
    }]);
    expect(tracedParent.getTraceLength()).toBe(1);
  });
});
