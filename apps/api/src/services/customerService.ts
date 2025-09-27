import type { Customer } from '@harvestlink/shared';
import { query } from '../db/pool';
import type { CustomerRow } from '../types';

const mapRowToCustomer = (row: CustomerRow): Customer => ({
  id: row.id,
  name: row.name,
  email: row.email,
  postalCode: row.postal_code,
  lat: Number(row.lat),
  lng: Number(row.lng),
});

export const createCustomer = async (input: {
  name: string;
  email: string;
  postalCode: string;
  lat: number;
  lng: number;
}): Promise<Customer> => {
  const { rows } = await query<CustomerRow>(
    `INSERT INTO customers (name, email, postal_code, lat, lng, geom)
     VALUES ($1,$2,$3,$4,$5, ST_SetSRID(ST_MakePoint($6,$7),4326))
     RETURNING *`,
    [input.name, input.email, input.postalCode, input.lat, input.lng, input.lng, input.lat]
  );
  return mapRowToCustomer(rows[0]);
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const { rows } = await query<CustomerRow>(`SELECT * FROM customers WHERE id = $1`, [id]);
  if (!rows[0]) return null;
  return mapRowToCustomer(rows[0]);
};
