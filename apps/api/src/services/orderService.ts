import type { Order, OrderStatus } from '@harvestlink/shared';
import { AVG_ORDER_KG } from '@harvestlink/shared';
import { query } from '../db/pool';
import type { OrderRow } from '../types';
import { getCustomerById } from './customerService';
import { getFarmById } from './farmService';
import { findNearestHub, getHubById } from './hubService';

const mapRowToOrder = (row: OrderRow): Order => ({
  id: row.id,
  customerId: row.customer_id,
  farmId: row.farm_id,
  hubId: row.hub_id,
  quantityKg: Number(row.quantity_kg),
  priceCents: row.price_cents,
  status: row.status,
  stripeSessionId: row.stripe_session_id,
});

export interface CreateOrderResult {
  order: Order;
  hub: Awaited<ReturnType<typeof getHubById>>;
  farmName: string;
  productName: string;
}

export const createOrder = async (input: {
  customerId: string;
  farmId: string;
  quantityKg?: number;
  stripeSessionId?: string | null;
}): Promise<CreateOrderResult> => {
  const customer = await getCustomerById(input.customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }
  const farm = await getFarmById(input.farmId);
  if (!farm) {
    throw new Error('Farm not found');
  }
  const hub = await findNearestHub(customer.lat, customer.lng);
  if (!hub) {
    throw new Error('No hubs configured');
  }

  const quantityKg = input.quantityKg ?? AVG_ORDER_KG;
  const { rows } = await query<OrderRow>(
    `INSERT INTO orders (customer_id, farm_id, hub_id, quantity_kg, price_cents, status, stripe_session_id)
     VALUES ($1,$2,$3,$4,$5,'pending',$6)
     RETURNING *`,
    [customer.id, farm.id, hub.id, quantityKg, farm.featuredPriceCents, input.stripeSessionId ?? null]
  );

  return { order: mapRowToOrder(rows[0]), hub, farmName: farm.name, productName: farm.featuredProductName };
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order | null> => {
  const { rows } = await query<OrderRow>(
    `UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, status]
  );
  if (!rows[0]) return null;
  return mapRowToOrder(rows[0]);
};

export const attachStripeSession = async (
  id: string,
  sessionId: string
): Promise<Order | null> => {
  const { rows } = await query<OrderRow>(
    `UPDATE orders SET stripe_session_id = $2, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id, sessionId]
  );
  if (!rows[0]) return null;
  return mapRowToOrder(rows[0]);
};

export const getOrderByStripeSession = async (sessionId: string): Promise<Order | null> => {
  const { rows } = await query<OrderRow>(
    `SELECT * FROM orders WHERE stripe_session_id = $1 LIMIT 1`,
    [sessionId]
  );
  if (!rows[0]) return null;
  return mapRowToOrder(rows[0]);
};

export interface FarmerDeliveriesGroup {
  hub: {
    id: string;
    name: string;
    address: string;
  };
  orders: Array<{
    orderId: string;
    customerName: string;
    quantityKg: number;
    status: OrderStatus;
  }>;
}

export const getFarmerDeliveries = async (farmId: string): Promise<FarmerDeliveriesGroup[]> => {
  const { rows } = await query<
    OrderRow & {
      hub_name: string;
      hub_address: string;
      customer_name: string;
    }
  >(
    `SELECT o.*, h.name AS hub_name, h.address AS hub_address, c.name AS customer_name
     FROM orders o
     INNER JOIN hubs h ON h.id = o.hub_id
     INNER JOIN customers c ON c.id = o.customer_id
     WHERE o.farm_id = $1
     ORDER BY h.name ASC, c.name ASC`,
    [farmId]
  );

  const grouped: Record<string, FarmerDeliveriesGroup> = {};
  rows.forEach((row) => {
    if (!grouped[row.hub_id]) {
      grouped[row.hub_id] = {
        hub: {
          id: row.hub_id,
          name: row.hub_name,
          address: row.hub_address,
        },
        orders: [],
      };
    }
    grouped[row.hub_id].orders.push({
      orderId: row.id,
      customerName: row.customer_name,
      quantityKg: Number(row.quantity_kg),
      status: row.status,
    });
  });

  return Object.values(grouped);
};
