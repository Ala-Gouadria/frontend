import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import * as tokenStore from '../api/tokenStore.js'
import * as authApi from '../api/auth.js'
import Login from '../pages/auth/Login'
import RestPassword from '../pages/auth/restPassword'
import Signup from '../pages/auth/Signup'
import IntelligenceMap from '../pages/intelligence/IntelligenceMap'
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
import '../styles/responsive-overrides.css'

/* global __APP_SESSION__ */

const STORAGE_KEYS = {
  authenticated: 'nora:isAuthenticated',
  setupComplete: 'nora:setupComplete',
  view: 'nora:view',
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    previewAnalyticsCards || tokenStore.getAccessToken() !== null || setupComplete,
  )
  const [authView, setAuthView] = useState('login')
  const [termsInitialSection, setTermsInitialSection] = useState('privacy-policy')
  const [view, setView] = useState(
    previewAnalyticsCards
      ? 'analytics-cards-preview'
      : setupComplete
        ? storedView || 'map'
        : 'setup',
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
      navigateTo('map')
    }
  }

  const enterApp = () => {
    setIsAuthenticated(true)
    navigateTo(readStoredFlag(STORAGE_KEYS.setupComplete) ? readStoredView() || 'map' : 'setup')
  }

  const completeSetup = () => {
    writeStorage(STORAGE_KEYS.authenticated, 'true')
    writeStorage(STORAGE_KEYS.setupComplete, 'true')
    navigateTo('map')
  }

  if (!isAuthenticated) {
    if (authView === 'signup') {
      return <Signup onSuccess={() => setAuthView('login')} onLogin={() => setAuthView('login')} />
    }

    if (authView === 'reset-password') {
      return <RestPassword onLogin={() => setAuthView('login')} />
    }

    return (
      <Login
        onSuccess={enterApp}
        onSignup={() => setAuthView('signup')}
        onResetPassword={() => setAuthView('reset-password')}
      />
    )
  }

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

  return <IntelligenceMap activeNavId="stars" onNavigate={handleNavigation} />
}
