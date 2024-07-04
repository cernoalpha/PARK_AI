// geocode.ts
export const geocodeLocation = async (placeName: string): Promise<{ lat: number; lng: number } | null> => {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return null;
  };