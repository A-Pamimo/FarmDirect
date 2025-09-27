TRUNCATE TABLE orders RESTART IDENTITY CASCADE;
TRUNCATE TABLE farms RESTART IDENTITY CASCADE;
TRUNCATE TABLE customers RESTART IDENTITY CASCADE;
TRUNCATE TABLE hubs RESTART IDENTITY CASCADE;
TRUNCATE TABLE impact_counters RESTART IDENTITY CASCADE;

INSERT INTO hubs (id, name, lat, lng, geom, address)
VALUES
  ('1a111111-1111-4111-8111-111111111111', 'University Hub', 52.125, -106.634,
   ST_SetSRID(ST_MakePoint(-106.634, 52.125), 4326), '123 Campus Drive, Saskatoon, SK'),
  ('2b222222-2222-4222-8222-222222222222', 'Community Center Hub', 43.646, -79.392,
   ST_SetSRID(ST_MakePoint(-79.392, 43.646), 4326), '200 King St W, Toronto, ON'),
  ('3c333333-3333-4333-8333-333333333333', 'Downtown Hub', 49.281, -123.109,
   ST_SetSRID(ST_MakePoint(-123.109, 49.281), 4326), '500 Granville St, Vancouver, BC');

INSERT INTO farms (id, name, story, photo_url, postal_code, lat, lng, geom, featured_product_name, featured_price_cents)
VALUES
  ('f1f1f1f1-1111-4111-8111-aaaaaaaaaaaa', 'Sarah\'s Heirloom Garden',
   'Sarah grows heirloom vegetables on a regenerative micro-farm. Her community-supported agriculture focuses on soil health and storytelling.',
   '/images/sarah.svg', 'S7N 0W5', 52.1275, -106.6306,
   ST_SetSRID(ST_MakePoint(-106.6306, 52.1275), 4326), 'Heritage Tomato Crate', 3600),
  ('f2f2f2f2-2222-4222-8222-bbbbbbbbbbbb', 'Riverbend Organics',
   'Riverbend is a family-run organic farm along the river. They champion biodiversity, low-waste packaging, and transparent pricing.',
   '/images/riverbend.svg', 'M5V 2T6', 43.6456, -79.3957,
   ST_SetSRID(ST_MakePoint(-79.3957, 43.6456), 4326), 'Forest Greens Bundle', 3200),
  ('f3f3f3f3-3333-4333-8333-cccccccccccc', 'Prairie Roots Co-op',
   'A prairie collective of young farmers spotlighting drought-resilient crops and community grain shares.',
   '/images/prairie.svg', 'T2N 1N4', 51.0534, -114.0936,
   ST_SetSRID(ST_MakePoint(-114.0936, 51.0534), 4326), 'Heritage Grain Flour', 2800);

INSERT INTO customers (id, name, email, postal_code, lat, lng, geom)
VALUES
  ('c1c1c1c1-1111-4111-8111-dddddddddddd', 'Lina Chen', 'lina@example.com', 'S7N 0W5', 52.1275, -106.6306,
   ST_SetSRID(ST_MakePoint(-106.6306, 52.1275), 4326)),
  ('c2c2c2c2-2222-4222-8222-eeeeeeeeeeee', 'Marcus Lee', 'marcus@example.com', 'M5V 2T6', 43.6456, -79.3957,
   ST_SetSRID(ST_MakePoint(-79.3957, 43.6456), 4326));

INSERT INTO impact_counters (id, orders_count, kg_saved, co2_avoided_kg, farmer_margin_protected_cents)
VALUES (1, 3, 6, 12, 3200)
ON CONFLICT (id) DO UPDATE SET
  orders_count = EXCLUDED.orders_count,
  kg_saved = EXCLUDED.kg_saved,
  co2_avoided_kg = EXCLUDED.co2_avoided_kg,
  farmer_margin_protected_cents = EXCLUDED.farmer_margin_protected_cents,
  updated_at = NOW();
