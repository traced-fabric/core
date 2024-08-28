import type { JSONValue } from './json';

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
  value?: never;
});

export type TArrayMutation = {
  mutated: EMutated.array;
  targetChain: TTarget[];
} & ({
  type: EArrayMutation.set;
  value: JSONValue;
} | {
  type: EArrayMutation.delete;
  value?: never;
} | {
  type: EArrayMutation.reverse;
  value?: never;
});

export type TTraceChange = TObjectMutation | TArrayMutation;

export type TMutationCallback = (mutation: TTraceChange) => void;
