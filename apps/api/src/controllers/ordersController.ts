import type { Request, Response } from 'express';
import { z } from 'zod';
import { createOrder, attachStripeSession, updateOrderStatus } from '../services/orderService';
import { createCheckoutSession } from '../services/stripeService';
import { incrementImpactCounters } from '../services/impactService';
import { getCustomerById } from '../services/customerService';
import { sendOrderNotifications } from '../services/notificationService';
import { featureFlags } from '../config/env';

const createOrderSchema = z.object({
  customerId: z.string().uuid(),
  farmId: z.string().uuid(),
  quantityKg: z.coerce.number().positive().optional(),
});

export const createOrderHandler = async (req: Request, res: Response) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await createOrder(parsed.data);
    const customer = await getCustomerById(result.order.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const session = await createCheckoutSession({
      orderId: result.order.id,
      customerEmail: customer.email,
      productName: result.productName,
      farmerName: result.farmName,
      amountCents: result.order.priceCents,
      quantityKg: result.order.quantityKg,
    });

    await attachStripeSession(result.order.id, session.sessionId);

    let orderResponse = result.order;

    if (session.isMock || !featureFlags.stripeEnabled) {
      const paid = await updateOrderStatus(result.order.id, 'paid');
      if (paid) {
        orderResponse = paid;
        await incrementImpactCounters({
          priceCents: paid.priceCents,
          quantityKg: paid.quantityKg,
        });
        await sendOrderNotifications({
          customer,
          order: paid,
          hub: result.hub!,
          farmName: result.farmName,
        });
      }
    }

    res.status(201).json({
      order: orderResponse,
      hub: result.hub,
      checkoutUrl: session.url,
      mock: session.isMock,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message ?? 'Unable to create order' });
  }
};
