// Central API client — all fetch calls go through here
// In dev: Vite proxies /api → http://localhost:3001/api (no CORS)
// In prod: /api is served by the same origin
const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const api = {
  customers: {
    list: (params?: { search?: string; type?: string }) =>
      request(`/customers${toQuery(params)}`),
    get: (id: string) => request(`/customers/${id}`),
    create: (data: unknown) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/customers/${id}`, { method: 'DELETE' }),
  },

  relocations: {
    list: (params?: { status?: string; priority?: string; coordinator?: string; search?: string }) =>
      request(`/relocations${toQuery(params)}`),
    get: (id: string) => request(`/relocations/${id}`),
    detail: (id: string) => request(`/relocations/${id}/detail`),
    create: (data: unknown) => request('/relocations', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request(`/relocations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  tasks: {
    list: (params?: { status?: string; priority?: string; assignee?: string; relocationId?: string }) =>
      request(`/tasks${toQuery(params)}`),
    create: (data: unknown) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },

  vendors: {
    list: (params?: { city?: string; type?: string; available?: string }) =>
      request(`/vendors${toQuery(params)}`),
    bookings: {
      list: () => request('/vendors/bookings'),
      create: (data: unknown) => request('/vendors/bookings', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: unknown) => request(`/vendors/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    },
  },

  utilities: {
    list: (params?: { relocationId?: string; status?: string }) =>
      request(`/utilities${toQuery(params)}`),
    update: (id: string, data: unknown) => request(`/utilities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  properties: {
    list: (params?: { relocationId?: string; status?: string }) =>
      request(`/properties${toQuery(params)}`),
    create: (data: unknown) => request('/properties', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => request(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  notifications: {
    list: () => request('/notifications'),
    markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
  },

  addressChange: {
    list: (params?: { relocationId?: string }) => request(`/address-change${toQuery(params)}`),
    update: (id: string, data: unknown) => request(`/address-change/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  documents: {
    list: (params?: { relocationId?: string }) => request(`/documents${toQuery(params)}`),
  },

  activity: {
    list: (params?: { relocationId?: string; type?: string }) => request(`/activity${toQuery(params)}`),
  },

  team: {
    list: () => request('/team'),
  },

  corporateClients: {
    list: () => request('/corporate-clients'),
  },

  dashboard: {
    summary: () => request('/dashboard'),
  },
};

function toQuery(params?: Record<string, string | undefined>): string {
  if (!params) return '';
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '' && v !== 'all')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`)
    .join('&');
  return q ? `?${q}` : '';
}
