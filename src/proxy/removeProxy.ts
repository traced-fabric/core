import { symbolTracedDataIndication } from '../utils/tracedDataSymbol';

export function removeProxy(value: any): any {
  const copiedValue = structuredClone(value);

  if (
    value !== null && typeof value === 'object'
    && copiedValue[symbolTracedDataIndication]
  ) {
    delete copiedValue[symbolTracedDataIndication];
  }

  return value;
}
