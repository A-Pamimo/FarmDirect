CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  story TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  geom GEOGRAPHY(POINT, 4326),
  featured_product_name TEXT NOT NULL,
  featured_price_cents INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  geom GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  geom GEOGRAPHY(POINT, 4326),
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  hub_id UUID REFERENCES hubs(id) ON DELETE SET NULL,
  quantity_kg NUMERIC DEFAULT 2.0,
  price_cents INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','paid','confirmed','delivered')),
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS impact_counters (
  id INT PRIMARY KEY DEFAULT 1,
  orders_count INT NOT NULL DEFAULT 0,
  kg_saved NUMERIC NOT NULL DEFAULT 0,
  co2_avoided_kg NUMERIC NOT NULL DEFAULT 0,
  farmer_margin_protected_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS farms_geom_idx ON farms USING GIST (geom);
CREATE INDEX IF NOT EXISTS customers_geom_idx ON customers USING GIST (geom);
CREATE INDEX IF NOT EXISTS hubs_geom_idx ON hubs USING GIST (geom);
