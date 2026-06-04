const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("pos_token");

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (res.status === 401) {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    window.location.href = "/login";
  }

  if (!res.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
}

export const api = {
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  verify: () => request("/auth/verify", { method: "POST" }),
  getMenu: () => request("/menu"),
  getOrders: (p = {}) => request(`/orders?${new URLSearchParams(p)}`),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (body) =>
    request("/orders", { method: "POST", body: JSON.stringify(body) }),
  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  printOrder: (id) => request(`/print/${id}`, { method: "POST" }),
  getCategories: () => request("/admin/categories"),
  createCategory: (body) =>
    request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCategory: (id, b) =>
    request(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(b),
    }),
  getAdminItems: () => request("/admin/items"),
  createItem: (body) =>
    request("/admin/items", { method: "POST", body: JSON.stringify(body) }),
  updateItem: (id, b) =>
    request(`/admin/items/${id}`, { method: "PUT", body: JSON.stringify(b) }),
  toggleItem: (id) => request(`/admin/items/${id}/toggle`, { method: "PATCH" }),
  deleteItem: (id) => request(`/admin/items/${id}`, { method: "DELETE" }),
  getStats: (date) => request(`/admin/stats${date ? `?date=${date}` : ""}`),
  getSalesByDay: (params) =>
    request(`/admin/sales-by-day?${new URLSearchParams(params)}`),
};
