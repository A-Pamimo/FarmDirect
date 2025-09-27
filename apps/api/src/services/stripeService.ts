import Stripe from 'stripe';
import { env, featureFlags } from '../config/env';
import { logger } from '../utils/logger';

const stripeClient = featureFlags.stripeEnabled
  ? new Stripe(env.stripeSecretKey, { apiVersion: '2023-10-16' })
  : null;

export interface CheckoutSessionPayload {
  orderId: string;
  customerEmail: string;
  productName: string;
  farmerName: string;
  amountCents: number;
  quantityKg: number;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
  isMock: boolean;
}

export const createCheckoutSession = async (
  payload: CheckoutSessionPayload
): Promise<CheckoutSessionResult> => {
  if (!stripeClient) {
    const url = `${env.appBaseUrl}/mock-checkout?orderId=${payload.orderId}`;
    logger.warn('Stripe disabled, returning mock checkout URL', { url });
    return { sessionId: `mock_${payload.orderId}`, url, isMock: true };
  }

  const session = await stripeClient.checkout.sessions.create({
    mode: 'payment',
    success_url: `${env.appBaseUrl}/checkout/success?orderId=${payload.orderId}`,
    cancel_url: `${env.appBaseUrl}/checkout/cancel?orderId=${payload.orderId}`,
    customer_email: payload.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: payload.productName,
            metadata: {
              orderId: payload.orderId,
              quantityKg: String(payload.quantityKg),
              farmerName: payload.farmerName,
              productName: payload.productName,
            },
          },
          unit_amount: payload.amountCents,
        },
        quantity: 1,
      },
    ],
  });

  if (!session.url || !session.id) {
    throw new Error('Failed to create Stripe checkout session');
  }

  return {
    sessionId: session.id,
    url: session.url,
    isMock: false,
  };
};
