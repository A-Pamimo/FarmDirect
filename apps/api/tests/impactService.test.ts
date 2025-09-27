import { beforeEach, describe, expect, it, vi } from 'vitest';

const queryMock = vi.fn();

vi.mock('../src/db/pool', () => ({
  query: (...args: any[]) => queryMock(...args),
}));

import { getImpactCounters, incrementImpactCounters } from '../src/services/impactService';

const baseRow = {
  orders_count: 0,
  kg_saved: 0,
  co2_avoided_kg: 0,
  farmer_margin_protected_cents: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  id: 1,
};

beforeEach(() => {
  queryMock.mockReset();
});

describe('impactService', () => {
  it('ensures singleton row on fetch', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [baseRow] });

    const counters = await getImpactCounters();
    expect(queryMock).toHaveBeenCalledTimes(2);
    expect(counters.ordersCount).toBe(0);
  });

  it('increments counters with uplift', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [], rowCount: 0 })
      .mockResolvedValueOnce({ rows: [baseRow] })
      .mockResolvedValueOnce({
        rows: [
          {
            ...baseRow,
            orders_count: 1,
            kg_saved: 2,
            co2_avoided_kg: 4,
            farmer_margin_protected_cents: 320,
          },
        ],
      });

    const counters = await incrementImpactCounters({ priceCents: 3200, quantityKg: 2 });
    expect(counters.ordersCount).toBe(1);
    expect(counters.kgSaved).toBe(2);
    expect(queryMock).toHaveBeenCalledTimes(3);
  });
});
