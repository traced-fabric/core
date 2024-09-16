import { tracedValuesMetadata } from '../core/metadata';
import { tracedFabricsTrace } from '../core/traces';

/**
 * Checks if the given value is a `tracedFabric`.
 *
 * @example
 * ```typescript
 * const traced = traceFabric({ // --> tracedFabric value AND traced
 *   innerArray: [1, 2, 3], // --> tracedValue AND traced
 * });
 *
 * isTracedFabric(traced.value); // true
 * isTracedFabric(traced.value.innerArray); // false
 * ```
 *
 * @see {@link https://traced-fabric.github.io/core/check-if-value-traced/isTracedFabric.html Wiki page.}
 *
 * @since 0.2.0
 */
export function isTracedFabric(value: any): boolean {
  return tracedFabricsTrace.has(value);
}

/**
 * Checks if the given value is a `tracedValue`.
 *
 * @example
 * ```typescript
 * const traced = traceFabric({ // --> tracedFabric value AND traced
 *   innerArray: [1, 2, 3], // --> tracedValue AND traced
 * });
 *
 * isTracedValue(traced.value); // false
 * isTracedValue(traced.value.innerArray); // true
 * ```
 *
 * @see {@link https://traced-fabric.github.io/core/check-if-value-traced/isTracedValue.html Wiki page.}
 *
 * @since 0.2.0
 */
export function isTracedValue(value: any): boolean {
  return tracedValuesMetadata.has(value);
}

/**
 * Checks if the given value is a `traced`.
 *
 * @example
 * ```typescript
 * const traced = traceFabric({ // --> tracedFabric value AND traced
 *   innerArray: [1, 2, 3], // --> tracedValue AND traced
 * });
 *
 * isTraced(traced.value); // true
 * isTraced(traced.value.innerArray); // true
 * ```
 *
 * @see {@link https://traced-fabric.github.io/core/check-if-value-traced/isTraced.html Wiki page.}
 *
 * @since 0.2.0
 */
export function isTraced(value: any): boolean {
  return isTracedValue(value) || isTracedFabric(value);
}
