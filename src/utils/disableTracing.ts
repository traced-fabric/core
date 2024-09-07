import type { JSONStructure } from '../types/json';

const disabledTracingSymbol = Symbol('disabledTracing');

export type TDisabledTracingJSON<
  T extends JSONStructure = JSONStructure,
> = T & { [disabledTracingSymbol]: true };

export function isTracingEnabled<T extends JSONStructure>(
  value: T,
): value is T extends TDisabledTracingJSON ? TDisabledTracingJSON<T> : T {
  return !(disabledTracingSymbol in value);
}

export function disableTracing<T extends JSONStructure>(value: T): TDisabledTracingJSON<T> {
  (value as any)[disabledTracingSymbol] = true;
  return value as ReturnType<typeof disableTracing<T>>;
}

export function enableTracing<T extends JSONStructure>(value: T): T {
  delete (value as any)[disabledTracingSymbol];
  return value as ReturnType<typeof enableTracing<T>>;
}
