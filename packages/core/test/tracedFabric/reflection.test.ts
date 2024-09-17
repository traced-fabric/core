import { describe, expect, test } from 'bun:test';
import { deepClone } from '../../src/deepClone';
import { traceFabric } from '../../src/traceFabric';

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
      object1: { keys: { a: 'value' } },
      object2: null,
    });

    tracing.value.object1.keys.a = 'new value';
    delete tracing.value.object2;

    expect(deepClone(tracing.value)).toEqual({
      object1: { keys: { a: 'new value' } },
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

describe('tracedFabric reflects recursively nested mutated tracedFabric', () => {
  test('object', () => {
    const tracingChild1 = traceFabric<{ key: string; key2?: string }>({ key: 'value', key2: 'value2' });
    const tracingChild2 = traceFabric({ tracingChild1: tracingChild1.value });
    const tracing = traceFabric({ object: tracingChild2.value });

    tracingChild1.value.key = 'new value';
    delete tracing.value.object.tracingChild1.key2;

    expect(deepClone(tracing.value)).toEqual({
      object: { tracingChild1: { key: 'new value' } },
    });
  });

  test('array', () => {
    const tracingChild1 = traceFabric([1, 2]);
    const tracingChild2 = traceFabric([tracingChild1.value]);
    const tracing = traceFabric([tracingChild2.value]);

    tracingChild1.value.push(3);
    tracingChild1.value.pop();

    expect(deepClone(tracing.value)).toEqual([[[1, 2]]]);
  });
});

describe('tracedFabric reflects added tracedFabric', () => {
  test('object', () => {
    const tracingChild = traceFabric<{ key: string; key2?: null }>({ key: 'value', key2: null });
    const tracing = traceFabric({ object: {} as any });

    tracing.value.object.key = tracingChild.value;
    delete tracingChild.value.key2;

    expect(deepClone(tracing.value)).toEqual({
      object: { key: { key: 'value' } },
    });
  });

  test('array', () => {
    const tracingChild = traceFabric([1]);
    const tracing = traceFabric<{ array: null | typeof tracingChild.value }>({ array: null });

    tracing.value.array = tracingChild.value;
    tracingChild.value.push(2, 3);
    tracingChild.value.pop();

    expect(deepClone(tracing.value)).toEqual({
      array: [1, 2],
    });
  });
});

describe('tracedFabric reflects recursively nested added tracedFabric', () => {
  test('object', () => {
    const tracingChild1 = traceFabric({ key: 'value' });
    const tracingChild2 = traceFabric({ tracingChild1: null as null | typeof tracingChild1['value'] });
    const tracing = traceFabric({ object: {} as any });

    tracing.value.object.tracingChild1 = tracingChild1.value;
    tracingChild2.value.tracingChild1 = tracingChild1.value;
    tracingChild1.value.key = 'new value';

    expect(deepClone(tracing.value)).toEqual({
      object: { tracingChild1: { key: 'new value' } },
    });
  });

  test('array', () => {
    const tracingChild1 = traceFabric([1]);
    const tracingChild2 = traceFabric<any[]>([]);
    const tracing = traceFabric<any[]>([]);

    tracing.value.push(tracingChild2.value);
    tracingChild2.value.push(tracingChild1.value);
    tracingChild1.value.push(2, 3);

    expect(deepClone(tracing.value)).toEqual([[[1, 2, 3]]]);
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

describe('tracedFabric reflects recursively nested deleted tracedFabric', () => {
  test('object', () => {
    const tracingChild1 = traceFabric({ key: 'value' });
    const tracingChild2 = traceFabric({ tracingChild1: tracingChild1.value });
    const tracing = traceFabric<{ object?: typeof tracingChild2['value'] }>({ object: tracingChild2.value });

    delete tracing.value.object;
    tracingChild1.value.key = 'new value';

    expect(deepClone(tracing.value)).toEqual({});
  });

  test('array', () => {
    const tracingChild1 = traceFabric([1]);
    const tracingChild2 = traceFabric([tracingChild1.value]);
    const tracing = traceFabric([tracingChild2.value]);

    tracing.value.pop();
    tracingChild1.value.push(2, 3);

    expect(deepClone(tracing.value)).toEqual([]);
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
