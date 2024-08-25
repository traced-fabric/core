import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../../src/traceFabric';
import { EArrayMutation, EMutated, EObjectMutation } from '../../src/types/mutation';
import { deepClone } from '../../src/deepClone';

describe('tracedFabric stores trace on changed', () => {
  test('string', () => {
    const tracing = traceFabric({ string: 'string 1' });

    tracing.value.string = 'string 2';

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['string'],
      type: EObjectMutation.set,
      value: 'string 2',
    }]);
    expect(tracing.getTraceLength()).toBe(1);
  });

  test('number', () => {
    const tracing = traceFabric({ number: 1 });

    tracing.value.number = 2;

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['number'],
      type: EObjectMutation.set,
      value: 2,
    }]);
    expect(tracing.getTraceLength()).toBe(1);
  });

  test('null', () => {
    const tracing = traceFabric({ nullOrNumber: null });

    tracing.value.nullOrNumber = 1;

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['nullOrNumber'],
      type: EObjectMutation.set,
      value: 1,
    }]);
    expect(tracing.getTraceLength()).toBe(1);
  });

  test('undefined', () => {
    const tracing = traceFabric({ undefinedOfNumber: undefined });

    tracing.value.undefinedOfNumber = 1;

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['undefinedOfNumber'],
      type: EObjectMutation.set,
      value: 1,
    }]);
    expect(tracing.getTraceLength()).toBe(1);
  });

  test('boolean', () => {
    const tracing = traceFabric({ boolean: (true) as boolean });

    tracing.value.boolean = false;

    expect(tracing.getTrace()).toEqual([{
      mutated: EMutated.object,
      targetChain: ['boolean'],
      type: EObjectMutation.set,
      value: false,
    }]);
    expect(tracing.getTraceLength()).toBe(1);
  });

  test('array', () => {
    const tracing = traceFabric<any>({ array: [1, 2] });

    tracing.value.array.push([4, 5]);
    tracing.value.array[2].pop();
    tracing.value.array.push([6, 7, [8, 9]]);
    tracing.value.array[3][2].pop();

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
    expect(trace[2]).toEqual({
      mutated: EMutated.array,
      targetChain: ['array', 3],
      type: EArrayMutation.set,
      value: [6, 7, [8, 9]],
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.array,
      targetChain: ['array', 3, 2, 1],
      type: EArrayMutation.delete,
    });
    expect(tracing.getTraceLength()).toBe(4);
  });

  test('object', () => {
    const tracing = traceFabric<any>({ object: { key: 'value' } });

    tracing.value.object.key = 'value 2';
    tracing.value.object.key2 = 'value 3';
    tracing.value.object.anotherKey = 'another';
    delete tracing.value.object.anotherKey;
    tracing.value.object.nestedObjects = { obj1: { obj2: 'value' } };
    tracing.value.object.nestedObjects.obj1.obj2 = 'value 2';

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
    expect(trace[4]).toEqual({
      mutated: EMutated.object,
      targetChain: ['object', 'nestedObjects'],
      type: EObjectMutation.set,
      value: { obj1: { obj2: 'value' } },
    });
    expect(trace[5]).toEqual({
      mutated: EMutated.object,
      targetChain: ['object', 'nestedObjects', 'obj1', 'obj2'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(tracing.getTraceLength()).toBe(6);
  });
});

describe('tracedFabric with nested tracedFabric changes', () => {
  test('parent should match if child string changes', () => {
    const tracingChild1 = traceFabric({ string: 'no changes 1' });
    const tracingChild2 = traceFabric({ string: 'no changes 2' });
    const tracingParent = traceFabric({
      child1: tracingChild1.value,
      child2: tracingChild2.value,
      children: [tracingChild1.value, tracingChild2.value],
    });

    tracingChild1.value.string = 'changed 1 once';
    tracingChild2.value.string = 'changed 2 once';
    tracingParent.value.child1.string = 'changed 1 twice';
    tracingParent.value.child2.string = 'changed 2 twice';

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child1', 'string'],
      type: EObjectMutation.set,
      value: 'changed 1 once',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'string'],
      type: EObjectMutation.set,
      value: 'changed 1 once',
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child2', 'string'],
      type: EObjectMutation.set,
      value: 'changed 2 once',
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 1, 'string'],
      type: EObjectMutation.set,
      value: 'changed 2 once',
    });
    expect(trace[4]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child1', 'string'],
      type: EObjectMutation.set,
      value: 'changed 1 twice',
    });
    expect(trace[5]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'string'],
      type: EObjectMutation.set,
      value: 'changed 1 twice',
    });
    expect(trace[6]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child2', 'string'],
      type: EObjectMutation.set,
      value: 'changed 2 twice',
    });
    expect(trace[7]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 1, 'string'],
      type: EObjectMutation.set,
      value: 'changed 2 twice',
    });
    expect(tracingParent.getTraceLength()).toBe(8);
  });

  test('parent should match if child number changes', () => {
    const tracingChild1 = traceFabric({ number: 1 });
    const tracingChild2 = traceFabric({ number: 3 });
    const tracingParent = traceFabric({
      child: tracingChild1.value,
      child2: tracingChild2.value,
      children: [tracingChild1.value, tracingChild2.value],
    });

    tracingChild1.value.number = 2;
    tracingChild2.value.number = 4;
    tracingParent.value.child.number = 3;
    tracingParent.value.child2.number = 5;

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'number'],
      type: EObjectMutation.set,
      value: 2,
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'number'],
      type: EObjectMutation.set,
      value: 2,
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child2', 'number'],
      type: EObjectMutation.set,
      value: 4,
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 1, 'number'],
      type: EObjectMutation.set,
      value: 4,
    });
    expect(trace[4]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'number'],
      type: EObjectMutation.set,
      value: 3,
    });
    expect(trace[5]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'number'],
      type: EObjectMutation.set,
      value: 3,
    });
    expect(trace[6]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child2', 'number'],
      type: EObjectMutation.set,
      value: 5,
    });
    expect(trace[7]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 1, 'number'],
      type: EObjectMutation.set,
      value: 5,
    });
    expect(tracingParent.getTraceLength()).toBe(8);
  });

  test('parent should match if child nullOrNumber changes', () => {
    const tracingChild1 = traceFabric({ nullOrNumber: null });
    const tracingChild2 = traceFabric({ nullOrNumber: 2 });
    const tracingParent = traceFabric({
      child: tracingChild1.value,
      child2: tracingChild2.value,
      children: [tracingChild1.value, tracingChild2.value],
    });

    tracingChild1.value.nullOrNumber = 1;
    tracingChild2.value.nullOrNumber = null;

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'nullOrNumber'],
      type: EObjectMutation.set,
      value: 1,
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'nullOrNumber'],
      type: EObjectMutation.set,
      value: 1,
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child2', 'nullOrNumber'],
      type: EObjectMutation.set,
      value: null,
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 1, 'nullOrNumber'],
      type: EObjectMutation.set,
      value: null,
    });
    expect(tracingParent.getTraceLength()).toBe(4);
  });

  test('parent should match if child boolean changes', () => {
    const tracingChild1 = traceFabric({ boolean: (true as boolean) });
    const tracingChild2 = traceFabric({ boolean: (false as boolean) });
    const tracingParent = traceFabric({
      child: tracingChild1.value,
      child2: tracingChild2.value,
      children: [tracingChild1.value, tracingChild2.value],
    });

    tracingChild1.value.boolean = false;
    tracingChild2.value.boolean = true;

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'boolean'],
      type: EObjectMutation.set,
      value: false,
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'boolean'],
      type: EObjectMutation.set,
      value: false,
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child2', 'boolean'],
      type: EObjectMutation.set,
      value: true,
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 1, 'boolean'],
      type: EObjectMutation.set,
      value: true,
    });
    expect(tracingParent.getTraceLength()).toBe(4);
  });

  test('parent should match if child array changes', () => {
    const tracingChild1 = traceFabric([1, 2]);
    const tracingChild2 = traceFabric({ array: [4, 5] });
    const tracingParent = traceFabric({
      child1: tracingChild1.value,
      child2: tracingChild2.value,
      children: [tracingChild1.value, tracingChild2.value],
    });

    tracingChild1.value.push(3);
    tracingChild2.value.array.push(6);
    tracingChild1.value.pop();
    tracingChild2.value.array.pop();
    tracingParent.value.child1.push(11);
    tracingParent.value.child2.array.push(12);
    tracingParent.value.child1.pop();
    tracingParent.value.child2.array.pop();

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child1', 2],
      type: EArrayMutation.set,
      value: 3,
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 0, 2],
      type: EArrayMutation.set,
      value: 3,
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child2', 'array', 2],
      type: EArrayMutation.set,
      value: 6,
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 1, 'array', 2],
      type: EArrayMutation.set,
      value: 6,
    });
    expect(trace[4]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child1', 2],
      type: EArrayMutation.delete,
    });
    expect(trace[5]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 0, 2],
      type: EArrayMutation.delete,
    });
    expect(trace[6]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child2', 'array', 2],
      type: EArrayMutation.delete,
    });
    expect(trace[7]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 1, 'array', 2],
      type: EArrayMutation.delete,
    });
    expect(trace[8]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child1', 2],
      type: EArrayMutation.set,
      value: 11,
    });
    expect(trace[9]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 0, 2],
      type: EArrayMutation.set,
      value: 11,
    });
    expect(trace[10]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child2', 'array', 2],
      type: EArrayMutation.set,
      value: 12,
    });
    expect(trace[11]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 1, 'array', 2],
      type: EArrayMutation.set,
      value: 12,
    });
    expect(trace[12]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child1', 2],
      type: EArrayMutation.delete,
    });
    expect(trace[13]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 0, 2],
      type: EArrayMutation.delete,
    });
    expect(trace[14]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child2', 'array', 2],
      type: EArrayMutation.delete,
    });
    expect(trace[15]).toEqual({
      mutated: EMutated.array,
      targetChain: ['children', 1, 'array', 2],
      type: EArrayMutation.delete,
    });
    expect(tracingParent.getTraceLength()).toBe(16);
  });

  test('parent should match if child object changes', () => {
    const tracingChild1 = traceFabric<any>({ object: { key: 'value 1' } });
    const tracingChild2 = traceFabric<any>({ object: { key: 'value 3' } });
    const tracingParent = traceFabric({
      child: tracingChild1.value,
      child2: tracingChild2.value,
      children: [tracingChild1.value, tracingChild2.value],
    });

    tracingChild1.value.object.key = 'value 2';
    tracingChild2.value.object.key = 'value 4';
    delete tracingChild1.value.object.key;

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child2', 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 4',
    });
    expect(trace[3]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 1, 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 4',
    });
    expect(trace[4]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'object', 'key'],
      type: EObjectMutation.delete,
    });
    expect(trace[5]).toEqual({
      mutated: EMutated.object,
      targetChain: ['children', 0, 'object', 'key'],
      type: EObjectMutation.delete,
    });
    expect(tracingParent.getTraceLength()).toBe(6);
  });
});

describe('tracedFabric not changing on nested tracedFabric removes', () => {
  test('when child is in object', () => {
    const tracingChild1 = traceFabric({ object: { key: 'value 1' } });
    const tracingParent = traceFabric({ child: tracingChild1.value });

    tracingChild1.value.object.key = 'value 2';
    delete tracingParent.value.child;
    tracingChild1.value.object.key = 'value 3';

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child'],
      type: EObjectMutation.delete,
    });
    expect(tracingParent.getTraceLength()).toBe(2);
  });

  test('when child is in array', () => {
    const tracingChild1 = traceFabric({ object: { key: 'value 1' } });
    const tracingParent = traceFabric({ child: [tracingChild1.value] });

    tracingChild1.value.object.key = 'value 2';
    tracingParent.value.child.pop();
    tracingChild1.value.object.key = 'value 3';

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 0, 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child', 0],
      type: EArrayMutation.delete,
    });
    expect(tracingParent.getTraceLength()).toBe(2);
  });
});

describe('tracedFabric not changing on parent with tracedFabric removes', () => {
  test('when parent is an object', () => {
    const tracingChild = traceFabric({ object: { key: 'value 1' } });
    const tracingParent = traceFabric({ nested1: { nested2: { child: tracingChild.value } } });

    tracingChild.value.object.key = 'value 2';
    delete tracingParent.value.nested1;
    tracingChild.value.object.key = 'value 3';

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['nested1', 'nested2', 'child', 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['nested1'],
      type: EObjectMutation.delete,
    });
    expect(tracingParent.getTraceLength()).toBe(2);
  });

  test('when parent is an array', () => {
    const tracingChild = traceFabric({ object: { key: 'value 1' } });
    const tracingParent = traceFabric([-1, [0, 1, [tracingChild.value]]]);

    tracingChild.value.object.key = 'value 2';
    tracingParent.value.pop();
    tracingChild.value.object.key = 'value 3';

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: [1, 2, 0, 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 2',
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.array,
      targetChain: [1],
      type: EArrayMutation.delete,
    });
    expect(tracingParent.getTraceLength()).toBe(2);
  });
});

describe('tracedFabric subscribes on tracedFabric added', () => {
  test('when child is in object', () => {
    const tracingChild1 = traceFabric({ object: { key: 'value 1' } });
    const tracingParent = traceFabric<{ child: null | typeof tracingChild1.value }>({ child: null });

    tracingChild1.value.object.key = 'value 2';
    tracingParent.value.child = tracingChild1.value;
    tracingChild1.value.object.key = 'value 3';

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child'],
      type: EObjectMutation.set,
      value: { object: { key: 'value 2' } },
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 3',
    });
    expect(tracingParent.getTraceLength()).toBe(2);
  });

  test('when child is in array', () => {
    const tracingChild1 = traceFabric({ object: { key: 'value 1' } });
    const tracingParent = traceFabric({ child: [] });

    tracingChild1.value.object.key = 'value 2';
    tracingParent.value.child.push(tracingChild1.value);
    tracingChild1.value.object.key = 'value 3';

    const trace = tracingParent.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.array,
      targetChain: ['child', 0],
      type: EArrayMutation.set,
      value: { object: { key: 'value 2' } },
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.object,
      targetChain: ['child', 0, 'object', 'key'],
      type: EObjectMutation.set,
      value: 'value 3',
    });
    expect(tracingParent.getTraceLength()).toBe(2);
  });
});

describe('tracedFabric array', () => {
  test('reverse uses one mutation', () => {
    const tracing = traceFabric<any>([[1, 1.5], 2, 3, 4, 5]);

    tracing.value.push([99, 98, 97, 96]);
    tracing.value.push(100);
    tracing.value[0].reverse();
    tracing.value.reverse();
    tracing.value[1].reverse();

    const trace = tracing.getTrace();
    expect(trace[0]).toEqual({
      mutated: EMutated.array,
      targetChain: [5],
      type: EArrayMutation.set,
      value: [99, 98, 97, 96],
    });
    expect(trace[1]).toEqual({
      mutated: EMutated.array,
      targetChain: [6],
      type: EArrayMutation.set,
      value: 100,
    });
    expect(trace[2]).toEqual({
      mutated: EMutated.array,
      targetChain: [0],
      type: EArrayMutation.reverse,
    });
    expect(deepClone(tracing.value[1])).toEqual([96, 97, 98, 99]);
    expect(trace[3]).toEqual({
      mutated: EMutated.array,
      targetChain: [],
      type: EArrayMutation.reverse,
    });
    expect(deepClone(tracing.value)).toEqual([100, [96, 97, 98, 99], 5, 4, 3, 2, [1.5, 1]]);
    expect(trace[4]).toEqual({
      mutated: EMutated.array,
      targetChain: [1],
      type: EArrayMutation.reverse,
    });
    expect(deepClone(tracing.value[1])).toEqual([96, 97, 98, 99]);
    expect(tracing.getTraceLength()).toBe(5);
  });
});
