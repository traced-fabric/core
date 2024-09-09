import { describe, expect, test } from 'bun:test';
import * as TF from '../index';

const expectType = <T>(_?: T) => ({});

describe('index file should export', () => {
  test('removeTraceSubscription', () => expect(TF.removeTraceSubscription).toBeDefined());

  test('types json', () => {
    expectType<TF.JSONPrimitive>();
    expectType<TF.JSONObject>();
    expectType<TF.JSONArray>();
    expectType<TF.JSONStructure>();
    expectType<TF.JSONValue>();
  });

  test('types mutation', () => {
    expect(TF.EObjectMutation).toBeDefined();
    expect(TF.EArrayMutation).toBeDefined();
    expect(TF.EMutated).toBeDefined();
    expectType<TF.TTarget>();
    expectType<TF.TObjectMutation>();
    expectType<TF.TArrayMutation>();
    expectType<TF.TMutation>();
    expectType<TF.TMutationCallback>();
  });

  test('types tracedFabric', () => {
    expectType<TF.TOnMutation>();
    expectType<TF.TTracedFabric<any>>();
  });

  test('isTracingEnabled', () => expect(TF.isTracingEnabled).toBeDefined());
  test('disableTracing', () => expect(TF.disableTracing).toBeDefined());
  test('enableTracing', () => expect(TF.enableTracing).toBeDefined());

  test('isStructure', () => expect(TF.isStructure).toBeDefined());

  test('isTracedFabric', () => expect(TF.isTracedFabric).toBeDefined());
  test('isTracedValue', () => expect(TF.isTracedValue).toBeDefined());
  test('isTraced', () => expect(TF.isTraced).toBeDefined());

  test('iterableWeakMap', () => expect(TF.IterableWeakMap).toBeDefined());

  test('isTracing', () => expect(TF.isTracing).toBeDefined());
  test('withoutTracing', () => expect(TF.withoutTracing).toBeDefined());

  test('applyTrace', () => expect(TF.applyTrace).toBeDefined());
  test('deepClone', () => expect(TF.deepClone).toBeDefined());
  test('traceFabric', () => expect(TF.traceFabric).toBeDefined());
});
