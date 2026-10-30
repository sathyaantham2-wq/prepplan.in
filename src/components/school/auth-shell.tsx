import type { ReactNode } from 'react'
import { BarChart3, FileText, GraduationCap, ShieldCheck } from 'lucide-react'

// The frame of the school's sign-in, sign-up and first-password screens: the brand on top, the
// form in the middle, and on a wide screen a panel beside it that says what the product does.

const POINTS = [
  {
    icon: FileText,
    title: 'Papers from your syllabus',
    text: 'Choose the chapters. Get a question paper, a teacher copy and answer booklets.',
  },
  {
    icon: BarChart3,
    title: 'Every student, every topic',
    text: 'See which marks were lost to a topic not learnt, and which to a writing habit.',
  },
  {
    icon: ShieldCheck,
    title: 'Only for your school',
    text: 'Student information is used only for your exams and reports. Never for advertising or to train AI.',
  },
]

export function AuthShell({
  title,
  intro,
  story,
  children,
}: {
  title: string
  intro?: ReactNode
  /** Takes the place of the plain panel, on a wide screen and on a phone (the sign-in's product story). */
  story?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {story ?? (
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-emerald-400/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-teal-300/10 blur-3xl"
          />
          <Brand light />
          <div className="relative max-w-md space-y-7">
            <p className="font-display text-4xl leading-tight font-bold tracking-tight">
              Exams that show what each student needs next.
            </p>
            <ul className="space-y-5">
              {POINTS.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15"
                  >
                    <p.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{p.title}</span>
                    <span className="block text-[15px] text-emerald-50/80">
                      {p.text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="relative text-sm text-emerald-100/70">
            Built on the NCERT books · Classes 6 to 12
          </p>
        </aside>
      )}
      <main
        className={`mx-auto w-full max-w-md px-4 lg:flex lg:max-w-lg lg:flex-col lg:justify-center lg:px-10 ${story ? 'py-4 sm:py-8' : 'py-8 sm:py-14'}`}
      >
        {story ? null : (
          <div className="lg:hidden">
            <Brand />
          </div>
        )}
        <h1
          className={`text-3xl font-bold tracking-tight ${story ? 'lg:mt-6' : 'mt-6'}`}
        >
          {title}
        </h1>
        {intro ? (
          <div className="mt-2 text-base text-slate-600">{intro}</div>
        ) : null}
        <div className={story ? 'mt-3 lg:mt-6' : 'mt-6'}>{children}</div>
      </main>
    </div>
  )
}

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className="relative flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`flex size-9 items-center justify-center rounded-xl ${light ? 'bg-white/15 ring-1 ring-white/20' : 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-sm shadow-emerald-900/30'}`}
      >
        <GraduationCap className="size-5" />
      </span>
      <span
        className={`font-display text-[15px] font-bold tracking-wide uppercase ${light ? 'text-white' : 'text-emerald-800'}`}
      >
        PrepPlan for Schools
      </span>
    </div>
  )
}
