import axios from 'axios';
import type { Farm, ImpactCounters } from '@harvestlink/shared';
import { getApiBaseUrl } from './env';

const client = axios.create({
  baseURL: getApiBaseUrl(),
});

export interface FarmSearchResponse {
  farms: Farm[];
  origin: { postalCode: string; lat: number; lng: number } | null;
}

export const fetchFarms = async (params: Record<string, string | number | undefined>) => {
  const { data } = await client.get<FarmSearchResponse>('/farms', { params });
  return data;
};

export const fetchFarm = async (id: string) => {
  const { data } = await client.get<Farm>(`/farms/${id}`);
  return data;
};

export const fetchImpact = async () => {
  const { data } = await client.get<ImpactCounters>('/impact');
  return data;
};

export const createOrder = async (payload: {
  customerId: string;
  farmId: string;
  quantityKg?: number;
}) => {
  const { data } = await client.post('/orders', payload);
  return data as {
    order: { id: string };
    hub: { id: string; name: string; address: string };
    checkoutUrl: string;
    mock: boolean;
  };
};

export const createCustomer = async (payload: { name: string; email: string; postalCode: string }) => {
  const { data } = await client.post('/customers', payload);
  return data;
};

export const fetchFarmerDeliveries = async (farmId: string) => {
  const { data } = await client.get<{ deliveries: Array<{ hub: { id: string; name: string; address: string }; orders: any[] }> }>(
    `/farmer/${farmId}/deliveries`
  );
  return data.deliveries;
};
