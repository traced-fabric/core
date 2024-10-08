import type { JSONObject } from '../types/json';

/**
 * Check if the value is a typeof `object` and not `null`.
 *
 * @param value - value that needs to be checked.
 * @returns `boolean`
 *
 * @example
 * ```typescript
 * console.log(isStructure({ hello: 'world' })); // true
 * console.log(isStructure(['hello', 'world'])); // true
 *
 * console.log(isStructure(1)); // false
 * console.log(isStructure(true)); // false
 * console.log(isStructure('hello')); // false
 * console.log(isStructure(null)); // false
 * console.log(isStructure(undefined)); // false
 * console.log(isStructure(true)); // false
 * ```
 *
 * @see {@link https://traced-fabric.github.io/core/is-value-a-structure/isStructure.html Wiki page.}
 *
 * @since 0.2.0
 */
export function isStructure<T>(
  value: T,
): value is T extends JSONObject ? T : T & JSONObject {
  return typeof value === 'object' && value !== null;
}
