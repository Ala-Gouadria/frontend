import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './styles/index.css'
import './i18n'
import App from './app/App.jsx'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE

if (!auth0Domain || !auth0ClientId) {
  // Auth0 not configured — the app still runs; only the local (?local=1) login path works.
  console.warn('[auth0] VITE_AUTH0_DOMAIN / VITE_AUTH0_CLIENT_ID not set — Auth0 login disabled, local fallback only.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Domain ?? ''}
      clientId={auth0ClientId ?? ''}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined,
        ...(auth0Audience ? { audience: auth0Audience } : {}),
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
