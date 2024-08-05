import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../src/traceFabric';
import { applyMutations } from '../src/applyMutations';
import { deepClone } from '../src/proxy/deepClone';

describe('applyMutation result matches tracedFabric on changed', () => {
  test('string', () => {
    const tracing = traceFabric({ string: 'string' });
    const cloned = deepClone(tracing.value);

    tracing.value.string = 'new string';
    applyMutations(cloned, tracing.getTrace());

    expect(tracing.value).toMatchObject(cloned);
  });

  test('number', () => {
    const tracing = traceFabric({ number: 1 });
    const cloned = deepClone(tracing.value);

    tracing.value.number = 2;
    applyMutations(cloned, tracing.getTrace());

    expect(tracing.value).toMatchObject(cloned);
  });

  test('boolean', () => {
    const tracing = traceFabric({ boolean: (true as boolean) });
    const cloned = deepClone(tracing.value);

    tracing.value.boolean = false;
    applyMutations(cloned, tracing.getTrace());

    expect(tracing.value).toMatchObject(cloned);
  });

  test('null', () => {
    const tracing = traceFabric<{ null: null | number }>({ null: 1 });
    const cloned = deepClone(tracing.value);

    tracing.value.null = null;
    applyMutations(cloned, tracing.getTrace());

    expect(tracing.value).toMatchObject(cloned);
  });

  test('undefined', () => {
    const tracing = traceFabric<{ undefined: undefined | number }>({ undefined: 0 });
    const cloned = deepClone(tracing.value);

    tracing.value.undefined = undefined;
    applyMutations(cloned, tracing.getTrace());

    expect(tracing.value).toMatchObject(cloned);
  });

  test('array', () => {
    const tracing = traceFabric({ array: [1] });
    const cloned = deepClone(tracing.value);

    tracing.value.array.push(2);
    tracing.value.array.push(3);
    tracing.value.array.pop();
    applyMutations(cloned, tracing.getTrace());

    expect(deepClone(tracing.value)).toMatchObject(cloned);
  });

  test('object', () => {
    const tracing = traceFabric({ object1: { key: 'value' }, object2: null });
    const cloned = deepClone(tracing.value);

    tracing.value.object1.key = 'new value';
    delete tracing.value.object2;
    applyMutations(cloned, tracing.getTrace());

    expect(tracing.value).toMatchObject(cloned);
  });
});

describe('applyMutation result matches tracedFabric on deleted tracedFabric', () => {
  test('array', () => {
    const tracingChild = traceFabric({ array: [1, 2] });
    const tracingParent = traceFabric({ array: [tracingChild.value] });
    const cloned = deepClone(tracingParent.value);

    tracingChild.value.array.pop();
    tracingParent.value.array.pop();
    applyMutations(cloned, tracingParent.getTrace());

    expect(deepClone(tracingParent.value)).toMatchObject(cloned);
  });

  test('object', () => {
    const tracingChild = traceFabric({ key: 'value' });
    const tracingParent = traceFabric({ object: { key: tracingChild.value } });
    const cloned = deepClone(tracingParent.value);

    delete tracingChild.value.key;
    delete tracingParent.value.object.key;
    applyMutations(cloned, tracingParent.getTrace());

    expect(tracingParent.value).toMatchObject(cloned);
  });
});

describe('applyMutation result matches tracedFabric on added tracedFabric', () => {
  test('array', () => {
    const tracingChild = traceFabric({ array: [1] });
    const tracingParent = traceFabric({ array: [] });
    const cloned = deepClone(tracingParent.value);

    tracingChild.value.array.push(2);
    tracingParent.value.array.push(tracingChild.value);
    tracingChild.value.array.push(3);
    applyMutations(cloned, tracingParent.getTrace());

    expect(deepClone(tracingParent.value)).toMatchObject(cloned);
  });

  test('object', () => {
    const tracingChild = traceFabric<Record<string, string>>({ key: 'value 1' });
    const tracingParent = traceFabric<Record<string, any>>({ object: {} });
    const cloned = deepClone(tracingParent.value);

    tracingChild.value.key = 'new value 1';
    tracingParent.value.object.key = tracingChild.value;
    tracingChild.value.key2 = 'value 2';
    applyMutations(cloned, tracingParent.getTrace());

    expect(tracingParent.value).toMatchObject(cloned);
  });
});
