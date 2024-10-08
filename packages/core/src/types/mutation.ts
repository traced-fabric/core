import type { JSONValue } from './json';

export enum EMutated {
  object = 'object',
  array = 'array',
}

export type TTarget = string | number;

export enum EObjectMutation {
  set = 'set',
  delete = 'delete',
}

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

export enum EArrayMutation {
  set = 'set',
  delete = 'delete',

  push = 'push',
  reverse = 'reverse',
  shift = 'shift',
  unshift = 'unshift',
}

export type TArrayMutation = {
  mutated: EMutated.array;
  targetChain: TTarget[];
} & ({
  type: EArrayMutation.set;
  value: JSONValue;
} | {
  type:
    EArrayMutation.push |
    EArrayMutation.unshift;
  value: JSONValue[];
} | {
  type:
    EArrayMutation.delete |
    EArrayMutation.reverse |
    EArrayMutation.shift;
  value?: never;
});

export type TMutation = TObjectMutation | TArrayMutation;

export type TMutationCallback = (mutation: TMutation) => void;
