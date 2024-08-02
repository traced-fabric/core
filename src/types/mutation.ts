import type { JSONValue } from './json';

export type TTracedValueId = number;

export enum EObjectMutation {
  set = 'set',
  delete = 'delete',
}

export enum EArrayMutation {
  set = 'set',
  delete = 'delete',
  reverse = 'reverse',
}

export enum EMutated {
  object = 'object',
  array = 'array',
}

export type TTarget = string | number;

export type TObjectMutation = {
  mutated: EMutated.object;
  targetChain: TTarget[];
} & ({
  type: EObjectMutation.set;
  value: JSONValue;
} | {
  type: EObjectMutation.delete;
});

export type TArrayMutation = {
  mutated: EMutated.array;
  targetChain: TTarget[];
} & ({
  type: EArrayMutation.set;
  value: JSONValue;
} | {
  type: EArrayMutation.delete;
} | {
  type: EArrayMutation.reverse;
});

export type TMutationCallback = (mutation: TObjectMutation | TArrayMutation) => void;

export type TTraceChange = TObjectMutation | TArrayMutation;

export type TCaughtReference = {
  subscriber: object;
  targetChain: TTarget[];
};
export type TOnCaughtReference = (caughtReference: TCaughtReference) => void;
export type TRequiredApplyProxyParams<T extends JSONValue> = {
  originId: TTracedValueId;
  value: T;
  mutationCallback: TMutationCallback;
  onCaughtTrace: TOnCaughtReference;
  targetChain: TTarget[];
};
