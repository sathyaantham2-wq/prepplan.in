import { useCallback, useEffect, useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from './ui/button'
import { THEME_PACKS, isKnownTheme } from '../lib/pdf/themes'

// Shared by /my-paper (the "Paper style" chips) and /rewards (the theme cards): the rewards data
// and the unlock call. Coins are spent only here; the server decides everything (balance, price,
// idempotence) -- this file just shows the result.
export interface RewardItemView {
  key: string
  name: string
  kind: string
  price: number
  unlocked: boolean
  is_default: boolean
}
export interface RewardsData {
  coins: number
  items: Array<RewardItemView>
}

export function useRewards() {
  const [data, setData] = useState<RewardsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      const response = await fetch('/api/students/me/rewards')
      if (!response.ok) throw new Error('failed')
      setData((await response.json()) as RewardsData)
    } catch {
      setError('Could not load your rewards right now.')
    }
  }, [])
  useEffect(() => {
    void reload()
  }, [reload])

  async function unlock(key: string): Promise<boolean> {
    setBusyKey(key)
    setError(null)
    try {
      const response = await fetch('/api/students/me/rewards/unlock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      if (response.status === 409) {
        const body = (await response.json()) as { missing?: number }
        setError(`You need ${body.missing ?? 'a few'} more coins for that one. Keep practising!`)
        await reload()
        return false
      }
      if (!response.ok) {
        setError('Could not unlock that right now.')
        return false
      }
      await reload()
      return true
    } catch {
      setError('Could not unlock that right now.')
      return false
    } finally {
      setBusyKey(null)
    }
  }

  return { data, error, busyKey, unlock }
}

/** A tiny sample page drawn from the theme pack's own tokens (original artwork only). */
export function ThemePreview({ themeKey }: { themeKey: string }) {
  if (!isKnownTheme(themeKey)) return null
  const pack = THEME_PACKS[themeKey]
  return (
    <div
      aria-hidden="true"
      className="rounded-lg border bg-white p-2 text-black"
      style={{ fontFamily: pack.fontFamily }}
    >
      <div className="flex items-start justify-between" style={{ borderBottom: pack.headerBorder, paddingBottom: 4 }}>
        <span className="text-xs font-bold" style={{ textDecoration: pack.sectionTitleDecoration }}>
          Section A
        </span>
        {pack.cornerOrnament && (
          <span className="block h-6 w-9 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: pack.cornerOrnament }} />
        )}
      </div>
      <div
        className="mt-2 px-2 py-1 text-[11px]"
        style={{
          border: pack.questionBorder || '1px solid #ddd',
          borderRadius: pack.questionBorderRadius,
        }}
      >
        1. What is 6 x 7?
      </div>
    </div>
  )
}

/** Brings the unlock buttons clear of the sticky plan bar that otherwise covers them on a phone.
 *  Module-level so its identity is stable: it runs when the confirm box appears, not on every render. */
function centreOnMount(el: HTMLElement | null) {
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

/** The inline "Unlock X for N coins?" step shared by /my-paper and /rewards. Focus moves to the
 *  Unlock button (or Not now when she cannot afford it) and Escape cancels. */
export function UnlockConfirm({
  item,
  coins,
  busy,
  onUnlock,
  onCancel,
}: {
  item: RewardItemView
  coins: number
  busy: boolean
  onUnlock: () => void
  onCancel: () => void
}) {
  const short = coins < item.price
  const focusRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    focusRef.current?.focus({ preventScroll: true })
  }, [item.key])
  return (
    <div
      ref={centreOnMount}
      className="bg-muted/50 flex flex-wrap items-center gap-2 rounded-lg p-3 text-sm"
      role="group"
      aria-label="Confirm unlock"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel()
      }}
    >
      <span className="min-w-0 flex-1">
        Unlock {item.name} for {item.price} coins? You have {coins}.
      </span>
      <Button
        ref={short ? undefined : focusRef}
        type="button"
        size="sm"
        className="min-h-11"
        disabled={busy || short}
        onClick={onUnlock}
      >
        Unlock
      </Button>
      <Button
        ref={short ? focusRef : undefined}
        type="button"
        size="sm"
        variant="outline"
        className="min-h-11"
        onClick={onCancel}
      >
        Not now
      </Button>
      {short && (
        <span className="text-muted-foreground w-full text-xs">
          {item.price - coins} more coins to go – every correct answer earns coins.
        </span>
      )}
    </div>
  )
}

/** The compact "Paper style" row for /my-paper. */
export function PaperStylePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (key: string) => void
}) {
  const { data, error, busyKey, unlock } = useRewards()
  const [confirmKey, setConfirmKey] = useState<string | null>(null)

  if (!data) return null
  const confirming = data.items.find((i) => i.key === confirmKey)

  async function doUnlock(key: string) {
    if (await unlock(key)) onChange(key)
    setConfirmKey(null)
  }

  return (
    <div className="col-span-full space-y-2" data-testid="paper-style">
      <p className="text-muted-foreground text-xs" id="paper-style-label">
        Paper style
      </p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="paper-style-label">
        {data.items.map((item) => {
          const selected = value === item.key
          return (
            <button
              key={item.key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                if (item.unlocked) {
                  onChange(item.key)
                  setConfirmKey(null)
                } else setConfirmKey(item.key)
              }}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium ${
                selected ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'
              }`}
            >
              {!item.unlocked && <Lock className="size-3.5" aria-hidden="true" />}
              {item.name}
              {!item.unlocked && (
                <span className="text-muted-foreground text-xs">
                  <span className="sr-only">locked, </span>
                  {item.price} coins
                </span>
              )}
            </button>
          )
        })}
      </div>
      {confirming && !confirming.unlocked && (
        <UnlockConfirm
          item={confirming}
          coins={data.coins}
          busy={busyKey !== null}
          onUnlock={() => void doUnlock(confirming.key)}
          onCancel={() => setConfirmKey(null)}
        />
      )}
      {error && (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
