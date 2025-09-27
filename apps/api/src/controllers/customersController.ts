import type { Request, Response } from 'express';
import { z } from 'zod';
import { createCustomer } from '../services/customerService';
import { getPostalCoordinate } from '../services/postalService';

const createCustomerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  postalCode: z.string(),
});

export const createCustomerHandler = async (req: Request, res: Response) => {
  const parsed = createCustomerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const coordinate = getPostalCoordinate(parsed.data.postalCode);
  if (!coordinate) {
    return res.status(404).json({ error: 'Postal code not recognized for demo.' });
  }

  const customer = await createCustomer({
    name: parsed.data.name,
    email: parsed.data.email,
    postalCode: coordinate.postalCode,
    lat: coordinate.lat,
    lng: coordinate.lng,
  });

  res.status(201).json(customer);
};
