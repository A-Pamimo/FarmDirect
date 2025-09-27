import type { Hub } from '@harvestlink/shared';
import { query } from '../db/pool';
import type { HubRow } from '../types';

const mapRowToHub = (row: HubRow, distanceKm?: number): Hub & { distanceKm?: number } => ({
  id: row.id,
  name: row.name,
  lat: Number(row.lat),
  lng: Number(row.lng),
  address: row.address,
  ...(distanceKm ? { distanceKm } : {}),
});

export const listHubs = async (): Promise<Hub[]> => {
  const { rows } = await query<HubRow>('SELECT * FROM hubs ORDER BY name ASC');
  return rows.map((row) => mapRowToHub(row));
};

export const findNearestHub = async (
  lat: number,
  lng: number
): Promise<(Hub & { distanceKm: number }) | null> => {
  const { rows } = await query<HubRow & { distance_km: number }>(
    `SELECT *,
      ST_Distance(geom, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography)/1000 AS distance_km
     FROM hubs
     ORDER BY distance_km ASC
     LIMIT 1`,
    [lng, lat]
  );
  if (!rows[0]) return null;
  return mapRowToHub(rows[0], Number(rows[0].distance_km));
};

export const getHubById = async (id: string): Promise<Hub | null> => {
  const { rows } = await query<HubRow>('SELECT * FROM hubs WHERE id = $1', [id]);
  if (!rows[0]) return null;
  return mapRowToHub(rows[0]);
};
