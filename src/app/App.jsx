import { useState } from 'react'
import Login from '../pages/auth/Login'
import RestPassword from '../pages/auth/restPassword'
import Signup from '../pages/auth/Signup'
import IntelligenceMap from '../pages/intelligence/IntelligenceMap'
import Integrate from '../pages/integrate/Integrate'
import OnboardingFlow from '../pages/onboarding/OnboardingFlow'
import Setup from '../pages/onboarding/Setup'
import ReportsPage from '../pages/reports/ReportsPage'
import Settings from '../pages/settings/Settings'
import Integrations from '../pages/settings/Integrations'
import Team from '../pages/settings/Team'
import Notifications from '../pages/notifications/Notifications'
import Assets from '../pages/assets/Assets'
import ActivityLog from '../pages/activityLog/activityLog'
import AnalyticsCardsPreview from '../pages/analyticsCardsPreview/AnalyticsCardsPreview'

function isAnalyticsCardsPreviewRequest() {
  if (typeof window === 'undefined') {
    return false
  }

  const params = new URLSearchParams(window.location.search)
  return params.get('preview') === 'analytics-cards' || window.location.hash === '#analytics-cards'
}

export default function App() {
  const previewAnalyticsCards = isAnalyticsCardsPreviewRequest()
  const [isAuthenticated, setIsAuthenticated] = useState(previewAnalyticsCards)
  const [authView, setAuthView] = useState('login')
  const [view, setView] = useState(previewAnalyticsCards ? 'analytics-cards-preview' : 'setup')

  const handleNavigation = (id) => {
    if (id === 'layers') {
      setView('reports')
      return
    }

    if (id === 'connect') {
      setView('integrate')
      return
    }

    if (id === 'database') {
      setView('onboarding')
      return
    }

    if (id === 'settings') {
      setView('settings')
      return
    }

    if (id === 'settings-integrations') {
      setView('settings-integrations')
      return
    }

    if (id === 'settings-team') {
      setView('settings-team')
      return
    }

    if (id === 'notifications') {
      setView('notifications')
      return
    }

    if (id === 'album') {
      setView('assets')
      return
    }

    if (id === 'chat') {
      setView('activity-log')
      return
    }

    if (id === 'stars') {
      setView('map')
    }
  }

  const enterApp = () => {
    setIsAuthenticated(true)
    setView('setup')
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

  if (view === 'analytics-cards-preview') {
    return <AnalyticsCardsPreview />
  }

  if (view === 'setup') {
    return <Setup onComplete={() => setView('map')} />
  }

  return <IntelligenceMap activeNavId="stars" onNavigate={handleNavigation} />
}
