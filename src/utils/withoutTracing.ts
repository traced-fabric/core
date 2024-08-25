let allowTracing = true;

/**
 * Checks if tracing is enabled.
 * If the tracing is enabled, the mutations are recorded in the traceLogs.
 *
 * @returns true if tracing is enabled, false otherwise
 *
 * @since 0.2.0
 */
export function isTracing(): boolean {
  return !!allowTracing;
}

/**
 * Ignores all mutations recording to traceLogs in the given function.
 * The function should not be async, as it turns off the tracing globally.
 *
 * @warn use with caution, as it can lead to breaking applyTrace function, because of the missing mutations.
 *
 * @param callback - function in which tracing is disabled
 * @returns result of the callback
 *
 * @example
 * const fabric = traceFabric({ season: 'winter' });
 * fabric.value.season = 'spring'; // adds mutation to the traceLogs
 *
 * withoutTracing(() => {
 *   fabric.value.season = 'summer'; // no mutation is added to the traceLogs
 * });
 *
 * console.log(fabric.getTrace());
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
