import { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { WhatsAppLogin } from './whatsapp-login'
import type { WaConfigResponse, WaLinkStatusResponse } from '../lib/wa-login-types'

/**
 * Student Settings: link or remove the WhatsApp number used for "Continue with WhatsApp".
 * Renders nothing while the server feature is off (or the config cannot be read).
 */
export function WhatsAppSettingsCard() {
  const [enabled, setEnabled] = useState(false)
  const [link, setLink] = useState<WaLinkStatusResponse | null>(null)
  const [adding, setAdding] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadLink = useCallback(async () => {
    try {
      const r = await fetch('/api/students/me/whatsapp')
      if (!r.ok) throw new Error('bad status')
      setLink((await r.json()) as WaLinkStatusResponse)
    } catch {
      setError('Could not load your WhatsApp sign-in. Please try again later.')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/whatsapp/config')
      .then((r) => (r.ok ? r.json() : null))
      .then((c: WaConfigResponse | null) => {
        if (cancelled || c?.enabled !== true) return
        setEnabled(true)
        void loadLink()
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [loadLink])

  const onLinked = useCallback(() => {
    setAdding(false)
    void loadLink()
  }, [loadLink])

  async function remove() {
    setBusy(true)
    setError(null)
    try {
      const r = await fetch('/api/students/me/whatsapp', { method: 'DELETE' })
      if (!r.ok) throw new Error('bad status')
      setConfirming(false)
      await loadLink()
    } catch {
      setError('Could not remove your WhatsApp number. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!enabled) return null

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-h3">WhatsApp sign-in</CardTitle>
        <CardDescription>
          Sign in to PrepPlan by sending one message from your WhatsApp number.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3" aria-live="polite">
        {!link && !error && <p className="text-small text-muted-foreground">Loading…</p>}
        {link?.linked && !adding && (
          <>
            <p className="text-body">
              Linked number: <span className="font-semibold">{link.phone_masked}</span>
            </p>
            {!confirming ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  disabled={!link.can_unlink}
                  aria-describedby={link.can_unlink ? undefined : 'wa-unlink-reason'}
                  onClick={() => setConfirming(true)}
                >
                  Remove
                </Button>
                {!link.can_unlink && (
                  <p id="wa-unlink-reason" className="text-small text-muted-foreground">
                    This is the only way you can sign in to PrepPlan right now, so it cannot be removed.
                  </p>
                )}
              </>
            ) : (
              <div className="space-y-2" role="group" aria-label="Confirm removing WhatsApp number">
                <p className="text-body">
                  Remove this WhatsApp number? You will not be able to sign in with WhatsApp until you
                  add it again.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    className="min-h-11"
                    disabled={busy}
                    onClick={() => void remove()}
                  >
                    {busy ? 'Removing…' : 'Yes, remove it'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-11"
                    disabled={busy}
                    onClick={() => setConfirming(false)}
                  >
                    Keep it
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {link && !link.linked && !adding && (
          <Button type="button" className="min-h-11" onClick={() => setAdding(true)}>
            Add my WhatsApp number
          </Button>
        )}
        {adding && (
          <WhatsAppLogin purpose="link" onDone={onLinked} onCancel={() => setAdding(false)} />
        )}
        {error && (
          <p className="text-small text-destructive" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
