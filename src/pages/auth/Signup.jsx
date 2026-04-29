import { useState } from 'react'
import './Signup.css'
import noraLoginLogo from '../../assets/logo/Nora-Login-Logo.png'
import loginBackground from '../../assets/background/Login-background.jpg'

function PasswordInput({ value, onChange, placeholder = 'Enter your password', autoComplete }) {
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
  return (
    <button type="button" className="auth-social-btn">
      <span className={`auth-social-mark auth-social-mark--${provider.toLowerCase()}`}>
        {provider === 'Google' ? 'G' : 'A'}
      </span>
      <span>Continue with {provider}</span>
    </button>
  )
}

export default function Signup({ onSuccess, onLogin }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    onSuccess?.()
  }

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <form className="auth-panel auth-panel--signup" onSubmit={handleSubmit}>
        <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
        <h1>Create your account</h1>
        <p className="auth-subtitle">Welcome! Please fill in the details to get started.</p>

        <div className="auth-social-row">
          <SocialButton provider="Google" />
          <SocialButton provider="Apple" />
        </div>

        <div className="auth-divider">
          <span />
          <strong>Or</strong>
          <span />
        </div>

        <div className="auth-name-grid">
          <label className="auth-field">
            <span>First Name</span>
            <input value={form.firstName} onChange={updateField('firstName')} placeholder="eg. John" autoComplete="given-name" />
          </label>

          <label className="auth-field">
            <span>Last name</span>
            <input value={form.lastName} onChange={updateField('lastName')} placeholder="eg. Frans" autoComplete="family-name" />
          </label>
        </div>

        <label className="auth-field">
          <span>Email</span>
          <input value={form.email} onChange={updateField('email')} type="email" placeholder="eg. johnfrans@gmail.com" autoComplete="email" />
        </label>

        <label className="auth-field">
          <span>Create a Password</span>
          <PasswordInput value={form.password} onChange={updateField('password')} autoComplete="new-password" />
        </label>

        <label className="auth-field">
          <span>Confirm Password</span>
          <PasswordInput value={form.confirmPassword} onChange={updateField('confirmPassword')} autoComplete="new-password" />
        </label>

        <p className="auth-helper">Must be at least 8 characters.</p>
        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" className="auth-submit-btn">
          <span>Sign Up</span>
          <i aria-hidden="true" />
        </button>

        <p className="auth-footer-copy">
          Already have an account? <button type="button" onClick={onLogin}>Log in</button>
        </p>
      </form>
    </main>
  )
}
