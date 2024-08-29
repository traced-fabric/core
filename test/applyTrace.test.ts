import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../src/traceFabric';
import { applyTrace } from '../src/applyTrace';
import { deepClone } from '../src/deepClone';

describe('applyTrace result matches tracedFabric on changed', () => {
  test('string', () => {
    const tracing = traceFabric({ string: 'string' });
    const cloned = deepClone(tracing.value);

    tracing.value.string = 'new string';
    applyTrace(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toEqual(cloned);
  });

  test('number', () => {
    const tracing = traceFabric({ number: 1 });
    const cloned = deepClone(tracing.value);

    tracing.value.number = 2;
    applyTrace(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toEqual(cloned);
  });

  test('boolean', () => {
    const tracing = traceFabric({ boolean: (true as boolean) });
    const cloned = deepClone(tracing.value);

    tracing.value.boolean = false;
    applyTrace(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toEqual(cloned);
  });

  test('null', () => {
    const tracing = traceFabric<{ null: null | number }>({ null: 1 });
    const cloned = deepClone(tracing.value);

    tracing.value.null = null;
    applyTrace(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toEqual(cloned);
  });

  test('undefined', () => {
    const tracing = traceFabric({ undefined: 0 as number | undefined });
    const cloned = deepClone(tracing.value);

    tracing.value.undefined = undefined;
    applyTrace(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toEqual(cloned);
  });

  test('array', () => {
    const tracing = traceFabric({ array: [1] });
    const cloned = deepClone(tracing.value);

    tracing.value.array.push(2);
    tracing.value.array.push(3);
    tracing.value.array.pop();
    applyTrace(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toEqual(cloned);
  });

  test('object', () => {
    const tracing = traceFabric({ object1: { key: 'value' }, object2: null as any });
    const cloned = deepClone(tracing.value);

    tracing.value.object1.key = 'new value';
    delete tracing.value.object2;
    applyTrace(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toEqual(cloned);
  });
});

describe('applyTrace result matches tracedFabric on deleted tracedFabric', () => {
  test('array', () => {
    const tracingChild = traceFabric({ array: [1, 2] });
    const tracingParent = traceFabric({ array: [tracingChild.value] });
    const cloned = deepClone(tracingParent.value);

    tracingChild.value.array.pop();
    tracingParent.value.array.pop();
    applyTrace(cloned, tracingParent.getTrace());

    expect(deepClone(tracingParent.value)).toEqual(cloned);
  });

  test('object', () => {
    const tracingChild = traceFabric({ key: 'value' as any });
    const tracingParent = traceFabric({ object: { key: tracingChild.value as any } });
    const cloned = deepClone(tracingParent.value);

    delete tracingChild.value.key;
    delete tracingParent.value.object.key;
    applyTrace(cloned, tracingParent.getTrace());

    expect(deepClone(tracingParent.value)).toEqual(cloned);
  });
});

describe('applyTrace result matches tracedFabric on added tracedFabric', () => {
  test('array', () => {
    const tracingChild = traceFabric({ array: [1] });
    const tracingParent = traceFabric({ array: [] as any });
    const cloned = deepClone(tracingParent.value);

    tracingChild.value.array.push(2);
    tracingParent.value.array.push(tracingChild.value);
    tracingChild.value.array.push(3);
    applyTrace(cloned, tracingParent.getTrace());

    expect(deepClone(tracingParent.value)).toEqual(cloned);
  });

  test('object', () => {
    const tracingChild = traceFabric({ key: 'value 1' } as any);
    const tracingParent = traceFabric({ object: {} as any });
    const cloned = deepClone(tracingParent.value);

    tracingChild.value.key = 'new value 1';
    tracingParent.value.object.key = tracingChild.value;
    tracingChild.value.key2 = 'value 2';
    applyTrace(cloned, tracingParent.getTrace());

    expect(deepClone(tracingParent.value)).toEqual(cloned);
  });
});
