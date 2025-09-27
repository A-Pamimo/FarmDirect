import type { Request, Response } from 'express';
import { getFarmerDeliveries } from '../services/orderService';

export const farmerDeliveriesHandler = async (req: Request, res: Response) => {
  const { farmId } = req.params;
  const deliveries = await getFarmerDeliveries(farmId);
  res.json({ deliveries });
};
