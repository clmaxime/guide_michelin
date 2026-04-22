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
  findAlongRoute: (body) =>
    apiFetch("/restaurants/along-route", { method: "POST", body: JSON.stringify(body) }),
};
