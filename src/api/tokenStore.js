const KEY_ACCESS = 'nora:accessToken';
const KEY_REFRESH = 'nora:refreshToken';

// In-memory store — primary source of truth for access token
let _accessToken = localStorage.getItem(KEY_ACCESS) ?? null;

export function getAccessToken() {
  return _accessToken;
}

export function getRefreshToken() {
  return localStorage.getItem(KEY_REFRESH);
}

export function setTokens({ accessToken, refreshToken }) {
  _accessToken = accessToken;
  localStorage.setItem(KEY_ACCESS, accessToken);
  if (refreshToken !== undefined) {
    localStorage.setItem(KEY_REFRESH, refreshToken);
  }
}

export function clear() {
  _accessToken = null;
  localStorage.removeItem(KEY_ACCESS);
  localStorage.removeItem(KEY_REFRESH);
}

export function hasRefresh() {
  return Boolean(localStorage.getItem(KEY_REFRESH));
}
