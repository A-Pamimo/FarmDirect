import type { Request, Response } from 'express';
import { z } from 'zod';
import { createFarm, findFarmsNear, getFarmById, mapRowToFarm } from '../services/farmService';
import { getPostalCoordinate } from '../services/postalService';
import { query } from '../db/pool';
import type { FarmRow } from '../types';

const createFarmSchema = z.object({
  name: z.string(),
  story: z.string(),
  photoUrl: z.string().url(),
  postalCode: z.string(),
  lat: z.number(),
  lng: z.number(),
  featuredProductName: z.string(),
  featuredPriceCents: z.number().int().positive(),
});

export const createFarmHandler = async (req: Request, res: Response) => {
  const parsed = createFarmSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const farm = await createFarm(parsed.data);
  res.status(201).json(farm);
};

const listFarmsSchema = z.object({
  near: z.string().optional(),
  radius_km: z.coerce.number().min(1).max(200).optional(),
  sort: z.enum(['distance', 'product', 'storytag']).optional(),
  tag: z.string().optional(),
  product: z.string().optional(),
});

export const listFarmsHandler = async (req: Request, res: Response) => {
  const parsed = listFarmsSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  if (!parsed.data.near) {
    const { rows } = await query<FarmRow>(`SELECT * FROM farms ORDER BY name ASC LIMIT 50`);
    return res.json({ farms: rows.map((row) => mapRowToFarm(row)), origin: null });
  }

  const coordinate = getPostalCoordinate(parsed.data.near);
  if (!coordinate) {
    return res.status(404).json({ error: 'Postal code not recognized for demo.' });
  }

  const farms = await findFarmsNear(coordinate.lat, coordinate.lng, {
    radiusKm: parsed.data.radius_km,
    sort: parsed.data.sort,
    tag: parsed.data.tag,
    productQuery: parsed.data.product,
  });
  res.json({ farms, origin: coordinate });
};

export const getFarmHandler = async (req: Request, res: Response) => {
  const farm = await getFarmById(req.params.id);
  if (!farm) return res.status(404).json({ error: 'Farm not found' });
  res.json(farm);
};
