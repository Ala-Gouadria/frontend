// Spoken login greeting. When the user signs in and their business is already
// set up, Nora greets them once: "Hey boss, how can I help you?"
//
// The greeting is gated by a per-session flag set at the moment of login/enter
// (markLoggedIn), NOT on every mount/refresh — so it fires once on entry,
// wherever the user first lands (the orb home or any page with the global
// assistant), and never on a plain page refresh or in-app navigation.

const GREET_FLAG = 'nora:greet'

export const GREETING = 'Hey boss, how can I help you?'

/** Call at a real login/enter event so the next assistant mount greets once. */
export function markLoggedIn() {
  try {
    window.sessionStorage.setItem(GREET_FLAG, '1')
  } catch {
    // sessionStorage unavailable — greeting just won't fire; non-fatal.
  }
}

/**
 * Returns true at most once per login: the first caller after markLoggedIn()
 * consumes the flag. Whichever voice surface mounts first (orb or global
 * assistant) greets; the others see false.
 */
export function consumeGreet() {
  try {
    if (window.sessionStorage.getItem(GREET_FLAG) === '1') {
      window.sessionStorage.removeItem(GREET_FLAG)
      return true
    }
  } catch {
    // ignore
  }
  return false
}
