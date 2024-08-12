import type { JSONArray, JSONObject, JSONValue } from '../types/json';
import type { TRequiredApplyProxyParams } from '../types/mutation';
import { getTracedProxyArray } from './getTracedArray';
import { getTracedProxyObject } from './getTracedObject';

export function getTracedProxyValue<T extends JSONValue>(data: TRequiredApplyProxyParams<T>): T {
  if (typeof data.value === 'object' && data.value !== null) {
    const proxyValue = Array.isArray(data.value)
      ? getTracedProxyArray(data as TRequiredApplyProxyParams<JSONArray>)
      : getTracedProxyObject(data as TRequiredApplyProxyParams<JSONObject>);

    return proxyValue as T;
  }

  return data.value;
}
