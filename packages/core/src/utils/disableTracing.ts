import type { JSONStructure } from '../types/json';

const disabledTracingSymbol = Symbol('disabledTracing');

/**
 * Check if the given value has `tracing` disabled.
 *
 * @param value - the value to check.
 * @returns `true` if the value is disabled for tracing, `false` otherwise.
 *
 * @example
 * ```typescript
 * const fabric = traceFabric({
 *   tracedArray: [1, 2, 3],
 *   untracedArray: disableTracing([4, 5, 6]),
 * });
 *
 * console.log(isTracingEnabled(fabric.value.tracedArray)); // true;
 * console.log(isTracingEnabled(fabric.value.untracedArray)); // false;
 * ```
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-itracingenabled Wiki page.}
 *
 * @since 0.10.0
 */
export function isTracingEnabled<T extends JSONStructure>(value: T): boolean {
  return !(disabledTracingSymbol in value);
}

/**
 * Disable `tracing` for the given value.
 *
 * Primarily used for static values that should not be traced or modified,
 * also to reduce memory usage and improve performance.
 * The value will be modifiable, but the `mutations` will not be recorded.
 *
 * @param value - the value to disable tracing.
 * @returns same as the given **value** with tracing disabled.
 *
 * @example
 * ```typescript
 * const fabric = traceFabric({
 *   tracedArray: [1, 2, 3],
 *   untracedArray: disableTracing([4, 5, 6]),
 * });
 *
 * console.log(isTracingEnabled(fabric.value.tracedArray)); // true;
 * console.log(isTracingEnabled(fabric.value.untracedArray)); // false;
 * ```
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-disabletracing Wiki page.}
 *
 * @since 0.10.0
 */
export function disableTracing<T extends JSONStructure>(value: T): T {
  (value as any)[disabledTracingSymbol] = true;
  return value as ReturnType<typeof disableTracing<T>>;
}

/**
 * Enable `tracing` for the given value.
 *
 * [!NOTE] This function will not enable `mutations` recording for the value that is
 * already part of the `tracedFabric`, because it was not processed to be a `tracedValue`.
 * To do so, please use this method:
 * ```typescript
 * withoutTracing(() => {
 *   fabric.value.untracedArray = enableTracing(fabric.value.untracedArray));
 * });
 * ```
 *
 * @param value - the value to enable tracing.
 * @returns same as the given **value** with tracing enabled.
 *
 * @example
 * ```typescript
 * const fabric = traceFabric({
 *   tracedArray: [1, 2, 3],
 *   untracedArray: disableTracing([4, 5, 6]),
 * });
 *
 * console.log(isTracingEnabled(fabric.value.tracedArray)); // true;
 * console.log(isTracingEnabled(fabric.value.untracedArray)); // false;
 *
 * withoutTracing(() => {
 *   fabric.value.untracedArray = enableTracing(fabric.value.untracedArray));
 * });
 *
 * console.log(isTracingEnabled(fabric.value.untracedArray)); // true;
 * ```
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-enableTracing Wiki page.}
 *
 * @since 0.10.0
 */
export function enableTracing<T extends JSONStructure>(value: T): T {
  delete (value as any)[disabledTracingSymbol];
  return value as ReturnType<typeof enableTracing<T>>;
}
