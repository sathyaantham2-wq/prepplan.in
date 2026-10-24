// The paper theme names, the default, and the check for a known name -- and nothing else. This
// file deliberately imports nothing, because src/lib/pdf/themes.ts pulls in the Telugu font file
// (a Vite-only `?inline` import that plain Node cannot load). Server code that is also run by the
// seed scripts through tsx (papers.ts, rewards.ts) therefore imports the names from here, and
// themes.ts re-exports them so every other import keeps working.
export const PAPER_THEMES = ['Clean School', 'Doodle Journal', 'Manga'] as const
export type PaperTheme = (typeof PAPER_THEMES)[number]

export const DEFAULT_THEME: PaperTheme = 'Clean School'

export function isKnownTheme(value: string | null | undefined): value is PaperTheme {
  return (PAPER_THEMES as readonly string[]).includes(value ?? '')
}
