/**
 * Deep clone an object or array
 * For tracedFabric structuredClone can't be used, because it breaks when trying to copy traced values and general slowness
 *
 * @note The deepClone will not copy symbols
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
