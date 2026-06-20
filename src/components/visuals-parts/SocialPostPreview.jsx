import { useState } from 'react'
import './SocialPostPreview.css'
import { NoraImageLoader } from './NoraImageLoader'

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

export function SocialPostPreview({
  accountName,
  accountSub,
  accountSrc,
  postSrc,
  caption,
  className = '',
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const showMedia = Boolean(postSrc) && !error

  return (
    <article className={classNames('social-post-preview', className)}>
      <header className="social-post-preview__header">
        <span className="social-post-preview__avatar">
          {accountSrc ? (
            <img src={accountSrc} alt={accountName} onError={(event) => { event.currentTarget.style.display = 'none' }} />
          ) : (
            <span>{accountName?.[0] ?? 'X'}</span>
          )}
        </span>
        <span>
          <strong className="social-post-preview__name">{accountName}</strong>
          <span className="social-post-preview__sub">{accountSub}</span>
        </span>
      </header>

      <div className="social-post-preview__media">
        {(!loaded || error || !postSrc) && <NoraImageLoader className="social-post-preview__loader" />}
        {showMedia && (
          <img
            src={postSrc}
            alt="Post preview"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{ opacity: loaded ? 1 : 0 }}
          />
        )}
      </div>

      <p className="social-post-preview__caption">{caption}</p>

      <footer className="social-post-preview__actions" aria-hidden="true">
        <span className="social-post-preview__icon social-post-preview__icon--heart" />
        <span className="social-post-preview__icon social-post-preview__icon--comment" />
        <span className="social-post-preview__icon social-post-preview__icon--send" />
        <span className="social-post-preview__icon social-post-preview__icon--bookmark" />
      </footer>
    </article>
  )
}

export default SocialPostPreview
