import type { JSONArray, JSONObject, JSONValue } from '../types/json';
import type { TRequiredApplyProxyParams } from '../types/mutation';
import { getTracedProxyArray } from './getTracedArray';
import { getTracedProxyObject } from './getTracedObject';

export function getTracedProxyValue<T extends JSONValue>(data: TRequiredApplyProxyParams<T>): T {
  if (typeof data.value === 'object' && data.value !== null) {
    if (Array.isArray(data.value)) return getTracedProxyArray(data as TRequiredApplyProxyParams<JSONArray>) as T;

    return getTracedProxyObject(data as TRequiredApplyProxyParams<JSONObject>) as T;
  }

  return data.value;
}
