import { isStructure } from './utils/isStructure';

// For tracedFabric structuredClone can't be used,
// because it breaks when trying to copy traced values and general slowness.

/**
 * Deep clone an object or array.
 *
 * Primarily used to clone `tracedFabric` and `tracedValues` without inheriting proxy traps,
 * and potentially breaking tracedFabric.
 *
 * @note `deepClone(...)` will not copy symbols
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-deepclone Wiki page.}
 *
 * @param value - The value to clone
 * @returns The cloned value
 *
 * @example
 * ```typescript
 * const fabric = traceFabric({ season: 'winter', bestDays: [2, 7, 16] });
 * const clone = deepClone(fabric.value);
 *
 * console.log(clone); // { season: 'winter', bestDays: [2, 7, 16] }
 * console.log(clone === fabric.value); // false
 * console.log(clone.bestDays === fabric.value.bestDays); // false
 * ```
 *
 * @since 0.0.1
 */
export function deepClone<T>(value: T): T {
  if (!isStructure(value)) return value;

  const newValue = (Array.isArray(value) ? [] : {}) as typeof value;
  for (const i in value) newValue[i] = isStructure(value[i]) ? deepClone(value[i]) : value[i];

  return newValue;
}
