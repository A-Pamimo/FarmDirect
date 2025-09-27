import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { apiRouter } from './routes';
import { stripeWebhookHandler } from './controllers/webhookController';
import { env } from './config/env';
import { logger } from './utils/logger';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.appBaseUrl,
      credentials: true,
    })
  );
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120,
    })
  );
  app.use(morgan('dev'));

  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRouter);

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error', { error: err });
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  });

  return app;
};
