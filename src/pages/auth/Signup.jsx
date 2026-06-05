import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Signup.css'
import noraLoginLogo from '../../assets/logo/Nora-Login-Logo.png'
import loginBackground from '../../assets/background/Login-background.jpg'
import * as authApi from '../../api/auth.js'
import PillButton from '../../components/pages-parts/PillButton'

function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth-password-field">
      <input
        value={value}
        onChange={onChange}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
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

export default function Signup({ onSuccess, onLogin, onAuth0Login, localMode = false, authError = '' }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password.length < 8) {
      setError(t('signup.errorMinLength'))
      return
    }

    if (form.password !== form.confirmPassword) {
      setError(t('signup.errorMismatch'))
      return
    }

    setError('')
    setLoading(true)
    try {
      await authApi.register({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        companyName: form.companyName.trim(),
      })
      onSuccess?.()
    } catch (err) {
      if (err.code === 'CONFLICT') {
        setError(t('signup.errorConflict'))
      } else {
        setError(err.message ?? t('signup.errorFailed'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <form className="auth-panel auth-panel--signup" onSubmit={handleSubmit}>
        <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
        <h1>{t('signup.title')}</h1>
        <p className="auth-subtitle">{t('signup.subtitle')}</p>

        {authError ? <p className="auth-error">{authError}</p> : null}

        {onAuth0Login ? (
          <div className="auth-social-row" style={{ flexDirection: 'column', gap: '12px' }}>
            <PillButton
              type="button"
              width="100%"
              height="48px"
              variant="primary"
              onClick={() => onAuth0Login({ screen_hint: 'signup' })}
            >
              {t('signup.continueWithAuth0', 'Sign up with Auth0')}
            </PillButton>
            <button
              type="button"
              className="auth-social-btn"
              onClick={() => onAuth0Login({ connection: 'google-oauth2', screen_hint: 'signup' })}
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
                <strong>{t('signup.or')}</strong>
                <span />
              </div>
            ) : null}

            <div className="auth-name-grid">
              <label className="auth-field">
                <span>{t('signup.firstName')}</span>
                <input value={form.firstName} onChange={updateField('firstName')} placeholder="eg. John" autoComplete="given-name" />
              </label>

              <label className="auth-field">
                <span>{t('signup.lastName')}</span>
                <input value={form.lastName} onChange={updateField('lastName')} placeholder="eg. Frans" autoComplete="family-name" />
              </label>
            </div>

            <label className="auth-field">
              <span>{t('signup.companyName')}</span>
              <input value={form.companyName} onChange={updateField('companyName')} placeholder="eg. Acme Inc." autoComplete="organization" />
            </label>

            <label className="auth-field">
              <span>{t('signup.email')}</span>
              <input value={form.email} onChange={updateField('email')} type="email" placeholder="eg. johnfrans@gmail.com" autoComplete="email" />
            </label>

            <label className="auth-field">
              <span>{t('signup.createPassword')}</span>
              <PasswordInput value={form.password} onChange={updateField('password')} autoComplete="new-password" />
            </label>

            <label className="auth-field">
              <span>{t('signup.confirmPassword')}</span>
              <PasswordInput value={form.confirmPassword} onChange={updateField('confirmPassword')} autoComplete="new-password" />
            </label>

            <p className="auth-helper">{t('signup.passwordHint')}</p>
            {error ? <p className="auth-error">{error}</p> : null}

            <PillButton type="submit" width="100%" height="48px" variant="primary" disabled={loading}>
              {loading ? t('signup.creating') : t('signup.submit')}
            </PillButton>
          </>
        ) : null}

        <p className="auth-footer-copy">
          {t('signup.alreadyHaveAccount')} <button type="button" onClick={onLogin}>{t('signup.logIn')}</button>
        </p>
      </form>
    </main>
  )
}
