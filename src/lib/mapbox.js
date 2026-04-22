const MAPBOX_BASE_URL = "https://api.mapbox.com";

export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? "";

const assertToken = () => {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error("Le token Mapbox est manquant. Ajoute `VITE_MAPBOX_ACCESS_TOKEN` dans `.env`.");
  }
};

export async function searchPlaces(query, signal) {
  assertToken();

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const endpoint = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(trimmedQuery)}.json`;
  const params = new URLSearchParams({
    access_token: MAPBOX_ACCESS_TOKEN,
    autocomplete: "true",
    language: "fr",
    limit: "5",
    types: "address,place,postcode,locality",
  });

  const response = await fetch(`${endpoint}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error("Échec de l’autocomplétion des adresses.");
  }

  const data = await response.json();
  return data.features ?? [];
}

export async function reverseGeocode(lng, lat) {
  assertToken();

  const endpoint = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${lng},${lat}.json`;
  const params = new URLSearchParams({
    access_token: MAPBOX_ACCESS_TOKEN,
    language: "fr",
    limit: "1",
    types: "address,place,locality",
  });

  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (!response.ok) throw new Error("Échec du géocodage inverse.");

  const data = await response.json();
  return data.features?.[0] ?? null;
}

export async function getRoute(origin, destination, signal) {
  assertToken();

  const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const endpoint = `${MAPBOX_BASE_URL}/directions/v5/mapbox/driving/${coordinates}`;
  const params = new URLSearchParams({
    access_token: MAPBOX_ACCESS_TOKEN,
    alternatives: "false",
    geometries: "geojson",
    language: "fr",
    overview: "full",
    steps: "true",
  });

  const response = await fetch(`${endpoint}?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error("Échec du calcul de l’itinéraire.");
  }

  const data = await response.json();
  return data.routes?.[0] ?? null;
}
