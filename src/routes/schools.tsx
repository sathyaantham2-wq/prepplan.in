import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  FileText,
  Flag,
  Lock,
  ScanLine,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { Brand } from '../components/school/auth-shell'
import { SUPPORT_EMAIL } from '../lib/legal'

// The public front page of PrepPlan for Schools (owner request 2026-11-20, no F-number): a large
// classroom photo with the headline on top, in the manner of a consumer product's home page, then
// how it works, marking, reports and privacy. English only. It claims only what the school module
// already does (CLAUDE.md "School module rules"): no prices, counts, ratings or testimonials.
// /school stays the signed-in app; a school login that opens this page is sent there (SchoolRedirect).
// Photos: Unsplash License (free for commercial use), credited in the footer.
export const Route = createFileRoute('/schools')({
  head: () => ({
    meta: [
      { title: 'PrepPlan for Schools · Exam papers and AI marking' },
      {
        name: 'description',
        content:
          "Chapter-exact CBSE question papers from the NCERT books, AI correction of your students' answer sheets, and a clear report for every student.",
      },
      { property: 'og:title', content: 'PrepPlan for Schools' },
      {
        property: 'og:description',
        content:
          'Exam papers in minutes. Marking with AI. A report that shows what each student needs next.',
      },
      {
        property: 'og:image',
        content: 'https://www.prepplan.in/img/schools/hero-1000.webp',
      },
    ],
  }),
  component: SchoolsLanding,
})

const wrap = 'mx-auto w-full max-w-6xl px-4 sm:px-6'
const pillGreen =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-base font-semibold !text-slate-950 no-underline shadow-sm transition-colors hover:bg-emerald-400'
const pillOutline =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-slate-900 px-6 text-base font-semibold !text-slate-900 no-underline transition-colors hover:bg-slate-900/5 dark:border-slate-100 dark:!text-slate-100 dark:hover:bg-white/10'

const STEPS = [
  {
    icon: FileText,
    title: 'Make the paper',
    text: "Choose the chapters. Get a chapter-exact paper from the NCERT textbook in your school's own marks pattern, with its answer key. Download as Word or PDF and edit freely.",
  },
  {
    icon: ScanLine,
    title: 'Upload the answer sheets',
    text: 'Students write on your own answer sheets. Upload each student’s pages under their name. PrepPlan checks for a wrong or missing page before marking starts.',
  },
  {
    icon: BarChart3,
    title: 'Get marks and reports',
    text: 'AI marks every answer step by step. Teachers check only the answers AI flags, then release results for the section.',
  },
] as const

const MARKING = [
  'Every answer is marked step by step, with the reason for each mark.',
  'An answer the AI is not sure of (hard to read, a diagram, a missing page) is flagged for a teacher before results go out.',
  'About 1 in 20 of the other answers is sent to a teacher for a spot-check.',
  'After results, a student can question up to 5 marks. The teacher’s decision is final, and every change is recorded.',
] as const

const REPORT = [
  {
    icon: BookOpenCheck,
    title: 'Topics to fix',
    text: 'Strengths and weak topics for every student, chapter by chapter, not just a total.',
  },
  {
    icon: Flag,
    title: 'Writing habits',
    text: 'Marks lost to a missing step, a missing unit or stopping too early, shown apart from marks lost to a topic not learnt.',
  },
  {
    icon: Users,
    title: 'Whole class view',
    text: 'Each teacher sees their own sections and subjects. The office sees the whole school.',
  },
] as const

const PRIVACY = [
  'Student information is used only for your school’s exams and reports.',
  'Never used for advertising, and never used to train AI.',
  'No marketing e-mails, leaderboards or points for your students.',
  'Teachers see only the sections and subjects assigned to them.',
] as const

function SchoolsLanding() {
  return (
    <div
      data-no-sound
      data-school-area
      className="relative z-10 min-h-screen bg-[#f7f5ef] text-slate-900 dark:bg-[#0b1220] dark:text-slate-100"
    >
      <TopBar />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Marking />
        <Reports />
        <Privacy />
        <FinalCall />
      </main>
      <Footer />
    </div>
  )
}

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-900/5 bg-[#f7f5ef]/90 backdrop-blur dark:border-white/10 dark:bg-[#0b1220]/90">
      <div className={`${wrap} flex h-16 items-center gap-3 sm:h-20`}>
        <Link
          to="/schools"
          className="no-underline"
          aria-label="PrepPlan for Schools home"
        >
          <Brand />
        </Link>
        <nav
          aria-label="Page sections"
          className="ml-auto hidden items-center gap-7 text-[15px] font-medium lg:flex"
        >
          <a
            href="#how"
            className="!text-slate-700 no-underline hover:!text-slate-950 dark:!text-slate-300 dark:hover:!text-white"
          >
            How it works
          </a>
          <a
            href="#marking"
            className="!text-slate-700 no-underline hover:!text-slate-950 dark:!text-slate-300 dark:hover:!text-white"
          >
            AI marking
          </a>
          <a
            href="#reports"
            className="!text-slate-700 no-underline hover:!text-slate-950 dark:!text-slate-300 dark:hover:!text-white"
          >
            Reports
          </a>
          <a
            href="#privacy"
            className="!text-slate-700 no-underline hover:!text-slate-950 dark:!text-slate-300 dark:hover:!text-white"
          >
            Privacy
          </a>
        </nav>
        {/* On a phone only "Log in" fits beside the brand; the hero carries "Start your school". */}
        <div className="ml-auto flex shrink-0 items-center gap-2 whitespace-nowrap lg:ml-6">
          <Link to="/school/sign-in" className={`${pillOutline} min-h-11 px-5`}>
            Log in
          </Link>
          <Link
            to="/school/sign-up"
            className="hidden min-h-11 items-center justify-center rounded-full bg-emerald-500 px-5 text-[15px] font-semibold !text-slate-950 no-underline shadow-sm transition-colors hover:bg-emerald-400 sm:inline-flex"
          >
            Start your school
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="px-3 pt-3 sm:px-6 sm:pt-6">
      <div className="relative mx-auto h-[min(82svh,760px)] min-h-[560px] max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-slate-800 sm:rounded-[2.25rem]">
        <picture>
          <source
            type="image/webp"
            srcSet="/img/schools/hero-1000.webp 1000w, /img/schools/hero-2000.webp 2000w"
            sizes="(min-width: 1400px) 1400px, 100vw"
          />
          <img
            src="/img/schools/hero-2000.webp"
            alt="Two schoolgirls in blue uniforms writing in their notebooks in a classroom"
            width={2000}
            height={1125}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[72%_center] lg:object-center"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/5 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/35 lg:to-transparent"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 sm:p-10 lg:justify-center lg:p-16">
          <h1 className="max-w-[13ch] font-display text-[2.75rem] leading-[1.02] font-bold tracking-tight !text-white sm:text-6xl lg:text-[5.5rem]">
            Exam papers in minutes. Marking with AI.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90 sm:text-xl">
            Chapter-exact CBSE papers from the NCERT books, AI correction of
            your students&rsquo; answer sheets, and a clear report that shows
            what each student needs next.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/school/sign-up"
              className={`${pillGreen} min-h-14 px-7 text-lg`}
            >
              Start your school
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              to="/school/sign-in"
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-white/80 px-7 text-lg font-semibold !text-white no-underline transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  const items = [
    'CBSE / NCERT aligned',
    'Classes 6 to 12',
    'Works with your own question papers',
    'Word and PDF downloads',
  ]
  return (
    <section aria-label="At a glance" className={`${wrap} py-8 sm:py-10`}>
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] font-medium text-slate-700 dark:text-slate-300">
        {items.map((t) => (
          <li key={t} className="flex items-center gap-2">
            <CheckCircle2
              className="size-5 text-emerald-600"
              aria-hidden="true"
            />
            {t}
          </li>
        ))}
      </ul>
    </section>
  )
}

function SectionHead({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-sm font-bold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
        {eyebrow}
      </p>
      <h2 className="text-3xl leading-tight font-bold sm:text-5xl dark:!text-white">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          {intro}
        </p>
      ) : null}
    </div>
  )
}

function HowItWorks() {
  return (
    <section id="how" className={`${wrap} scroll-mt-24 py-14 sm:py-20`}>
      <SectionHead
        eyebrow="How it works"
        title="From question paper to report card, in three steps."
      />
      <ol className="mt-10 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                <s.icon className="size-6" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Step {i + 1}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-bold dark:!text-white">
              {s.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700 dark:text-slate-300">
              {s.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Marking() {
  return (
    <section id="marking" className="scroll-mt-24 px-3 sm:px-6">
      <div className="mx-auto grid max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-[2.25rem] lg:grid-cols-2 dark:bg-slate-900 dark:ring-white/10">
        <div className="relative min-h-[300px] lg:min-h-[560px]">
          <picture>
            <source
              type="image/webp"
              srcSet="/img/schools/classroom-700.webp 700w, /img/schools/classroom-1200.webp 1200w"
              sizes="(min-width: 1024px) 700px, 100vw"
            />
            <img
              src="/img/schools/classroom-1200.webp"
              alt="A teacher walks between rows of students in uniform writing in their notebooks"
              width={1200}
              height={801}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          </picture>
        </div>
        <div className="p-7 sm:p-12 lg:p-16">
          <SectionHead
            eyebrow="AI marking"
            title="Teachers check only what needs a teacher."
            intro="Correcting a full class set takes days. PrepPlan marks the answer sheets and sends your teachers only the answers that need a human eye."
          />
          <ul className="mt-8 space-y-4">
            {MARKING.map((t) => (
              <li
                key={t}
                className="flex gap-3 text-base leading-relaxed text-slate-800 dark:text-slate-200"
              >
                <CheckCircle2
                  className="mt-0.5 size-6 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Reports() {
  return (
    <section id="reports" className={`${wrap} scroll-mt-24 py-14 sm:py-20`}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHead
            eyebrow="Reports"
            title="Know every student, not just their total."
            intro="Two students can both score 60 out of 80 for very different reasons. PrepPlan shows which marks were lost to a topic not learnt and which to a writing habit."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {REPORT.map((r) => (
              <div key={r.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                  <r.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold dark:!text-white">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {r.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <SampleReport />
      </div>
    </section>
  )
}

// A drawn example of a student report. Made-up figures, labelled as an example, never a real student.
function SampleReport() {
  const topics = [
    { name: 'Large Numbers Around Us', pct: 90, tone: 'bg-emerald-500' },
    { name: 'Working with Fractions', pct: 72, tone: 'bg-emerald-500' },
    { name: 'Expressions using Letter-Numbers', pct: 45, tone: 'bg-amber-500' },
    { name: 'Parallel and Intersecting Lines', pct: 30, tone: 'bg-rose-500' },
  ]
  return (
    <figure
      aria-label="Example of a student report"
      className="rounded-[1.75rem] bg-white p-6 shadow-xl ring-1 shadow-slate-900/10 ring-slate-900/5 sm:p-8 dark:bg-slate-900 dark:ring-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Example report
          </p>
          <p className="mt-1 text-lg font-bold">
            Half-Yearly · Class 7 · Mathematics
          </p>
        </div>
        <span className="rounded-2xl bg-emerald-50 px-4 py-2 text-2xl font-bold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          58
          <span className="text-base text-emerald-700/70 dark:text-emerald-300/70">
            /80
          </span>
        </span>
      </div>
      <ul className="mt-6 space-y-4">
        {topics.map((t) => (
          <li key={t.name}>
            <div className="flex justify-between text-[15px]">
              <span className="font-medium">{t.name}</span>
              <span className="text-slate-500 dark:text-slate-400">
                {t.pct}%
              </span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${t.tone}`}
                style={{ width: `${t.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-950/40">
          <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
            −14
          </p>
          <p className="text-sm text-rose-900/80 dark:text-rose-200/80">
            Topic not learnt
          </p>
        </div>
        <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/40">
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            −8
          </p>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/80">
            Writing habits: missing units, stopped early
          </p>
        </div>
      </div>
    </figure>
  )
}

function Privacy() {
  return (
    <section id="privacy" className="scroll-mt-24 px-3 sm:px-6">
      <div className="mx-auto max-w-[1400px] rounded-[1.75rem] bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 px-6 py-14 text-white sm:rounded-[2.25rem] sm:px-12 sm:py-20 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <ShieldCheck className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-3xl leading-tight font-bold !text-white sm:text-5xl">
              Student data stays with your school.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-emerald-50/85">
              Your school accepts PrepPlan&rsquo;s school terms before the first
              student is added. From then on, the rules below are built into the
              product, not left to a setting.
            </p>
          </div>
          <ul className="space-y-4">
            {PRIVACY.map((t) => (
              <li
                key={t}
                className="flex gap-3 rounded-2xl bg-white/5 p-4 text-base leading-relaxed ring-1 ring-white/10"
              >
                <Lock
                  className="mt-0.5 size-5 shrink-0 text-emerald-300"
                  aria-hidden="true"
                />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function FinalCall() {
  return (
    <section className={`${wrap} py-16 text-center sm:py-24`}>
      <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-bold sm:text-5xl dark:!text-white">
        Start your school today.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        Create the account with your e-mail or Google. You become the
        school&rsquo;s office admin, and a short set-up guides you through
        adding teachers and students.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/school/sign-up"
          className={`${pillGreen} min-h-14 px-8 text-lg`}
        >
          Start your school
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
        <Link
          to="/school/sign-in"
          className={`${pillOutline} min-h-14 px-8 text-lg`}
        >
          Log in
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-900/10 dark:border-white/10">
      <div
        className={`${wrap} flex flex-col gap-6 py-10 text-[15px] text-slate-600 sm:flex-row sm:items-start sm:justify-between dark:text-slate-400`}
      >
        <div className="space-y-3">
          <Brand />
          <p>
            Questions? Write to{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link
            to="/school/sign-in"
            className="!text-slate-600 dark:!text-slate-400"
          >
            Log in
          </Link>
          <Link
            to="/school/sign-up"
            className="!text-slate-600 dark:!text-slate-400"
          >
            Create a school account
          </Link>
          <Link to="/privacy" className="!text-slate-600 dark:!text-slate-400">
            Privacy
          </Link>
          <Link to="/about" className="!text-slate-600 dark:!text-slate-400">
            About PrepPlan
          </Link>
        </nav>
      </div>
      <p className={`${wrap} pb-8 text-xs text-slate-500 dark:text-slate-500`}>
        Photos by{' '}
        <a
          href="https://unsplash.com/@swastikarora"
          className="underline"
          rel="noopener noreferrer"
        >
          Swastik Arora
        </a>{' '}
        and{' '}
        <a
          href="https://unsplash.com/@cimthooghly"
          className="underline"
          rel="noopener noreferrer"
        >
          CIMT Hooghly
        </a>{' '}
        on Unsplash.
      </p>
    </footer>
  )
}
