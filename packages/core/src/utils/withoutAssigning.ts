let allowAssigning = true;

export function isTracing(): boolean {
  return !!allowAssigning;
}

export function withoutAssigning<T>(callback: () => T): T {
  allowAssigning = false;
  const result = callback();
  allowAssigning = true;

  return result;
}
