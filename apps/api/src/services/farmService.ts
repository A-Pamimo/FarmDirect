import type { Farm } from '@harvestlink/shared';
import { FARM_SORT_OPTIONS, FarmSortOption } from '@harvestlink/shared';
import { query } from '../db/pool';
import type { FarmRow } from '../types';

export const mapRowToFarm = (row: FarmRow, distanceKm?: number): Farm => ({
  id: row.id,
  name: row.name,
  story: row.story,
  photoUrl: row.photo_url,
  postalCode: row.postal_code,
  lat: Number(row.lat),
  lng: Number(row.lng),
  featuredProductName: row.featured_product_name,
  featuredPriceCents: row.featured_price_cents,
  distanceKm,
});

export interface FarmSearchParams {
  postalCode?: string;
  radiusKm?: number;
  sort?: FarmSortOption;
  tag?: string;
  productQuery?: string;
}

const sortColumnMap: Record<FarmSortOption, string> = {
  distance: 'distance_km',
  product: 'featured_product_name',
  storytag: 'name',
};

export const createFarm = async (input: {
  name: string;
  story: string;
  photoUrl: string;
  postalCode: string;
  lat: number;
  lng: number;
  featuredProductName: string;
  featuredPriceCents: number;
}): Promise<Farm> => {
  const { rows } = await query<FarmRow>(
    `INSERT INTO farms
      (name, story, photo_url, postal_code, lat, lng, geom, featured_product_name, featured_price_cents)
     VALUES ($1,$2,$3,$4,$5,$6, ST_SetSRID(ST_MakePoint($7,$8),4326), $9,$10)
     RETURNING *`,
    [
      input.name,
      input.story,
      input.photoUrl,
      input.postalCode,
      input.lat,
      input.lng,
      input.lng,
      input.lat,
      input.featuredProductName,
      input.featuredPriceCents,
    ]
  );

  return mapRowToFarm(rows[0]);
};

export const findFarmsNear = async (
  lat: number,
  lng: number,
  { radiusKm = 30, sort = 'distance', tag, productQuery }: FarmSearchParams = {}
): Promise<Farm[]> => {
  const filters: string[] = [];
  const params: Array<string | number> = [lng, lat, radiusKm * 1000];
  let paramIndex = params.length;

  if (tag) {
    filters.push(`story ILIKE $${++paramIndex}`);
    params.push(`%${tag}%`);
  }

  if (productQuery) {
    filters.push(`featured_product_name ILIKE $${++paramIndex}`);
    params.push(`%${productQuery}%`);
  }

  const whereClause = filters.length > 0 ? `AND ${filters.join(' AND ')}` : '';
  const sortColumn = FARM_SORT_OPTIONS.includes(sort) ? sortColumnMap[sort] : sortColumnMap.distance;

  const { rows } = await query< FarmRow & { distance_km: number }>(
    `SELECT *,
      ST_Distance(geom, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography)/1000 AS distance_km
     FROM farms
     WHERE geom IS NOT NULL
       AND ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1,$2),4326)::geography, $3)
       ${whereClause}
     ORDER BY ${sortColumn} ASC`,
    params
  );

  return rows.map((row) => mapRowToFarm(row, Number(row.distance_km)));
};

export const getFarmById = async (id: string): Promise<Farm | null> => {
  const { rows } = await query<FarmRow>(`SELECT * FROM farms WHERE id = $1`, [id]);
  if (!rows[0]) return null;
  return mapRowToFarm(rows[0]);
};
