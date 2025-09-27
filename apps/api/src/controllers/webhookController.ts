import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { env, featureFlags } from '../config/env';
import { getOrderByStripeSession, updateOrderStatus } from '../services/orderService';
import { incrementImpactCounters } from '../services/impactService';
import { getCustomerById } from '../services/customerService';
import { sendOrderNotifications } from '../services/notificationService';
import { logger } from '../utils/logger';

const stripe = featureFlags.stripeEnabled
  ? new Stripe(env.stripeSecretKey, { apiVersion: '2023-10-16' })
  : null;

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  if (!stripe || !featureFlags.stripeEnabled) {
    logger.warn('Stripe webhook received but Stripe is disabled.');
    return res.status(200).send({ received: true });
  }

  const sig = req.headers['stripe-signature'];
  if (!sig || Array.isArray(sig)) {
    return res.status(400).send(`Webhook Error: Missing signature`);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.webhookSecret);
  } catch (err: any) {
    logger.error('Webhook signature verification failed', { error: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (!session.id) {
      return res.status(200).send({ received: true });
    }

    const order = await getOrderByStripeSession(session.id);
    if (!order) {
      logger.warn('Order not found for session', { sessionId: session.id });
      return res.status(200).send({ received: true });
    }

    if (order.status === 'paid') {
      return res.status(200).send({ received: true });
    }

    const updated = await updateOrderStatus(order.id, 'paid');
    if (updated) {
      await incrementImpactCounters({
        priceCents: updated.priceCents,
        quantityKg: updated.quantityKg,
      });
      const customer = await getCustomerById(updated.customerId);
      if (customer) {
        const hub = await import('../services/hubService').then(({ getHubById }) =>
          getHubById(updated.hubId)
        );
        if (hub) {
          await sendOrderNotifications({
            customer,
            order: updated,
            hub,
            farmName: session.metadata?.farmerName ?? 'HarvestLink Farm',
          });
        }
      }
    }
  }

  res.status(200).send({ received: true });
};
