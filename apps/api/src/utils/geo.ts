import type { PostalCoordinate } from '@harvestlink/shared';

const RADIUS_OF_EARTH_KM = 6371;

export const toRadians = (value: number): number => (value * Math.PI) / 180;

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return RADIUS_OF_EARTH_KM * c;
};

export const withinRadius = (
  origin: PostalCoordinate,
  target: PostalCoordinate,
  radiusKm: number
): boolean => {
  return haversineDistance(origin.lat, origin.lng, target.lat, target.lng) <= radiusKm;
};
