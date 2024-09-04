let allowTracing = true;

/**
 * Check if `tracing` is enabled. If the tracing is enabled, the `mutations` are recorded in the trace.
 *
 * @returns true if `tracing` is enabled, false otherwise
 *
 * @example
 * ```typescript
 * console.log(isTracing()); // true
 *
 * withoutTracing(() => {
 *   console.log(isTracing()); // false
 * });
 * ```
 *
 * @see {@link https://github.com/traced-fabric/core/wiki/%F0%9F%A7%B0-Essentials-%7C-Package-exports#-istracing Wiki page.}
 *
 * @since 0.2.0
 */
export function isTracing(): boolean {
  return !!allowTracing;
}

/**
 * Ignores recording of all `mutations` to `trace` in the given function.
 * The function should not be async, as it turns off the tracing globally.
 *
 * @warn Use with caution, as it can lead to breaking `applyTrace` function, because of the missing mutations.
 *
 * @param callback - function in which `tracing` is disabled
 * @returns same as the return value of the given function
 *
 * @example
 * const fabric = traceFabric({ season: 'winter' });
 * fabric.value.season = 'spring'; // adds mutation to the traceLogs
 *
 * withoutTracing(() => {
 *   fabric.value.season = 'summer'; // no mutation is added to the traceLogs
 * });
 *
 * console.log(fabric.trace);
 * // [{
 * //   mutated: "object",
 * //   targetChain: [ "season" ],
 * //   value: "spring",
 * //   type: "set",
 * // }]
 *
 * @since 0.2.0
 */
export function withoutTracing<T>(callback: () => T): T {
  allowTracing = false;
  const result = callback();
  allowTracing = true;

  return result;
}
