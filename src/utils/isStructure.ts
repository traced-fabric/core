/**
 * Check if the value is a `typeof 'object'` and not `null`.
 *
 * @param value - value to check
 * @returns true if the value is a structure, false otherwise
 *
 * @since 0.2.0
 */
export function isStructure<T>(value: T): boolean {
  return typeof value === 'object' && value !== null;
}
