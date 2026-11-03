/**
 * The colours of the school screens, light and dark, in one place (UI redesign plan, docs/schools/UI_REDESIGN_PLAN.md).
 *
 * The school screens are written with Tailwind's palette classes (slate, emerald, amber, red, sky, teal, rose, white).
 * Tailwind v4 reads every one of those from a CSS variable, so the frame sets the variables itself: light values by
 * default, and for the dark theme a second set in which the greys are turned round (light text, dark surfaces) and the
 * colours are lifted so they still read on a dark page. Every screen is therefore dark-safe without its own dark classes,
 * and nothing ever puts dark text on a dark background. The contrast test reads these same tables.
 */
export type Shade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'
export type Family = 'slate' | 'emerald' | 'amber' | 'red' | 'sky' | 'teal' | 'rose'
export interface Palette {
  white: string
  page: string
  families: Record<Family, Record<Shade, string>>
}

const SHADES: Array<Shade> = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const row = (values: Array<string>) =>
  Object.fromEntries(SHADES.map((s, i) => [s, values[i]])) as Record<Shade, string>

/** Tailwind's own light palette (sRGB), so light screens look as they always have. */
export const LIGHT: Palette = {
  white: '#ffffff',
  page: '#f6f7f9',
  families: {
    // slate-400 and -500 are one step darker than Tailwind's so hint text and placeholders pass AA on white
    slate: row(['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#64748b', '#566377', '#475569', '#334155', '#1e293b', '#0f172a', '#020617']),
    emerald: row(['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#047857', '#047857', '#065f46', '#064e3b', '#022c22']),
    amber: row(['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#b45309', '#b45309', '#92400e', '#78350f', '#451a03']),
    red: row(['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a']),
    sky: row(['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0369a1', '#0369a1', '#075985', '#0c4a6e', '#082f49']),
    teal: row(['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0f766e', '#0f766e', '#115e59', '#134e4a', '#042f2e']),
    rose: row(['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#4c0519']),
  },
}

/** The dark theme: surfaces dark, text light, colours lifted. "white" (cards) becomes the dark surface. */
export const DARK: Palette = {
  white: '#171c22',
  page: '#0f1318',
  families: {
    slate: row(['#1b2128', '#222932', '#2c343e', '#3a4450', '#8b96a3', '#a3acb8', '#b8c0ca', '#cdd3db', '#dde2e8', '#eef1f4', '#f7f9fb']),
    emerald: row(['#10241d', '#143328', '#1d4a3a', '#2f6e56', '#3fa37c', '#3fbf8f', '#4fcf9d', '#3fbf8f', '#6fd6ad', '#9fe6c8', '#c9f3e1']),
    amber: row(['#2e2410', '#3a2d12', '#5a4416', '#7a5c1c', '#c9952f', '#e0a93f', '#f0bb57', '#f5c56a', '#f8d48b', '#fbe2ad', '#fdf0d3']),
    red: row(['#3b1715', '#4a1c19', '#6b2622', '#8f322c', '#e0675d', '#f07a70', '#ff8a80', '#ff9d94', '#ffb3ab', '#ffcbc6', '#ffe4e1']),
    sky: row(['#0f2233', '#132c42', '#1b3d5c', '#27557f', '#4e9bd6', '#6aaee2', '#86c0ea', '#9fcdef', '#b8daf3', '#d0e7f8', '#e8f3fc']),
    teal: row(['#0f2422', '#13302d', '#1a4440', '#255f59', '#3fb3a6', '#56c4b8', '#6fd0c5', '#88dbd2', '#a5e5de', '#c3efea', '#e1f7f5']),
    rose: row(['#3a1520', '#4a1a28', '#6b2238', '#8f2d4b', '#f0708f', '#f585a0', '#f89ab1', '#fab0c2', '#fcc4d2', '#fdd8e1', '#feecf0']),
  },
}

function vars(p: Palette): string {
  const lines = [`--color-white:${p.white}`, `--sc-page:${p.page}`]
  for (const [f, shades] of Object.entries(p.families))
    for (const [s, v] of Object.entries(shades)) lines.push(`--color-${f}-${s}:${v}`)
  return lines.join(';')
}

/** The style sheet the school frame puts on the page: the variables for both themes and the form-control basics. */
export function schoolThemeCss(): string {
  return [
    `.school-ui{${vars(LIGHT)};color-scheme:light}`,
    `.school-ui.school-dark{${vars(DARK)};color-scheme:dark}`,
    // native checkboxes and radios: visible in both themes, the brand colour when ticked
    `.school-ui input[type=checkbox],.school-ui input[type=radio]{accent-color:var(--color-emerald-700);width:1.25rem;height:1.25rem}`,
    `.school-ui ::placeholder{color:var(--color-slate-500);opacity:1}`,
    `.school-ui :focus-visible{outline:2px solid var(--color-emerald-700);outline-offset:2px}`,
    `@keyframes sc-slide{from{transform:translateX(24px);opacity:.6}to{transform:none;opacity:1}}`,
    `@media (prefers-reduced-motion:reduce){.school-ui *{animation-duration:0s!important;transition-duration:0s!important}}`,
  ].join('\n')
}

// ---------------------------------------------------------------- contrast (WCAG 2.x)

function channel(c: number): number {
  const s = c / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
}
/** The contrast ratio of two colours, 1 to 21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** A colour by its class name in a palette: "white", "page" or "slate-700". */
export function colour(p: Palette, name: string): string {
  if (name === 'white') return p.white
  if (name === 'page') return p.page
  const [f, s] = name.split('-') as [Family, Shade]
  return p.families[f][s]
}
