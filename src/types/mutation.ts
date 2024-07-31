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
  mutatedType: EMutated.object;
  targetChain?: TTarget[];
} & ({
  mutationType: EObjectMutation.set;
  key: string;
  value: JSONValue;
} | {
  mutationType: EObjectMutation.delete;
  key: string;
});

export type TArrayMutation = {
  mutatedType: EMutated.array;
  targetChain?: TTarget[];
} & ({
  mutationType: EArrayMutation.set;
  key: number;
  value: JSONValue;
} | {
  mutationType: EArrayMutation.delete;
  key: number;
} | {
  mutationType: EArrayMutation.reverse;
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
