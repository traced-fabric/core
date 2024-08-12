import type { JSONArray, JSONStructure } from '../types/json';
import type { TRequiredApplyProxyParams } from '../types/mutation';

export type TTracedValueMetadata = Pick<
  TRequiredApplyProxyParams<JSONArray>,
  'targetChain'
>;

export const tracedValuesMetadata = new WeakMap<JSONStructure, TTracedValueMetadata>();
