import axios from 'axios';
import { ApiError } from '../lib/apiError.js';
import * as tokenStore from './tokenStore.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000',
  timeout: 30_000,
  withCredentials: false,
});

// ── Request: attach Bearer token ──────────────────────────
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ── Response: unwrap envelope, handle 401 refresh ─────────
api.interceptors.response.use(
  (response) => {
    // Unwrap standard envelope → return data directly
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const envelope = error.response?.data;

    if (status === 401 && !original._retry && tokenStore.hasRefresh()) {
      original._retry = true;
      try {
        const refreshRes = await axios.post(
          `${api.defaults.baseURL}/api/v1/auth/refresh`,
          { refreshToken: tokenStore.getRefreshToken() },
        );
        const tokens = refreshRes.data?.data ?? refreshRes.data;
        tokenStore.setTokens(tokens);
        original.headers['Authorization'] = `Bearer ${tokenStore.getAccessToken()}`;
        return api(original);
      } catch {
        tokenStore.clear();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        throw new ApiError(envelope, status);
      }
    }

    throw new ApiError(envelope, status ?? 0);
  },
);

// Convenience wrappers — callers get data directly
export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) => api.post(url, data, config);
export const put = (url, data, config) => api.put(url, data, config);
export const patch = (url, data, config) => api.patch(url, data, config);
export const del = (url, config) => api.delete(url, config);

export { api };
