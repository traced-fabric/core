import type { JSONStructure, TMutation } from '@traced-fabric/core';

export enum ETFwsDataType {
  set = 'set',
  update = 'update',
}

export type TTFStateName = string;

export type TTFwsMessageSet = {
  type: '@traced-fabric/ws';
  dataType: ETFwsDataType.set;
  value: JSONStructure;
  stateName: TTFStateName;
};

export type TTFwsMessageUpdate = {
  type: '@traced-fabric/ws';
  dataType: ETFwsDataType.update;
  trace: TMutation[];
  stateName: TTFStateName;
};

export type TTFwsMessage = TTFwsMessageSet | TTFwsMessageUpdate;
