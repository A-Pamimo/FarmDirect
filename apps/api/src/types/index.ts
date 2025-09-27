export interface FarmRow {
  id: string;
  name: string;
  story: string;
  photo_url: string;
  postal_code: string;
  lat: number;
  lng: number;
  geom: string | null;
  featured_product_name: string;
  featured_price_cents: number;
  created_at: string;
  updated_at: string;
}

export interface HubRow {
  id: string;
  name: string;
  lat: number;
  lng: number;
  geom: string | null;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  postal_code: string;
  lat: number;
  lng: number;
  geom: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  customer_id: string;
  farm_id: string;
  hub_id: string;
  quantity_kg: number;
  price_cents: number;
  status: 'pending' | 'paid' | 'confirmed' | 'delivered';
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ImpactCountersRow {
  id: number;
  orders_count: number;
  kg_saved: number;
  co2_avoided_kg: number;
  farmer_margin_protected_cents: number;
  created_at: string;
  updated_at: string;
}
