export function isStructure<T>(value: T): boolean {
  return typeof value === 'object' && value !== null;
}
