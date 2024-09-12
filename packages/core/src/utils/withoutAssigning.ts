let allowAssigning = true;

/**
 * Check if `assigning` is enabled. If the assigning is enabled, the `traced` object assignment works as usual.
 * If the assigning is disabled, the `traced` object assignment does not work.
 *
 * @returns true if `assigning` is enabled, false otherwise
 *
 * @example
 * ```typescript
 * console.log(isAssigning()); // true
 *
 * withoutAssigning(() => {
 *   console.log(isAssigning()); // false
 * });
 * ```
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-isassigning Wiki page.}
 *
 * @since 0.12.0
 */
export function isAssigning(): boolean {
  return !!allowAssigning;
}

/**
 * Ignores any modification to a `traced` structure in the given function (deleting, adding, or changing the values).
 * The function should not be async, as it turns off the `assigning` globally.
 *
 * @warn Use with caution, as it can lead to breaking `applyTrace` function, because `traced` items inside of the function will not recorded any modification.
 *
 * @param callback - function in which `assigning` is disabled
 * @returns same as the return value of the given function
 *
 * @example
 * ```typescript
 * const fabric = traceFabric({ season: 'winter' });
 * fabric.value.season = 'spring'; // assignment is recorded
 *
 * withoutAssigning(() => {
 *   fabric.value.season = 'summer'; // assignment is NOT recorded
 * });
 *
 * console.log(fabric.value);
 * // { season: 'spring' }
 * ```
 *
 * @since 0.12.0
 */
export function withoutAssigning<T>(callback: () => T): T {
  allowAssigning = false;
  const result = callback();
  allowAssigning = true;

  return result;
}
