let allowTracing = true;

export function isTracing(): boolean {
  return allowTracing;
}

export function withoutTracing<T>(callback: () => T): T {
  allowTracing = false;
  const result = callback();
  allowTracing = true;

  return result;
}
