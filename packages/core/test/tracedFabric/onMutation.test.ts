import { describe, expect, mock, test } from 'bun:test';
import type { TOnMutation } from '../../src/types/tracedFabric';
import { traceFabric } from '../../src/traceFabric';
import { EArrayMutation, EMutated, EObjectMutation } from '../../src/types/mutation';

describe('tracedFabric onMutation', () => {
  test('should be called when a mutation is made', () => {
    const mutationMap = mock<TOnMutation>(mutation => mutation);
    const fabric = traceFabric({ season: 'winter' }, mutationMap);

    fabric.value.season = 'summer';
    fabric.value.season = 'autumn';

    expect(mutationMap).toBeCalledTimes(2);
  });

  test('should be called with the mutation', () => {
    const mutationMap = mock<TOnMutation>(mutation => mutation);
    const fabric = traceFabric({ season: 'winter' }, mutationMap);

    fabric.value.season = 'summer';

    expect(mutationMap).toBeCalledWith({
      mutated: 'object',
      type: 'set',
      targetChain: ['season'],
      value: 'summer',
    });
  });

  test('should be able to modify the mutation', () => {
    const fabric = traceFabric({
      season: 'winter',
    }, mutation => ({ ...mutation, time: Date.now() }));

    fabric.value.season = 'summer';

    expect(fabric.trace[0]).toEqual({
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['season'],
      value: 'summer',
      time: expect.any(Number),
    });
  });

  test('should modify mutation from nested tracedFabric', () => {
    const child = traceFabric([1, 2, 3]);
    const parent = traceFabric(
      { child: child.value },
      mutation => ({ ...mutation, time: Date.now() }),
    );

    child.value.push(4);

    expect(parent.trace[0]).toEqual({
      mutated: EMutated.array,
      type: EArrayMutation.set,
      targetChain: ['child', 3],
      value: 4,
      time: expect.any(Number),
    });
  });

  test('should call its own on mutation', () => {
    const child = traceFabric(
      [1, 2, 3],
      mutation => ({ ...mutation, time: new Date(Date.now()).toISOString() }),
    );
    const parent = traceFabric(
      { child: child.value, number: 1 },
      mutation => ({ ...mutation, time: Date.now() }),
    );

    child.value.push(4);
    parent.value.number = 2;

    const childTrace = child.trace;
    expect(childTrace[0]).toEqual({
      mutated: EMutated.array,
      type: EArrayMutation.set,
      targetChain: [3],
      value: 4,
      time: expect.any(String),
    });
    expect(childTrace.length).toBe(1);
    const parentTrace = parent.trace;
    expect(parentTrace[0]).toEqual({
      mutated: EMutated.array,
      type: EArrayMutation.set,
      targetChain: ['child', 3],
      value: 4,
      time: expect.any(Number),
    });
    expect(parentTrace[1]).toEqual({
      mutated: EMutated.object,
      type: EObjectMutation.set,
      targetChain: ['number'],
      value: 2,
      time: expect.any(Number),
    });
    expect(parentTrace.length).toBe(2);
  });
});
