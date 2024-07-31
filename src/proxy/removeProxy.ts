import { symbolTracedDataIndication } from '../utils/tracedDataSymbol';

export function removeProxy(value: any): any {
  if (value !== null && typeof value === 'object' && value[symbolTracedDataIndication]) {
    let copiedValue: any;

    if (Array.isArray(value)) copiedValue = [...value];
    else copiedValue = { ...value };

    if (copiedValue[symbolTracedDataIndication]) delete copiedValue[symbolTracedDataIndication];
    return copiedValue;
  }

  return value;
}
