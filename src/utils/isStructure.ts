import type { JSONObject } from '../types/json';

/**
 * Check if the value is a `typeof 'object'` and not `null`.
 *
 * @param value - value to check
 * @returns true if the value is a structure, false otherwise
 *
 * @since 0.2.0
 */
export function isStructure<T>(
  value: T,
): value is T extends JSONObject ? T : T & JSONObject {
  return typeof value === 'object' && value !== null;
}
