import { describe, expect, test } from 'bun:test';
import { isTFwsMessage } from '../src/client/isTFwsMessage';

describe('isTFwsMessage', () => {
  test('should return true for valid TFwsMessage', () => {
    const message = { type: '@traced-fabric/ws' };

    expect(isTFwsMessage(message)).toBe(true);
  });

  test('should return false for null', () => {
    expect(isTFwsMessage(null)).toBe(false);
  });

  test('should return false for non-object types', () => {
    expect(isTFwsMessage('string')).toBe(false);
    expect(isTFwsMessage(123)).toBe(false);
    expect(isTFwsMessage(true)).toBe(false);
    expect(isTFwsMessage(undefined)).toBe(false);
  });

  test('should return false for objects without type property', () => {
    const message = { notType: '@traced-fabric/ws' };

    expect(isTFwsMessage(message)).toBe(false);
  });

  test('should return false for objects with incorrect type property', () => {
    const message = { type: 'incorrect-type' };

    expect(isTFwsMessage(message)).toBe(false);
  });

  test('should return false for objects with type property but incorrect value', () => {
    const message = { type: '@incorrect/ws' };

    expect(isTFwsMessage(message)).toBe(false);
  });
});
