import { useState } from 'react'
import './restPassword.css'
import noraLoginLogo from '../../assets/logo/Nora-Login-Logo.png'
import loginBackground from '../../assets/background/Login-background.jpg'
import * as authApi from '../../api/auth.js'

function PasswordInput({ value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="auth-password-field">
      <input
        value={value}
        onChange={onChange}
        type={visible ? 'text' : 'password'}
        placeholder="Enter your password"
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

export default function RestPassword({ onLogin }) {
  const [step, setStep] = useState('forgot') // 'forgot' | 'sent' | 'reset'
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleForgot = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword({ email: email.trim() })
      setStep('sent')
    } catch (err) {
      setError(err.message ?? 'Request failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (event) => {
    event.preventDefault()

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setLoading(true)
    try {
      await authApi.resetPassword({ token: token.trim(), newPassword: password })
      onLogin?.()
    } catch (err) {
      setError(err.message ?? 'Reset failed. Check your token and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'sent') {
    return (
      <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
        <div className="auth-panel auth-panel--reset">
          <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
          <h1>Check your email</h1>
          <p className="auth-subtitle">
            A password reset link has been sent to <strong>{email}</strong>. Copy the token from the
            link and enter it below.
          </p>
          <button
            type="button"
            className="auth-submit-btn"
            style={{ marginTop: '1rem' }}
            onClick={() => setStep('reset')}
          >
            <span>Enter reset token</span>
            <i aria-hidden="true" />
          </button>
          <p className="auth-footer-copy">
            <button type="button" onClick={onLogin}>Back to login</button>
          </p>
        </div>
      </main>
    )
  }

  if (step === 'reset') {
    return (
      <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
        <form className="auth-panel auth-panel--reset" onSubmit={handleReset}>
          <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
          <h1>Create new password</h1>

          <label className="auth-field">
            <span>Reset token</span>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              type="text"
              placeholder="Paste token from email"
              autoComplete="off"
            />
          </label>

          <label className="auth-field">
            <span>New password</span>
            <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
          </label>

          <label className="auth-field">
            <span>Confirm password</span>
            <PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
          </label>

          <p className="auth-helper">Must be at least 8 characters.</p>
          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            <span>{loading ? 'Resetting…' : 'Set new password'}</span>
            <i aria-hidden="true" />
          </button>
          <p className="auth-footer-copy">
            <button type="button" onClick={onLogin}>Back to login</button>
          </p>
        </form>
      </main>
    )
  }

  // step === 'forgot'
  return (
    <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <form className="auth-panel auth-panel--reset" onSubmit={handleForgot}>
        <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
        <h1>Reset your password</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>

        <label className="auth-field">
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="eg. johnfrans@gmail.com"
            autoComplete="email"
          />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          <span>{loading ? 'Sending…' : 'Send reset link'}</span>
          <i aria-hidden="true" />
        </button>

        <p className="auth-footer-copy">
          <button type="button" onClick={onLogin}>Back to login</button>
        </p>
      </form>
    </main>
  )
}
