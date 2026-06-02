const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const DEFAULT_API_KEY = import.meta.env.VITE_FIS_EPN_API_KEY ?? 'clave-de-prueba';

let apiKey = localStorage.getItem('fisEpnApiKey') ?? DEFAULT_API_KEY;

export function getApiConfig() {
  return {
    apiUrl: API_URL,
    apiKey,
  };
}

export function setApiKey(nextApiKey) {
  apiKey = nextApiKey.trim();
  localStorage.setItem('fisEpnApiKey', apiKey);
}

export async function getPlatos() {
  return request('/platos-tipicos');
}

export async function getPlato(id) {
  return request(`/platos-tipicos/${id}`);
}

export async function createPlato(payload) {
  return request('/platos-tipicos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updatePlato(id, payload) {
  return request(`/platos-tipicos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deletePlato(id) {
  return request(`/platos-tipicos/${id}`, {
    method: 'DELETE',
  });
}

export async function getStats() {
  return request('/platos-tipicos/stats');
}

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-FIS-EPN-KEY': apiKey,
        ...(options.headers ?? {}),
      },
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(body.message ?? `Error HTTP ${response.status}`);
    }

    return body;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No se pudo conectar con el backend NestJS.');
    }

    throw error;
  }
}
