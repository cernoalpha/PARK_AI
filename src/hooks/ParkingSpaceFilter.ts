import { getDistanceFromLatLonInKm } from './haversine';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Location extends Coordinates {
  name: string;
  description: string;
  floors: { [floor: string]: boolean[] };
}

export const filterParkingSpaces = (
  locations: Location[],
  center: Coordinates,
  radius: number
): Location[] => {
  return locations.filter(location => {
    const distance = getDistanceFromLatLonInKm(center.lat, center.lng, location.lat, location.lng);
    return distance <= radius;
  });
}