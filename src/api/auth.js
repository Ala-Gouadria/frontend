import { post } from './client.js';
import * as tokenStore from './tokenStore.js';

export async function login({ email, password }) {
  const data = await post('/api/v1/auth/login', { email, password });
  tokenStore.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

// Hybrid Auth0 flow: exchange the Auth0 ID token for a NORA session (the backend
// verifies it via JWKS, enforces email_verified, provisions the user, and mints
// the existing NORA access/refresh tokens). See AUTH0_INTEGRATION_PLAN.md.
export async function exchangeAuth0Token(idToken) {
  const data = await post('/api/v1/auth/auth0-exchange', { idToken });
  tokenStore.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function register({ email, password, firstName, lastName, companyName }) {
  const data = await post('/api/v1/auth/register', { email, password, firstName, lastName, companyName });
  tokenStore.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function refresh() {
  const data = await post('/api/v1/auth/refresh', { refreshToken: tokenStore.getRefreshToken() });
  tokenStore.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}

export async function logout() {
  try {
    await post('/api/v1/auth/logout');
  } finally {
    tokenStore.clear();
  }
}

export async function forgotPassword({ email }) {
  return post('/api/v1/auth/forgot-password', { email });
}

export async function resetPassword({ token, newPassword }) {
  return post('/api/v1/auth/reset-password', { token, newPassword });
}
