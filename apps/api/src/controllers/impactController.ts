import type { Request, Response } from 'express';
import { getImpactCounters } from '../services/impactService';

export const impactHandler = async (_req: Request, res: Response) => {
  const counters = await getImpactCounters();
  res.json(counters);
};
