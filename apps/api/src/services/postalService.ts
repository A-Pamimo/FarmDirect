import type { PostalCoordinate } from '@harvestlink/shared';

interface PostalRecord extends PostalCoordinate {
  city: string;
  province: string;
}

const postalLookup: Record<string, PostalRecord> = {
  'S7N0W5': { postalCode: 'S7N 0W5', lat: 52.1275, lng: -106.6306, city: 'Saskatoon', province: 'SK' },
  'M5V2T6': { postalCode: 'M5V 2T6', lat: 43.6456, lng: -79.3957, city: 'Toronto', province: 'ON' },
  'V6B1A1': { postalCode: 'V6B 1A1', lat: 49.2801, lng: -123.1107, city: 'Vancouver', province: 'BC' },
  'T2N1N4': { postalCode: 'T2N 1N4', lat: 51.0534, lng: -114.0936, city: 'Calgary', province: 'AB' }
};

export const normalizePostalCode = (postalCode: string): string => postalCode.replace(/\s+/g, '').toUpperCase();

export const getPostalCoordinate = (postalCode: string): PostalRecord | null => {
  const normalized = normalizePostalCode(postalCode);
  return postalLookup[normalized] ?? null;
};

export const listDemoPostalCodes = (): PostalRecord[] => Object.values(postalLookup);
