import { useState } from 'react'
import './restPassword.css'
import noraLoginLogo from '../../assets/logo/Nora-Login-Logo.png'
import loginBackground from '../../assets/background/Login-background.jpg'

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
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
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
    onLogin?.()
  }

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <form className="auth-panel auth-panel--reset" onSubmit={handleSubmit}>
        <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
        <h1>Create new password</h1>

        <label className="auth-field">
          <span>Enter new password</span>
          <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
        </label>

        <label className="auth-field">
          <span>Confirm Password</span>
          <PasswordInput value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
        </label>

        <p className="auth-helper">Must be at least 8 characters.</p>
        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" className="auth-submit-btn">
          <span>Log in</span>
          <i aria-hidden="true" />
        </button>
      </form>
    </main>
  )
}

