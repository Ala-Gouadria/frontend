import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Login.css'
import noraLoginLogo from '../../assets/logo/Nora-Login-Logo.png'
import loginBackground from '../../assets/background/Login-background.jpg'
import * as authApi from '../../api/auth.js'
import PillButton from '../../components/pages-parts/PillButton'

function PasswordInput({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth-password-field">
      <input
        value={value}
        onChange={onChange}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete="current-password"
      />
      <button
        type="button"
        className="auth-eye-btn"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 12s3.2-5.5 9-5.5S21 12 21 12s-3.2 5.5-9 5.5S3 12 3 12Z" />
          <path d="M15 12a3 3 0 0 1-4.9 2.3M9.4 9.4A3 3 0 0 1 14.6 12" />
          <path d="M4 4l16 16" />
        </svg>
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}

export default function Login({ onSuccess, onSignup, onResetPassword, onAuth0Login, localMode = false, authError = '' }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.login({ email: email.trim(), password })
      onSuccess?.()
    } catch (err) {
      if (err.isAuth?.()) {
        setError(t('login.errorWrongCredentials'))
      } else {
        setError(err.message ?? t('login.errorFailed'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <form className="auth-panel auth-panel--login" onSubmit={handleSubmit}>
        <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
        <h1>{t('login.title')}</h1>
        <p className="auth-subtitle">{t('login.subtitle')}</p>

        {authError ? <p className="auth-error">{authError}</p> : null}

        {onAuth0Login ? (
          <div className="auth-social-row" style={{ flexDirection: 'column', gap: '12px' }}>
            <PillButton type="button" width="100%" height="48px" variant="primary" onClick={() => onAuth0Login()}>
              {t('login.continueWithAuth0', 'Continue with Auth0')}
            </PillButton>
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => onAuth0Login({ connection: 'google-oauth2' })}
            >
              <span className="auth-social-mark"><GoogleIcon /></span>
              <span>{t('login.continueWith', { provider: 'Google' })}</span>
            </button>
          </div>
        ) : null}

        {localMode ? (
          <>
            {onAuth0Login ? (
              <div className="auth-divider">
                <span />
                <strong>{t('login.or')}</strong>
                <span />
              </div>
            ) : null}

            <label className="auth-field">
              <span>{t('login.email')}</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="eg. johnfrans@gmail.com"
                autoComplete="email"
              />
            </label>

            <label className="auth-field">
              <span>{t('login.password')}</span>
              <PasswordInput
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('login.password')}
              />
            </label>

            <button type="button" className="auth-text-link auth-forgot-link" onClick={onResetPassword}>
              {t('login.forgotPassword')}
            </button>

            {error ? <p className="auth-error">{error}</p> : null}

            <PillButton type="submit" width="100%" height="48px" variant="primary" disabled={loading}>
              {loading ? t('login.signingIn') : t('login.signIn')}
            </PillButton>
          </>
        ) : null}

        <p className="auth-footer-copy">
          {t('login.noAccount')} <button type="button" onClick={onSignup}>{t('login.signUp')}</button>
        </p>
      </form>
    </main>
  )
}
