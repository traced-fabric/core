import type { TCaughtReference, TTraceChange, TTracedValueId } from '../types/mutation';

let id: TTracedValueId = 0;
export const getTracedValueId = (): number => id++;

export const tracedValues = new WeakSet<object>([]);
export const tracedLogs = new WeakMap<object, TTraceChange[]>();

export const tracedSubscribers = new WeakMap<
  object,
  Record<
    TTracedValueId, // id of the subscribed tracedValue
    Record<
      string,
      TCaughtReference
    >
  >
>();
