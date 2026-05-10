import { useState } from 'react'
import './Login.css'
import noraLoginLogo from '../../assets/logo/Nora-Login-Logo.png'
import loginBackground from '../../assets/background/Login-background.jpg'

const DEMO_ACCOUNT = {
  email: 'demo@nora.ai',
  password: 'demo1234',
}

function PasswordInput({ value, onChange, placeholder = 'Enter your password' }) {
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

/* ── Official Google coloured G ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

/* ── Apple silhouette icon ── */
function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 814 1000" aria-hidden="true" fill="#1a1a1a">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46.7 790 0 663.8 0 542.8c0-209.3 131.9-319.6 261.3-319.6 66.4 0 121.5 43.4 163.4 43.4 40 0 103.1-46 177.8-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  )
}

function SocialButton({ provider }) {
  return (
    <button type="button" className="auth-social-btn">
      <span className="auth-social-mark">
        {provider === 'Google' ? <GoogleIcon /> : <AppleIcon />}
      </span>
      <span>Continue with {provider}</span>
    </button>
  )
}

export default function Login({ onSuccess, onSignup, onResetPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
      setError('')
      onSuccess?.()
      return
    }

    setError('Invalid email or password.')
  }

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${loginBackground})` }}>
      <form className="auth-panel auth-panel--login" onSubmit={handleSubmit}>
        <img src={noraLoginLogo} alt="Nora" className="auth-logo" />
        <h1>Sign in to automate your business</h1>
        <p className="auth-subtitle">Welcome back! Please sign in to continue</p>

        <div className="auth-social-row">
          <SocialButton provider="Google" />
          <SocialButton provider="Apple" />
        </div>

        <div className="auth-divider">
          <span />
          <strong>Or</strong>
          <span />
        </div>

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

        <label className="auth-field">
          <span>Password</span>
          <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        <button type="button" className="auth-text-link auth-forgot-link" onClick={onResetPassword}>
          Forgot password?
        </button>

        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" className="auth-submit-btn">
          <span>Sign in</span>
          <i aria-hidden="true" />
        </button>


        <p className="auth-footer-copy">
          Don't have an account? <button type="button" onClick={onSignup}>Sign Up</button>
        </p>
      </form>
    </main>
  )
}