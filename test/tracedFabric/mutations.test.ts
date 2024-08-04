import { describe, expect, test } from 'bun:test';
import { traceFabric } from '../../src/traceFabric';

describe('tracedFabric reflects mutated', () => {
  test('string', () => {
    const tracing = traceFabric({ string: 'string' });

    tracing.value.string = 'new string';

    expect(tracing.value).toBeObject();
  });
});
