import { Router } from 'express';
import { createFarmHandler, getFarmHandler, listFarmsHandler } from '../controllers/farmsController';
import { createCustomerHandler } from '../controllers/customersController';
import { createOrderHandler } from '../controllers/ordersController';
import { farmerDeliveriesHandler } from '../controllers/farmerController';
import { impactHandler } from '../controllers/impactController';

export const apiRouter = Router();

apiRouter.get('/healthz', (_req, res) => res.json({ ok: true }));
apiRouter.post('/farms', createFarmHandler);
apiRouter.get('/farms', listFarmsHandler);
apiRouter.get('/farms/:id', getFarmHandler);
apiRouter.post('/customers', createCustomerHandler);
apiRouter.post('/orders', createOrderHandler);
apiRouter.get('/farmer/:farmId/deliveries', farmerDeliveriesHandler);
apiRouter.get('/impact', impactHandler);
