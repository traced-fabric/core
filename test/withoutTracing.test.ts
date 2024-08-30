import { describe, expect, test } from 'bun:test';
import { isTracing, withoutTracing } from '../src/utils/withoutTracing';
import { traceFabric } from '../src/traceFabric';
import { deepClone } from '../src/deepClone';

describe('isTracing', () => {
  test('should be true by default', () => {
    expect(isTracing()).toBe(true);
  });
});

describe('withoutTracing', () => {
  test('should disable tracing in the callback', () => {
    withoutTracing(() => {
      expect(isTracing()).toBe(false);
    });
  });

  test('should enable tracing after the callback', () => {
    withoutTracing(() => {});

    expect(isTracing()).toBe(true);
  });

  test('should return the result of the callback', () => {
    const resultNumber = withoutTracing(() => 1);
    const resultString = withoutTracing(() => 'string');
    const resultBoolean = withoutTracing(() => true);
    const resultObject = withoutTracing(() => ({ a: 1 }));
    const resultArray = withoutTracing(() => [1, 2, 3]);
    const resultFunction = withoutTracing(() => () => {});

    expect(resultNumber).toBe(1);
    expect(resultString).toBe('string');
    expect(resultBoolean).toBe(true);
    expect(resultObject).toEqual({ a: 1 });
    expect(resultArray).toEqual([1, 2, 3]);
    expect(resultFunction).toBeFunction();
  });

  test('should disable tracing for the tracedFabric values', () => {
    const tracedObject = traceFabric({ objects: { a: 1, b: 2 } as any, arrays: [1, 2, 3] });
    const tracedArray = traceFabric([{ a: 1, b: 2 }, [1, 2, 3]] as any);

    withoutTracing(() => {
      tracedObject.value.objects.a = 2;
      tracedObject.value.arrays[0] = 2;
      tracedArray.value[0].a = 'new a';
      tracedArray.value[1][0] = 2;

      tracedObject.value.objects.c = 3;
      tracedObject.value.arrays[3] = 4;
      tracedArray.value[0].c = 'new c';
      tracedArray.value[1][3] = 4;

      delete tracedObject.value.objects.b;
      tracedObject.value.arrays.pop();
      delete (tracedArray.value[0] as any).b;
      (tracedArray.value[1] as Array<any>).pop();
    });

    expect(tracedObject.trace.length).toBe(0);
    expect(tracedArray.trace.length).toBe(0);
    expect(tracedObject.trace).toEqual([]);
    expect(tracedArray.trace).toEqual([]);
  });

  test('should not affect the value change', () => {
    const tracedObject = traceFabric({ objects: { a: 1, b: 2 } as any, arrays: [1, 2, 3] });
    const tracedArray = traceFabric([{ a: 1, b: 2 }, [1, 2, 3]] as any);

    withoutTracing(() => {
      tracedObject.value.objects.a = 2;
      tracedObject.value.arrays[0] = 2;
      (tracedArray.value[0] as any).a = 'new a';
      tracedArray.value[1][0] = 2;

      tracedObject.value.objects.c = 3;
      tracedObject.value.arrays[3] = 4;
      (tracedArray.value[0] as any).c = 'new c';
      tracedArray.value[1][3] = 4;

      delete tracedObject.value.objects.b;
      tracedObject.value.arrays.pop();
      delete (tracedArray.value[0] as any).b;
      (tracedArray.value[1] as Array<any>).pop();
    });

    expect(deepClone(tracedObject.value)).toEqual({ objects: { a: 2, c: 3 }, arrays: [2, 2, 3] });
    expect(deepClone(tracedArray.value)).toEqual([{ a: 'new a', c: 'new c' }, [2, 2, 3]] as any);
  });
});
