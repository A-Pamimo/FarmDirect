import { describe, expect, it } from 'vitest';
import { haversineDistance, withinRadius } from '../src/utils/geo';

describe('geo utils', () => {
  it('computes reasonable distance', () => {
    const distance = haversineDistance(52.1275, -106.6306, 52.125, -106.634);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(1);
  });

  it('determines radius inclusion', () => {
    const origin = { postalCode: 'S7N 0W5', lat: 52.1275, lng: -106.6306 };
    const target = { postalCode: 'S7N 0W6', lat: 52.125, lng: -106.634 };
    expect(withinRadius(origin, target, 5)).toBe(true);
    expect(withinRadius(origin, target, 0.1)).toBe(false);
  });
});
