import type { ImpactCounters } from '@harvestlink/shared';
import { AVG_ORDER_KG, CO2_FACTOR, MARGIN_UPLIFT } from '@harvestlink/shared';
import { query } from '../db/pool';
import type { ImpactCountersRow } from '../types';

const mapRow = (row: ImpactCountersRow): ImpactCounters => ({
  ordersCount: Number(row.orders_count),
  kgSaved: Number(row.kg_saved),
  co2AvoidedKg: Number(row.co2_avoided_kg),
  farmerMarginProtectedCents: Number(row.farmer_margin_protected_cents),
});

const ensureSingleton = async (): Promise<void> => {
  await query(
    `INSERT INTO impact_counters (id, orders_count, kg_saved, co2_avoided_kg, farmer_margin_protected_cents)
     VALUES (1,0,0,0,0)
     ON CONFLICT (id) DO NOTHING`
  );
};

export const getImpactCounters = async (): Promise<ImpactCounters> => {
  await ensureSingleton();
  const { rows } = await query<ImpactCountersRow>(`SELECT * FROM impact_counters WHERE id = 1`);
  return mapRow(rows[0]);
};

export const incrementImpactCounters = async (input: {
  priceCents: number;
  quantityKg?: number;
}): Promise<ImpactCounters> => {
  await ensureSingleton();
  const quantity = input.quantityKg && input.quantityKg > 0 ? input.quantityKg : AVG_ORDER_KG;
  const { rows } = await query<ImpactCountersRow>(
    `UPDATE impact_counters
     SET orders_count = orders_count + 1,
         kg_saved = kg_saved + $1,
         co2_avoided_kg = co2_avoided_kg + $2,
         farmer_margin_protected_cents = farmer_margin_protected_cents + $3,
         updated_at = NOW()
     WHERE id = 1
     RETURNING *`,
    [quantity, quantity * CO2_FACTOR, Math.round(input.priceCents * MARGIN_UPLIFT)]
  );
  return mapRow(rows[0]);
};
