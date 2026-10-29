import { useState } from 'react'
import { signIn } from '../../lib/auth-client'
import { SCHOOL_INTENT_COOKIE } from '../../lib/school-signup-intent'
import { Btn, Notice } from './ui'

/**
 * "Continue with Google" on a SCHOOL page. It leaves a short-lived marker first, so a brand-new Google
 * login becomes a school login (never a student), and then goes to /school, which either opens the
 * person's school or asks her to name one.
 */
export function GoogleSchoolButton({
  label = 'Continue with Google',
}: {
  label?: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  async function go() {
    setError(null)
    setBusy(true)
    document.cookie = `${SCHOOL_INTENT_COOKIE}=1; path=/; max-age=900; samesite=lax`
    try {
      const res = await signIn.social({
        provider: 'google',
        callbackURL: '/school',
      })
      if (res.error) throw new Error('x')
    } catch {
      setError(
        'Google sign-in is not available right now. Please use your e-mail and password.',
      )
      setBusy(false)
    }
  }
  return (
    <div className="space-y-2">
      <Btn
        kind="plain"
        className="w-full"
        disabled={busy}
        onClick={() => void go()}
      >
        {busy ? 'Opening Google…' : label}
      </Btn>
      {error ? <Notice kind="error">{error}</Notice> : null}
    </div>
  )
}
