import { tracedValuesMetadata } from '../core/metadata';
import { tracedLogs } from '../core/references';

/**
 * Check if the given value is a `traced root value` of a `traceFabric` function.
 * Will return true only for the root traced values.
 *
 * To check if the value is `traced value` (not the root), use `isTracedValue` function.
 *
 * To check if the value is traced at any level, use `isTraced` function.
 *
 * @example
 * const traced = traceFabric({ // --> traced root value AND traced
 *   innerArray: [1, 2, 3], // --> traced value AND traced
 * });
 *
 * isTracedRootValue(traced.value); // true
 * isTracedRootValue(traced.value.innerArray); // false
 *
 * @since 0.2.0
 */
export function isTracedRootValue(value: any): boolean {
  return tracedLogs.has(value);
}

/**
 * Check if the given value is a `traced value` of a `traceFabric` function.
 * Will return true if the value is traced, but not at the root level.
 *
 * To check if the value is `traced root value`, use `isTracedRootValue` function.
 *
 * To check if the value is traced at any level, use `isTraced` function.
 *
 * @example
 * const traced = traceFabric({ // --> traced root value AND traced
 *   innerArray: [1, 2, 3], // --> traced value AND traced
 * });
 *
 * isTracedValue(traced.value); // false
 * isTracedValue(traced.value.innerArray); // true
 *
 * @since 0.2.0
 */
export function isTracedValue(value: any): boolean {
  return tracedValuesMetadata.has(value);
}

/**
 * Check if the given value is a `traced` of a `traceFabric` function.
 *
 * To check if the value is `traced root value`, use `isTracedRootValue` function.
 *
 * To check if the value is `traced value`, use `isTracedValue` function.
 *
 * @example
 * const traced = traceFabric({ // --> traced root value AND traced
 *   innerArray: [1, 2, 3], // --> traced value AND traced
 * });
 *
 * isTraced(traced.value); // true
 * isTraced(traced.value.innerArray); // true
 *
 * @since 0.2.0
 */
export function isTraced(value: any): boolean {
  return isTracedValue(value) || isTracedRootValue(value);
}
