import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth0 } from '@auth0/auth0-react'
import * as tokenStore from '../api/tokenStore.js'
import * as authApi from '../api/auth.js'
import { onboardingFlowApi } from '../api/onboardingFlowApi'
import Login from '../pages/auth/Login'
import RestPassword from '../pages/auth/restPassword'
import Signup from '../pages/auth/Signup'
import IntelligenceMap from '../pages/intelligence/IntelligenceMap'
import NoraVoice from '../components/nora/NoraVoice'
import Integrate from '../pages/integrate/Integrate'
import OnboardingFlow from '../pages/onboarding/OnboardingFlow'
import Setup from '../pages/onboarding/Setup'
import ReportsPage from '../pages/reports/ReportsPage'
import EventsPage from '../pages/events/EventsPage'
import MemoryPage from '../pages/memory/MemoryPage'
import PricingPage from '../pages/pricing/PricingPage'
import Settings from '../pages/settings/Settings'
import Integrations from '../pages/settings/Integrations'
import Team from '../pages/settings/Team'
import Terms from '../pages/settings/Terms'
import Notifications from '../pages/notifications/Notifications'
import Assets from '../pages/assets/Assets'
import ActivityLog from '../pages/activityLog/activityLog'
import AnalyticsCardsPreview from '../pages/analyticsCardsPreview/AnalyticsCardsPreview'
import NoraChatPage from '../pages/chatnora/norachat'
import GlobalVoiceAssistant from '../components/nora/GlobalVoiceAssistant'
import { markLoggedIn } from '../components/nora/voiceGreeting'
import '../styles/responsive-overrides.css'

/* global __APP_SESSION__ */

const STORAGE_KEYS = {
  authenticated: 'nora:isAuthenticated',
  setupComplete: 'nora:setupComplete',
  view: 'nora:view',
}

const AUTH0_ENABLED = Boolean(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID)

// Local email/password form is hidden by default (Auth0 is primary); ?local=1 reveals it.
function isLocalAuthRequest() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('local') === '1'
}

function AuthLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0A0B0F',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      Signing you in…
    </div>
  )
}

function isAnalyticsCardsPreviewRequest() {
  if (typeof window === 'undefined') {
    return false
  }

  const params = new URLSearchParams(window.location.search)
  return params.get('preview') === 'analytics-cards' || window.location.hash === '#analytics-cards'
}

// Clear storage if the Vite server was restarted
if (typeof window !== 'undefined') {
  try {
    if (typeof __APP_SESSION__ !== 'undefined') {
      const currentSession = String(__APP_SESSION__)
      const storedSession = window.localStorage.getItem('nora:appSession')
      
      if (storedSession !== currentSession) {
        window.localStorage.removeItem(STORAGE_KEYS.authenticated)
        window.localStorage.removeItem(STORAGE_KEYS.setupComplete)
        window.localStorage.removeItem(STORAGE_KEYS.view)
        window.localStorage.setItem('nora:appSession', currentSession)
      }
    }
  } catch {
    // Ignore errors
  }
}

function readStoredFlag(key) {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(key) === 'true'
}

function readStoredView() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEYS.view)
}

function writeStorage(key, value) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value)
  }
}

export default function App() {
  const { i18n } = useTranslation()
  const {
    isAuthenticated: auth0Authenticated,
    isLoading: auth0Loading,
    getAccessTokenSilently,
    getIdTokenClaims,
    loginWithRedirect,
  } = useAuth0()

  // Sync lang, dir and RTL class whenever the language changes.
  // dir="rtl" mirrors the whole layout (flex rows, text alignment, and the
  // logical-property offsets that position content beside the nav rail).
  useEffect(() => {
    const isArabic = i18n.language?.startsWith('ar')
    document.documentElement.lang = i18n.language || 'en'
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    document.documentElement.classList.toggle('is-rtl', isArabic)
  }, [i18n.language])

  const previewAnalyticsCards = isAnalyticsCardsPreviewRequest()
  const setupComplete = readStoredFlag(STORAGE_KEYS.setupComplete)
  const storedView = readStoredView()
  // Returning from the Facebook OAuth callback (redirect to /?fb=connected|error)
  // → open the Integrate page, which reads ?fb to show the result + refresh status.
  const fbReturn =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fb')
  const [isAuthenticated, setIsAuthenticated] = useState(
    previewAnalyticsCards || tokenStore.getAccessToken() !== null || setupComplete,
  )
  const [authView, setAuthView] = useState('login')
  const [bootstrapping, setBootstrapping] = useState(false)
  const [authError, setAuthError] = useState('')
  const [termsInitialSection, setTermsInitialSection] = useState('privacy-policy')
  const [view, setView] = useState(
    previewAnalyticsCards
      ? 'analytics-cards-preview'
      : !setupComplete
        ? 'setup'
        : fbReturn
          ? 'integrate'
          : storedView || 'voice',
  )

  // On mount: if only the refresh token survived a hard reload, attempt silent refresh
  useEffect(() => {
    if (!isAuthenticated && tokenStore.hasRefresh() && tokenStore.getAccessToken() === null) {
      authApi.refresh().then(() => {
        setIsAuthenticated(true)
      }).catch(() => {
        tokenStore.clear()
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auth0 → NORA session exchange (hybrid). Once Universal Login returns and the
  // Auth0 SDK has a session, swap the Auth0 token for the app's own JWT, then enter.
  useEffect(() => {
    if (!AUTH0_ENABLED || !auth0Authenticated) return
    if (tokenStore.getAccessToken() !== null) return
    let cancelled = false
    setBootstrapping(true)
    ;(async () => {
      try {
        // Refresh the Auth0 session so the cached ID token is current, then hand
        // the raw ID token to the backend exchange endpoint.
        await getAccessTokenSilently().catch(() => {})
        const claims = await getIdTokenClaims()
        const idToken = claims?.__raw
        if (!idToken) throw new Error('No Auth0 ID token available')
        await authApi.exchangeAuth0Token(idToken)
        if (!cancelled) {
          setAuthError('')
          await enterApp()
        }
      } catch (err) {
        if (!cancelled) {
          setAuthError(
            err?.code === 'EMAIL_NOT_VERIFIED'
              ? 'Please verify your email, then sign in again.'
              : err?.message ?? 'Sign-in failed. Please try again.',
          )
        }
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [auth0Authenticated, getAccessTokenSilently]) // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for auth:logout emitted by client.js on double-401
  useEffect(() => {
    const handleForceLogout = () => {
      setIsAuthenticated(false)
      setAuthView('login')
    }
    window.addEventListener('auth:logout', handleForceLogout)
    return () => window.removeEventListener('auth:logout', handleForceLogout)
  }, [])

  const navigateTo = (nextView) => {
    setView(nextView)

    if (nextView !== 'setup' && nextView !== 'analytics-cards-preview') {
      writeStorage(STORAGE_KEYS.view, nextView)
    }
  }

  const handleNavigation = (id) => {
    if (id === 'layers') {
      navigateTo('reports')
      return
    }

    if (id === 'events') {
      navigateTo('events')
      return
    }

    if (id === 'memory') {
      navigateTo('memory')
      return
    }

    if (id === 'pricing') {
      navigateTo('pricing')
      return
    }

    if (id === 'connect') {
      navigateTo('integrate')
      return
    }

    if (id === 'database') {
      navigateTo('onboarding')
      return
    }

    if (id === 'settings') {
      navigateTo('settings')
      return
    }

    if (id === 'settings-integrations') {
      navigateTo('settings-integrations')
      return
    }

    if (id === 'settings-team') {
      navigateTo('settings-team')
      return
    }

    if (id === 'settings-terms') {
      setTermsInitialSection('terms-conditions')
      navigateTo('settings-terms')
      return
    }

    if (id === 'settings-privacy') {
      setTermsInitialSection('privacy-policy')
      navigateTo('settings-terms')
      return
    }

    if (id === 'notifications') {
      navigateTo('notifications')
      return
    }

    if (id === 'album') {
      navigateTo('assets')
      return
    }

    if (id === 'chat') {
      navigateTo('chat')
      return
    }

    if (id === 'activityLog') {
      navigateTo('activity-log')
      return
    }

    if (id === 'stars') {
      navigateTo('voice')
      return
    }

    if (id === 'stars-map') {
      navigateTo('map')
      return
    }

    if (id === 'dashboard') {
      navigateTo('dashboard')
    }
  }

  const enterApp = async () => {
    setIsAuthenticated(true)
    // Decide the landing view from the SERVER's onboarding status, not just the
    // local flag — so a returning user whose profile is already complete skips
    // Setup even if this browser's localStorage was cleared. Fall back to the
    // local flag if the status check fails.
    let complete = readStoredFlag(STORAGE_KEYS.setupComplete)
    try {
      if (await onboardingFlowApi.isOnboardingComplete()) {
        complete = true
        writeStorage(STORAGE_KEYS.setupComplete, 'true')
      }
    } catch {
      // keep the local flag value
    }
    // Returning user whose business is already set up → Nora greets on entry.
    if (complete) markLoggedIn()
    navigateTo(complete ? readStoredView() || 'voice' : 'setup')
  }

  const completeSetup = () => {
    writeStorage(STORAGE_KEYS.authenticated, 'true')
    writeStorage(STORAGE_KEYS.setupComplete, 'true')
    markLoggedIn()
    navigateTo('voice')
  }

  if (!isAuthenticated) {
    if (AUTH0_ENABLED && (auth0Loading || bootstrapping)) {
      return <AuthLoading />
    }

    const localMode = isLocalAuthRequest() || !AUTH0_ENABLED
    const auth0Login = AUTH0_ENABLED
      ? (authorizationParams) =>
          loginWithRedirect(authorizationParams ? { authorizationParams } : undefined)
      : null

    if (authView === 'signup') {
      return (
        <Signup
          onSuccess={() => setAuthView('login')}
          onLogin={() => setAuthView('login')}
          onAuth0Login={auth0Login}
          localMode={localMode}
          authError={authError}
        />
      )
    }

    if (authView === 'reset-password') {
      return <RestPassword onLogin={() => setAuthView('login')} />
    }

    return (
      <Login
        onSuccess={enterApp}
        onSignup={() => setAuthView('signup')}
        onResetPassword={() => setAuthView('reset-password')}
        onAuth0Login={auth0Login}
        localMode={localMode}
        authError={authError}
      />
    )
  }

  const renderView = () => {
  if (view === 'settings') {
    return <Settings onNavigate={handleNavigation} />
  }

  if (view === 'settings-integrations') {
    return <Integrations onNavigate={handleNavigation} />
  }

  if (view === 'settings-team') {
    return <Team onNavigate={handleNavigation} />
  }

  if (view === 'settings-terms') {
    return <Terms initialSection={termsInitialSection} onNavigate={handleNavigation} />
  }

  if (view === 'notifications') {
    return <Notifications onNavigate={handleNavigation} />
  }

  if (view === 'assets') {
    return <Assets onNavigate={handleNavigation} />
  }

  if (view === 'activity-log') {
    return <ActivityLog onNavigate={handleNavigation} />
  }

  if (view === 'chat') {
    return <NoraChatPage onNavigate={handleNavigation} />
  }

  if (view === 'integrate') {
    return <Integrate activeNavId="connect" onNavigate={handleNavigation} />
  }

  if (view === 'onboarding') {
    return <OnboardingFlow activeNavId="database" onNavigate={handleNavigation} />
  }

  if (view === 'reports') {
    return <ReportsPage onNavigate={handleNavigation} />
  }

  if (view === 'events') {
    return <EventsPage onNavigate={handleNavigation} />
  }

  if (view === 'memory') {
    return <MemoryPage onNavigate={handleNavigation} />
  }

  if (view === 'pricing') {
    return <PricingPage onNavigate={handleNavigation} />
  }

  if (view === 'analytics-cards-preview') {
    return <AnalyticsCardsPreview />
  }

  if (view === 'setup') {
    return <Setup onComplete={completeSetup} />
  }

  if (view === 'voice') {
    return <NoraVoice activeNavId="stars" onNavigate={handleNavigation} globalVoiceActive />
  }

  if (view === 'dashboard') {
    return <IntelligenceMap activeNavId="stars" onNavigate={handleNavigation} autoReveal />
  }

  return <IntelligenceMap activeNavId="stars" onNavigate={handleNavigation} />
  }

  // The persistent, app-wide voice assistant ("Hey Nora") rides above every
  // authenticated view so it survives navigation, speaks from anywhere, and
  // runs UI actions — including the orb home and the dashboard, so voice is
  // always-listening everywhere (no button press). On the orb home the orb's
  // own tap-mic is suppressed (globalVoiceActive) so there's a single mic.
  const showVoiceAssistant =
    isAuthenticated &&
    view !== 'setup' &&
    view !== 'analytics-cards-preview'

  return (
    <>
      {renderView()}
      {showVoiceAssistant && (
        <GlobalVoiceAssistant onNavigate={handleNavigation} wakeless={view === 'voice'} />
      )}
    </>
  )
}
