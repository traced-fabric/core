let allowAssigning = true;

export function isAssigning(): boolean {
  return !!allowAssigning;
}

export function withoutAssigning<T>(callback: () => T): T {
  allowAssigning = false;
  const result = callback();
  allowAssigning = true;

  return result;
}
