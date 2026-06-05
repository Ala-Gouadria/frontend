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

function SocialButton({ provider }) {
  const { t } = useTranslation()
  return (
    <button type="button" className="auth-social-btn">
      <span className={`auth-social-mark auth-social-mark--${provider.toLowerCase()}`}>
        {provider === 'Google' ? 'G' : 'A'}
      </span>
      <span>{t('login.continueWith', { provider })}</span>
    </button>
  )
}

export default function Signup({ onSuccess, onLogin }) {
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

        <div className="auth-social-row">
          <SocialButton provider="Google" />
          <SocialButton provider="Apple" />
        </div>

        <div className="auth-divider">
          <span />
          <strong>{t('signup.or')}</strong>
          <span />
        </div>

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

        <p className="auth-footer-copy">
          {t('signup.alreadyHaveAccount')} <button type="button" onClick={onLogin}>{t('signup.logIn')}</button>
        </p>
      </form>
    </main>
  )
}
