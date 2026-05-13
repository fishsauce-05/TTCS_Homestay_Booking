import { API_BASE_URL } from './config.js';
import { mockApiResponse } from '../shared/mock-data.js';

export const getToken = () => localStorage.getItem('jwt_token');
export const setToken = (token) => localStorage.setItem('jwt_token', token);
export const clearToken = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('current_user');
};
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('current_user') ?? 'null'); }
  catch { return null; }
};
export const setCurrentUser = (user) => localStorage.setItem('current_user', JSON.stringify(user));

export function authHeaders() {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export async function apiFetch(method, path, body) {
  try {
    const opts = { method, headers: authHeaders() };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE_URL}${path}`, opts);
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    // Nếu server không chạy (TypeError: Failed to fetch) → dùng mock data
    if (err instanceof TypeError) {
      console.info(`[MOCK] ${method} ${path}`);
      return mockApiResponse(method, path, body);
    }
    // Lỗi từ server (4xx, 5xx) → throw để caller xử lý
    throw err;
  }
}

export const apiGet    = (path)        => apiFetch('GET',    path);
export const apiPost   = (path, body)  => apiFetch('POST',   path, body);
export const apiPatch  = (path, body)  => apiFetch('PATCH',  path, body);
export const apiDelete = (path)        => apiFetch('DELETE', path);
