import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../../src/traceFabric';
import { deepClone } from '../../src/proxy/deepClone';

describe('tracedFabric reflects mutated', () => {
  test('string', () => {
    const tracing = traceFabric({ string: 'string' });

    tracing.value.string = 'new string';

    expect(tracing.value).toMatchObject({
      string: 'new string',
    });
  });

  test('number', () => {
    const tracing = traceFabric({ number: 1 });

    tracing.value.number = 2;

    expect(tracing.value).toMatchObject({
      number: 2,
    });
  });

  test('boolean', () => {
    const tracing = traceFabric({ boolean: (true as boolean) });

    tracing.value.boolean = false;

    expect(tracing.value).toMatchObject({
      boolean: false,
    });
  });

  test('null', () => {
    const tracing = traceFabric<{ null: null | number }>({ null: 1 });

    tracing.value.null = null;

    expect(tracing.value).toMatchObject({
      null: null,
    });
  });

  test('undefined', () => {
    const tracing = traceFabric<{ undefined: undefined | number }>({ undefined: 0 });

    tracing.value.undefined = undefined;

    expect(tracing.value).toMatchObject({
      undefined,
    });
  });

  test('array', () => {
    const tracing = traceFabric({ array: [1] });

    tracing.value.array.push(2);
    tracing.value.array.push(3);
    tracing.value.array.pop();

    expect(deepClone(tracing.value)).toMatchObject({
      array: [1, 2],
    });
  });

  test('object', () => {
    const tracing = traceFabric<any>({ object1: { key: 'value' }, object2: null });

    tracing.value.object1.key = 'new value';
    delete tracing.value.object2;

    expect(tracing.value).toMatchObject({
      object1: { key: 'new value' },
    });
  });
});
