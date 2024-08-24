// For tracedFabric structuredClone can't be used,
// because it breaks when trying to copy traced values and general slowness.

/**
 * Deep clone an object or array.
 * Primarily used to clone traceFabric values without inheriting proxy metadata,
 * and potentially breaking tracedFabric.
 *
 * @note The deepClone will not copy symbols
 *
 * @param value - The value to clone
 * @returns The cloned value
 *
 * @example
 * const fabric = traceFabric({ season: 'winter', bestDays: [2, 7, 16] });
 * const clone = deepClone(fabric.value);
 *
 * console.log(clone); // { season: 'winter', bestDays: [2, 7, 16] }
 * console.log(clone === fabric.value); // false
 * console.log(clone.bestDays === fabric.value.bestDays); // false
 *
 * @since 0.0.1
 */
export function deepClone<T>(value: T): T {
  if (typeof value !== 'object') return value;
  if (!value) return value;

  const newValue = (Array.isArray(value) ? [] : {}) as T;

  for (const i in value) {
    newValue[i] = !value[i] || typeof value[i] !== 'object' ? value[i] : deepClone(value[i]);
  }

  return newValue as T;
}
