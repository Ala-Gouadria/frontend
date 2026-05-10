import { useState } from 'react'
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
import Notifications from '../pages/notifications/Notifications'
import Assets from '../pages/assets/Assets'
import ActivityLog from '../pages/activityLog/activityLog'
import AnalyticsCardsPreview from '../pages/analyticsCardsPreview/AnalyticsCardsPreview'

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

function readStoredFlag(key) {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(key) === 'true'
}

function readStoredView() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(STORAGE_KEYS.view)
}

function writeStorage(key, value) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value)
  }
}

export default function App() {
  const previewAnalyticsCards = isAnalyticsCardsPreviewRequest()
  const setupComplete = readStoredFlag(STORAGE_KEYS.setupComplete)
  const storedView = readStoredView()
  const [isAuthenticated, setIsAuthenticated] = useState(
    previewAnalyticsCards || readStoredFlag(STORAGE_KEYS.authenticated) || setupComplete,
  )
  const [authView, setAuthView] = useState('login')
  const [view, setView] = useState(
    previewAnalyticsCards
      ? 'analytics-cards-preview'
      : setupComplete
        ? storedView || 'map'
        : 'setup',
  )

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

    if (id === 'notifications') {
      navigateTo('notifications')
      return
    }

    if (id === 'album') {
      navigateTo('assets')
      return
    }

    if (id === 'chat') {
      navigateTo('activity-log')
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
    writeStorage(STORAGE_KEYS.authenticated, 'true')
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
      return <Signup onSuccess={enterApp} onLogin={() => setAuthView('login')} />
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

  if (view === 'notifications') {
    return <Notifications onNavigate={handleNavigation} />
  }

  if (view === 'assets') {
    return <Assets onNavigate={handleNavigation} />
  }

  if (view === 'activity-log') {
    return <ActivityLog onNavigate={handleNavigation} />
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
