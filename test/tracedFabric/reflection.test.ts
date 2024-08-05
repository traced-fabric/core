import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../../src/traceFabric';
import { deepClone } from '../../src/proxy/deepClone';

describe('tracedFabric reflects mutated', () => {
  test('string', () => {
    const tracing = traceFabric({ string: 'string' });

    tracing.value.string = 'new string';

    expect(deepClone(tracing.value)).toEqual({
      string: 'new string',
    });
  });

  test('number', () => {
    const tracing = traceFabric({ number: 1 });

    tracing.value.number = 2;

    expect(deepClone(tracing.value)).toEqual({
      number: 2,
    });
  });

  test('boolean', () => {
    const tracing = traceFabric({ boolean: (true as boolean) });

    tracing.value.boolean = false;

    expect(deepClone(tracing.value)).toEqual({
      boolean: false,
    });
  });

  test('null', () => {
    const tracing = traceFabric<{ null: null | number }>({ null: 1 });

    tracing.value.null = null;

    expect(deepClone(tracing.value)).toEqual({
      null: null,
    });
  });

  test('undefined', () => {
    const tracing = traceFabric<{ undefined: undefined | number }>({ undefined: 0 });

    tracing.value.undefined = undefined;

    expect(deepClone(tracing.value)).toEqual({
      undefined,
    });
  });

  test('array', () => {
    const tracing = traceFabric({ array: [1] });

    tracing.value.array.push(2);
    tracing.value.array.push(3);
    tracing.value.array.pop();

    expect(deepClone(tracing.value)).toEqual({
      array: [1, 2],
    });
  });

  test('object', () => {
    const tracing = traceFabric<{ object1: any; object2?: null }>({
      object1: { key: 'value' },
      object2: null,
    });

    tracing.value.object1.key = 'new value';
    delete tracing.value.object2;

    expect(deepClone(tracing.value)).toEqual({
      object1: { key: 'new value' },
    });
  });
});

describe('tracedFabric reflects mutated tracedFabric', () => {
  test('object', () => {
    const tracingChild = traceFabric<{ key: string; key2?: string }>({ key: 'value', key2: 'value2' });
    const tracing = traceFabric({ object: tracingChild.value });

    tracingChild.value.key = 'new value';
    delete tracingChild.value.key2;

    expect(deepClone(tracing.value)).toEqual({
      object: { key: 'new value' },
    });
  });

  test('array', () => {
    const tracingChild = traceFabric([1, 2]);
    const tracing = traceFabric({ array: tracingChild.value });

    tracingChild.value.push(3);
    tracingChild.value.pop();

    expect(deepClone(tracing.value)).toEqual({
      array: [1, 2],
    });
  });
});

describe('tracedFabric reflects added tracedFabric', () => {
  test('object', () => {
    const tracingChild = traceFabric<{ key: string; key2?: null }>({ key: 'value', key2: null });
    const tracing = traceFabric<Record<string, any>>({ object: {} });

    tracing.value.object.key = tracingChild.value;
    delete tracingChild.value.key2;

    expect(deepClone(tracing.value)).toEqual({
      object: { key: { key: 'value' } },
    });
  });

  test('array', () => {
    const tracingChild = traceFabric([1]);
    const tracing = traceFabric({ array: null });

    tracing.value.array = tracingChild.value;
    tracingChild.value.push(2, 3);
    tracingChild.value.pop();

    expect(deepClone(tracing.value)).toEqual({
      array: [1, 2],
    });
  });
});

describe('tracedFabric reflects deleted tracedFabric', () => {
  test('object', () => {
    const tracingChild = traceFabric<{ key: string }>({ key: 'value' });
    const tracing = traceFabric<{ object?: any }>({ object: tracingChild.value });

    delete tracing.value.object;
    tracingChild.value.key = 'new value';

    expect(deepClone(tracing.value)).toEqual({});
  });

  test('array', () => {
    const tracingChild = traceFabric([1]);
    const tracing = traceFabric<{ array?: any }>({ array: tracingChild.value });

    delete tracing.value.array;
    tracingChild.value.push(2, 3);

    expect(deepClone(tracing.value)).toEqual({});
  });
});

describe('tracedFabric array reflects', () => {
  test('reverse', () => {
    const tracing = traceFabric([1, 2, 3, 4, 5, [99, 98, 97, 96]]);

    tracing.value.reverse();
    (tracing.value[0] as Array<number>).reverse();

    expect(deepClone(tracing.value)).toEqual([[96, 97, 98, 99], 5, 4, 3, 2, 1]);
  });
});
