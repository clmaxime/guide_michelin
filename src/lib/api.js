const API_URL = "http://localhost:3001";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export const authApi = {
  register: (body) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
  profile: () => apiFetch("/auth/profile"),
  getPreferences: () => apiFetch("/auth/preferences"),
  savePreferences: (body) => apiFetch("/auth/preferences", { method: "POST", body: JSON.stringify(body) }),
};

export const restaurantApi = {
  findAll: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.distinction) qs.set("distinction", params.distinction);
    if (params.lat != null) qs.set("lat", params.lat);
    if (params.lng != null) qs.set("lng", params.lng);
    if (params.range) qs.set("range", params.range);
    const query = qs.toString();
    return apiFetch(`/restaurants${query ? `?${query}` : ""}`);
  },
  findOne: (id) => apiFetch(`/restaurants/${id}`),
};

export const dishesApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.cuisine) qs.set("cuisine", params.cuisine);
    if (params.mood) qs.set("mood", params.mood);
    if (params.veganOnly != null) qs.set("veganOnly", params.veganOnly ? "true" : "false");
    if (params.excludedIngredients?.length) qs.set("excludedIngredients", params.excludedIngredients.join(","));
    if (params.allergens?.length) qs.set("allergens", params.allergens.join(","));
    if (params.excludedTags?.length) qs.set("excludedTags", params.excludedTags.join(","));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.offset) qs.set("offset", String(params.offset));
    const query = qs.toString();
    return apiFetch(`/dishes${query ? `?${query}` : ""}`);
  },
  findOne: (id) => apiFetch(`/dishes/${id}`),
};

export const favoritesApi = {
  list: () => apiFetch("/favorites"),
  listDishes: () => apiFetch("/favorites/dishes"),
  listRestaurants: () => apiFetch("/favorites/restaurants"),
  listHotels: () => apiFetch("/favorites/hotels"),
  getOne: (dishId) => apiFetch(`/favorites/${dishId}`),
  upsert: (body) => apiFetch("/favorites", { method: "POST", body: JSON.stringify(body) }),
  upsertRestaurant: (body) => apiFetch("/favorites/restaurants", { method: "POST", body: JSON.stringify(body) }),
  upsertHotel: (body) => apiFetch("/favorites/hotels", { method: "POST", body: JSON.stringify(body) }),
  extend: (dishId) => apiFetch(`/favorites/${dishId}/extend`, { method: "PATCH" }),
  deleteOne: (dishId) => apiFetch(`/favorites/${dishId}`, { method: "DELETE" }),
  deleteRestaurant: (restaurantId) => apiFetch(`/favorites/restaurants/${restaurantId}`, { method: "DELETE" }),
  deleteHotel: (hotelKey) => apiFetch(`/favorites/hotels/${encodeURIComponent(hotelKey)}`, { method: "DELETE" }),
  clear: () => apiFetch("/favorites", { method: "DELETE" }),
  clearRestaurants: () => apiFetch("/favorites/restaurants", { method: "DELETE" }),
  clearHotels: () => apiFetch("/favorites/hotels", { method: "DELETE" }),
};
