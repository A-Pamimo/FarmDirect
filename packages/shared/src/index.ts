export const AVG_ORDER_KG = 2;
export const CO2_FACTOR = 2;
export const MARGIN_UPLIFT = 0.1;

export type UUID = string;

export interface Farm {
  id: UUID;
  name: string;
  story: string;
  photoUrl: string;
  postalCode: string;
  lat: number;
  lng: number;
  featuredProductName: string;
  featuredPriceCents: number;
  distanceKm?: number;
  testimonials?: Testimonial[];
}

export interface Testimonial {
  author: string;
  quote: string;
}

export interface Customer {
  id: UUID;
  name: string;
  email: string;
  postalCode: string;
  lat: number;
  lng: number;
}

export interface Hub {
  id: UUID;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

export type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'delivered';

export interface Order {
  id: UUID;
  customerId: UUID;
  farmId: UUID;
  hubId: UUID;
  quantityKg: number;
  priceCents: number;
  status: OrderStatus;
  stripeSessionId: string | null;
}

export interface ImpactCounters {
  ordersCount: number;
  kgSaved: number;
  co2AvoidedKg: number;
  farmerMarginProtectedCents: number;
}

export interface PostalCoordinate {
  postalCode: string;
  lat: number;
  lng: number;
}

export const IMPACT_DEFAULTS: ImpactCounters = {
  ordersCount: 0,
  kgSaved: 0,
  co2AvoidedKg: 0,
  farmerMarginProtectedCents: 0,
};

export const FARM_SORT_OPTIONS = ['distance', 'product', 'storytag'] as const;
export type FarmSortOption = (typeof FARM_SORT_OPTIONS)[number];

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'confirmed', 'delivered'];

export function centsToCurrency(value: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value / 100);
}
