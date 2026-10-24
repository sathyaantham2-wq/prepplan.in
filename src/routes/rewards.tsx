import { useEffect, useRef, useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Coins, Lock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { AppShell } from '../components/app-shell'
import { PageLoading } from '../components/page-loading'
import { ThemePreview, UnlockConfirm, useRewards } from '../components/paper-style'
import { useSession } from '../lib/auth-client'
import { THEME_BLURB, isKnownTheme } from '../lib/pdf/themes'

export const Route = createFileRoute('/rewards')({ component: Rewards })

/**
 * Coins are earned by correct answers and spent here on paper themes (no F-number covers this).
 * Every price, the balance and the purchase itself are decided server-side
 * (src/lib/rewards.ts); this screen only shows them.
 */
function Rewards() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const role = (session?.user as { role?: string } | undefined)?.role
  const { data, error, busyKey, unlock } = useRewards()
  const [confirmKey, setConfirmKey] = useState<string | null>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)

  function closeConfirm() {
    setConfirmKey(null)
    lastTrigger.current?.focus()
  }

  useEffect(() => {
    if (isPending) return
    if (!session || role !== 'student') navigate({ to: '/' })
  }, [isPending, session, role, navigate])

  if (isPending || !session || role !== 'student') return <PageLoading />

  return (
    <AppShell variant="student" active="home">
      <div className="mx-auto max-w-2xl p-4 sm:p-8">
        <div className="mb-6">
          <h1 className="text-h1">Rewards</h1>
          <p className="text-body text-muted-foreground">
            Spend the coins you earn on new looks for your practice papers.
          </p>
        </div>

        <Card className="mb-4">
          <CardContent className="flex items-center gap-3">
            <Coins className="size-8 text-[var(--chart-3)]" aria-hidden="true" />
            <div>
              <p className="display-title text-3xl font-extrabold tabular-nums" aria-live="polite">
                {data ? data.coins : '–'}
              </p>
              <p className="text-small text-muted-foreground">coins to spend</p>
            </div>
          </CardContent>
          <CardContent>
            <p className="text-small text-muted-foreground">
              Every correct answer earns coins – harder questions earn more. Your leaderboard points never go down when you spend coins.
            </p>
          </CardContent>
        </Card>

        {error && (
          <p className="text-small text-destructive mb-4" role="alert">
            {error}
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-h3">Paper themes</CardTitle>
            <CardDescription>
              Pick a theme under &quot;Paper style&quot; when you{' '}
              <Link to="/my-paper" className="underline">
                make a paper
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {!data && <p className="text-body text-muted-foreground">Loading…</p>}
            {data?.items.map((item) => {
              const short = !item.unlocked && data.coins < item.price
              return (
                <div key={item.key} className="space-y-2 rounded-xl border p-3">
                  <ThemePreview themeKey={item.key} />
                  <div>
                    <p className="text-body font-bold">{item.name}</p>
                    {isKnownTheme(item.key) && (
                      <p className="text-small text-muted-foreground">{THEME_BLURB[item.key]}</p>
                    )}
                  </div>
                  {item.unlocked ? (
                    <p className="text-small font-medium text-primary">
                      {item.is_default ? 'Free – always yours' : 'Unlocked'}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <Button
                        type="button"
                        className="min-h-11 w-full"
                        disabled={busyKey !== null || short}
                        aria-expanded={confirmKey === item.key}
                        onClick={(e) => {
                          lastTrigger.current = e.currentTarget
                          setConfirmKey(item.key)
                        }}
                      >
                        <Lock className="size-4" aria-hidden="true" />
                        Unlock for {item.price} coins
                      </Button>
                      {short && (
                        <p className="text-caption text-muted-foreground">
                          {item.price - data.coins} more coins to go – you are getting there!
                        </p>
                      )}
                      {confirmKey === item.key && !short && (
                        <UnlockConfirm
                          item={item}
                          coins={data.coins}
                          busy={busyKey !== null}
                          onUnlock={() => {
                            void unlock(item.key).then(() => setConfirmKey(null))
                          }}
                          onCancel={closeConfirm}
                        />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
