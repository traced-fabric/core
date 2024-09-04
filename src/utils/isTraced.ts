import { tracedValuesMetadata } from '../core/metadata';
import { tracedFabricsTrace } from '../core/traces';

/**
 * Checks if the given value is a `tracedFabric`.
 *
 * To check the definition of `tracedFabric`, see [Wiki - 📜 Naming](https://github.com/traced-fabric/core/wiki/%F0%9F%93%9C-Naming)
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
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-istracedfabric Wiki page.}
 *
 * @since 0.2.0
 */
export function isTracedFabric(value: any): boolean {
  return tracedFabricsTrace.has(value);
}

/**
 * Checks if the given value is a `tracedValue`.
 *
 * To check the definition of `tracedValue`, see [Wiki - 📜 Naming](https://github.com/traced-fabric/core/wiki/%F0%9F%93%9C-Naming)
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
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-istracedvalue Wiki page.}
 *
 * @since 0.2.0
 */
export function isTracedValue(value: any): boolean {
  return tracedValuesMetadata.has(value);
}

/**
 * Checks if the given value is a `traced`.
 *
 * To check the definition of `traced`, see [Wiki - 📜 Naming](https://github.com/traced-fabric/core/wiki/%F0%9F%93%9C-Naming)
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
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-istraced Wiki page.}
 *
 * @since 0.2.0
 */
export function isTraced(value: any): boolean {
  return isTracedValue(value) || isTracedFabric(value);
}
