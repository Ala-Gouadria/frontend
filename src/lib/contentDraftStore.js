import { useState, useEffect } from 'react'

/**
 * Tiny shared store for the in-progress social post draft, so the independent
 * Caption/Image generation cards can hand their output to the Social Media
 * Publishing card's preview (the cards are separate nodes with no common
 * parent to thread props through). Same subscribe/notify pattern as the
 * analytics cache.
 */
let draft = { caption: null, imageUrl: null }
const listeners = new Set()

function emit() {
  for (const l of listeners) l(draft)
}

export function setDraftCaption(caption) {
  draft = { ...draft, caption }
  emit()
}

export function setDraftImage(imageUrl) {
  draft = { ...draft, imageUrl }
  emit()
}

export function getDraft() {
  return draft
}

/** Subscribe a component to the current draft caption + image. */
export function useContentDraft() {
  const [state, setState] = useState(draft)
  useEffect(() => {
    const listener = (next) => setState(next)
    listeners.add(listener)
    setState(draft) // sync any value set before mount
    return () => listeners.delete(listener)
  }, [])
  return state
}
