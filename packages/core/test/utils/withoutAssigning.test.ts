import { describe, expect, test } from 'bun:test';
import { isAssigning, withoutAssigning } from '../../src/utils/withoutAssigning';
import { traceFabric } from '../../src/traceFabric';
import { deepClone } from '../../src/deepClone';

describe('isAssigning(...)', () => {
  test('should be true by default', () => {
    expect(isAssigning()).toBe(true);
  });
});

describe('withoutAssigning(...)', () => {
  test('should disable assigning in the callback', () => {
    withoutAssigning(() => {
      expect(isAssigning()).toBe(false);
    });
  });

  test('should enable assigning after the callback', () => {
    withoutAssigning(() => {});

    expect(isAssigning()).toBe(true);
  });

  test('should return the result of the callback', () => {
    const resultNumber = withoutAssigning(() => 1);
    const resultString = withoutAssigning(() => 'string');
    const resultBoolean = withoutAssigning(() => true);
    const resultObject = withoutAssigning(() => ({ a: 1 }));
    const resultArray = withoutAssigning(() => [1, 2, 3]);
    const resultFunction = withoutAssigning(() => () => {});

    expect(resultNumber).toBe(1);
    expect(resultString).toBe('string');
    expect(resultBoolean).toBe(true);
    expect(resultObject).toEqual({ a: 1 });
    expect(resultArray).toEqual([1, 2, 3]);
    expect(resultFunction).toBeFunction();
  });

  test('should disable assigning', () => {
    const fabric = traceFabric({ object: { a: 1, b: 2 } as any, array: [1, 2, 3] });

    withoutAssigning(() => {
      fabric.value.object.a = 2;
      fabric.value.array[0] = 2;

      fabric.value.object.c = 3;
      fabric.value.array[3] = 4;

      delete fabric.value.object.b;
      fabric.value.array.pop();
    });

    expect(deepClone(fabric.value)).toEqual({
      object: { a: 1, b: 2 },
      array: [1, 2, 3],
    });
  });

  test('should not affect the trace', () => {
    const fabric = traceFabric({ object: { a: 1, b: 2 } as any, array: [1, 2, 3] });

    withoutAssigning(() => {
      fabric.value.object.a = 2;
      fabric.value.array[0] = 2;

      fabric.value.object.c = 3;
      fabric.value.array[3] = 4;

      delete fabric.value.object.b;
      fabric.value.array.pop();
    });

    expect(fabric.trace.length).toBe(0);
  });
});
