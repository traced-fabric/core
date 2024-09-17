import { describe, expect, test } from 'bun:test';
import * as WS from '../index';

const expectType = <T>(_?: T) => ({});

describe('index file should export', () => {
  describe('applyMessage', () => {
    test('applyTFwsMessage', () => expectType<WS.TTFStateMap>());
    test('isTFwsMessage', () => expect(WS.isTFwsMessage).toBeDefined());
  });

  test('isTFwsMessage', () => expect(WS.isTFwsMessage).toBeDefined());

  test('createTFwsMessageSet', () => expect(WS.createTFwsMessageSet).toBeDefined());
  test('createTFwsMessageUpdate', () => expect(WS.createTFwsMessageUpdate).toBeDefined());

  describe('types', () => {
    test('ETFwsDataType', () => expect(WS.ETFwsDataType).toBeDefined());
    test('TTFStateName', () => expectType<WS.TTFStateName>());
    test('TTFwsMessageSet', () => expectType<WS.TTFwsMessageSet>());
    test('TTFwsMessageUpdate', () => expectType<WS.TTFwsMessageUpdate>());
    test('TTFwsMessage', () => expectType<WS.TTFwsMessage>());
  });
});
