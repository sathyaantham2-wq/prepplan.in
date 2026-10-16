import { Link, createFileRoute } from '@tanstack/react-router'
import { ThemeToggle } from '../components/theme-toggle'
import { SUPPORT_EMAIL } from '../lib/legal'

// Public "what is PrepPlan and why" page (owner request 2026-10-16, no F-number). Readable signed
// in or out. Only claims what CLAUDE.md states is loaded; no counts, ratings or testimonials.
export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About PrepPlan · Know why every mark was lost' },
      {
        name: 'description',
        content:
          'PrepPlan makes syllabus-exact practice papers, marks every answer question by question, and shows which lost marks were a knowledge gap and which were a delivery habit.',
      },
    ],
  }),
  component: AboutPage,
})

const btnPrimary =
  'bg-primary !text-primary-foreground inline-flex min-h-11 items-center justify-center rounded-full px-6 text-[0.95rem] font-semibold no-underline shadow-sm transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none'
const btnQuiet =
  '!text-foreground hover:bg-accent inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[0.95rem] font-medium no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
const section = 'mx-auto w-full max-w-5xl px-4 py-14 sm:py-20'
const eyebrow = 'field-label text-primary mb-3 block'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 no-underline" aria-label="PrepPlan home">
      <div className="grad-surface flex size-[36px] shrink-0 items-center justify-center rounded-[11px]">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
        </svg>
      </div>
      <div className="display-title text-h3 text-foreground leading-tight">
        Prep<span className="grad-text">Plan</span>
      </div>
    </Link>
  )
}

// Hero illustration: one marked paper whose lost marks split into two reasons.
function PaperSplit() {
  return (
    <svg
      viewBox="0 0 360 300"
      role="img"
      aria-label="A marked paper with two lost marks: one because the topic was not known, one because the answer stopped too early"
      className="h-auto w-full max-w-[420px]"
    >
      <rect x="40" y="14" width="200" height="262" rx="16" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
      <rect x="40" y="14" width="200" height="262" rx="16" fill="var(--p-yellow)" opacity="0.35" />
      <rect x="62" y="38" width="90" height="10" rx="5" fill="var(--ink-blue)" opacity="0.8" />
      {[70, 100, 130, 160, 190, 220].map((y, i) => (
        <rect key={y} x="62" y={y} width={i % 2 ? 130 : 156} height="7" rx="3.5" fill="var(--muted-foreground)" opacity="0.35" />
      ))}
      <circle cx="214" cy="73" r="15" fill="var(--bad-bg)" stroke="var(--bad)" strokeWidth="2" />
      <path d="M208 67l12 12M220 67l-12 12" stroke="var(--bad)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="214" cy="163" r="15" fill="var(--bad-bg)" stroke="var(--bad)" strokeWidth="2" />
      <path d="M208 157l12 12M220 157l-12 12" stroke="var(--bad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M232 73 C262 73 268 52 292 52" stroke="var(--bad)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M232 163 C262 163 268 214 292 214" stroke="var(--bad)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="276" y="22" width="80" height="62" rx="14" fill="var(--p-blue)" stroke="var(--ink-blue)" strokeWidth="2" />
      <text x="316" y="49" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent-foreground)">Knowledge</text>
      <text x="316" y="66" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--accent-foreground)">gap</text>
      <rect x="276" y="184" width="80" height="62" rx="14" fill="var(--p-peach)" stroke="var(--ink-blue)" strokeWidth="2" />
      <text x="316" y="211" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--foreground)">Delivery</text>
      <text x="316" y="228" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--foreground)">habit</text>
    </svg>
  )
}

function StepIcon({ n }: { n: 1 | 2 | 3 }) {
  const common = {
    width: 56,
    height: 56,
    viewBox: '0 0 56 56',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (n === 1)
    return (
      <svg {...common}>
        <rect x="14" y="8" width="28" height="40" rx="5" />
        <path d="M20 18h16M20 26h16M20 34h9" />
      </svg>
    )
  if (n === 2)
    return (
      <svg {...common}>
        <path d="M12 42l4-12 20-20 8 8-20 20-12 4Z" />
        <path d="M32 14l8 8" />
      </svg>
    )
  return (
    <svg {...common}>
      <circle cx="26" cy="26" r="14" />
      <path d="M36 36l10 10" />
      <path d="M20 26l4 4 8-9" />
    </svg>
  )
}

const steps = [
  {
    n: 1 as const,
    title: 'Get a syllabus-exact paper',
    body: 'Pick the class, subject and chapters. PrepPlan builds a paper from questions that each belong to a concept in your syllabus, with a fair mix of easy, medium and harder questions.',
  },
  {
    n: 2 as const,
    title: 'Attempt it your way',
    body: 'Answer on screen, or write on paper like in the real exam and photograph your pages. No tricks, no hints while you write.',
  },
  {
    n: 3 as const,
    title: 'See exactly why marks were lost',
    body: 'Every answer is marked question by question. Each lost mark is explained in plain words and labelled as a knowledge gap or a delivery habit. Once marked, you see the correct answer beside yours.',
  },
]

const subjects = [
  'Mathematics · Classes 6 to 12',
  'Science · Classes 6 to 9',
  'Social Science · Classes 6 to 9',
  'Geography · Class 10',
  'UPSC Civil Services Prelims · Indian Polity',
]

const principles = [
  {
    title: 'Every question has a reason to exist',
    body: 'Each question is tied to a concept in your chapter. Nothing is added that your exam will not test.',
  },
  {
    title: 'Fair marking you can question',
    body: 'The AI marks generously and explains each mark. If you disagree, you can question it, and after marking you can always see the correct answer and learn from it.',
  },
  {
    title: 'No tutor that just solves it',
    body: 'PrepPlan will not hand you the answer while you are attempting. The point is to find out what you can really do.',
  },
  {
    title: 'Nothing is quietly deleted',
    body: 'Questions are retired, never erased, and your past results stay on record so your progress is honest over the years.',
  },
  {
    title: 'Your data stays yours',
    body: 'A student signs up herself, with a parent or guardian agreeing. She decides when to share her chapter progress with a parent.',
  },
]

const faqs = [
  {
    q: 'Does PrepPlan replace my teacher or my school tests?',
    a: 'No. It is practice that shows you where your marks are going, so the time you spend with your teacher and your books goes to the right place.',
  },
  {
    q: 'Which classes and subjects can I practise?',
    a: 'CBSE Mathematics for Classes 6 to 12, Science for Classes 6 to 9, Social Science for Classes 6 to 9 and Geography for Class 10. For competitive study there is UPSC Civil Services Prelims Indian Polity.',
  },
  {
    q: 'What is the difference between a knowledge gap and a delivery habit?',
    a: 'A knowledge gap means you did not know or could not do the topic. A delivery habit means you knew it but lost the mark anyway, for example by stopping the answer too early or leaving out a step.',
  },
  {
    q: 'Can I write on paper instead of typing?',
    a: 'Yes. Write your answers on paper and photograph them, or answer on screen. Either way, each answer is marked question by question.',
  },
  {
    q: 'What if I think a mark is wrong?',
    a: 'You can question it and have it looked at again. If you still disagree, you can set that question aside so it does not count against you.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. PrepPlan works in any browser at www.prepplan.in, and there is an Android app.',
  },
]

function AboutPage() {
  return (
    <div className="text-foreground min-h-screen overflow-x-clip scroll-smooth">
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      <header className="glass border-border sticky top-0 z-40 border-b">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-2 px-4">
          <Logo />
          <div className="flex items-center gap-1">
            <nav aria-label="Page sections" className="hidden items-center md:flex">
              <a href="#how" className={btnQuiet}>How it works</a>
              <a href="#inside" className={btnQuiet}>What is inside</a>
              <a href="#faq" className={btnQuiet}>Questions</a>
            </nav>
            <ThemeToggle />
            <Link to="/" className={`${btnPrimary} !min-h-9 !px-4`}>
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(60% 70% at 15% 0%, var(--p-blue), transparent 70%), radial-gradient(50% 60% at 95% 20%, var(--p-pink), transparent 70%), radial-gradient(40% 50% at 60% 100%, var(--p-yellow), transparent 70%)',
              opacity: 0.7,
            }}
          />
          <section className="mx-auto grid w-full max-w-5xl items-center gap-10 px-4 py-14 sm:py-24 md:grid-cols-[1.15fr_1fr]">
            <div className="rise-in">
              <span className={eyebrow}>Practice that tells you why</span>
              <h1 className="display-title text-[2.1rem] leading-[1.1] sm:text-5xl">
                Which marks did she lose because she did not know it, and which because she{' '}
                <span className="grad-text">stopped writing too early?</span>
              </h1>
              <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
                PrepPlan makes syllabus-exact practice papers, marks every answer question by
                question, and tells you the real reason behind each lost mark, so you fix the right
                thing.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/" className={btnPrimary}>
                  Get started
                </Link>
                <Link to="/" className={btnQuiet}>
                  Sign in
                </Link>
              </div>
            </div>
            <div className="rise-in flex justify-center md:justify-end">
              <PaperSplit />
            </div>
          </section>
        </div>

        {/* Problem */}
        <section className={section}>
          <span className={eyebrow}>Why PrepPlan exists</span>
          <h2 className="text-h1 max-w-2xl">Two very different reasons a mark goes missing</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
            Most practice only says right or wrong, and a total. But a lost mark can mean two
            opposite things, and they need opposite fixes.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rise-in bg-card border-border rounded-2xl border p-6 shadow-sm">
              <div className="bg-[var(--p-blue)] text-accent-foreground mb-4 inline-block rounded-full px-3 py-1 text-sm font-semibold">
                Knowledge gap
              </div>
              <h3 className="text-h3">She did not know it</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                The concept itself is shaky. More careful writing will not help. She needs to go
                back to the chapter and learn it again.
              </p>
            </div>
            <div className="rise-in bg-card border-border rounded-2xl border p-6 shadow-sm">
              <div className="bg-[var(--p-peach)] text-foreground mb-4 inline-block rounded-full px-3 py-1 text-sm font-semibold">
                Delivery habit
              </div>
              <h3 className="text-h3">She knew it, and still lost it</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                A skipped step, a missing unit, an answer that stopped one line too soon. Re-reading
                the chapter will not help. She needs to change how she writes.
              </p>
            </div>
          </div>
          <p className="bg-secondary text-secondary-foreground mt-6 rounded-2xl p-5 text-lg leading-relaxed">
            Ordinary practice cannot tell these apart. PrepPlan is built to answer exactly that
            question for every lost mark.
          </p>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-16 bg-[var(--muted)]/50">
          <div className={section}>
            <span className={eyebrow}>How it works</span>
            <h2 className="text-h1 max-w-2xl">Three steps, from paper to clear next move</h2>
            <ol className="stagger mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="bg-card border-border relative rounded-2xl border p-6 shadow-sm">
                  <div className="text-primary mb-4 flex items-center justify-between">
                    <StepIcon n={s.n} />
                    <span className="display-title text-muted-foreground text-4xl" aria-hidden="true">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="text-h3">
                    <span className="sr-only">Step {s.n}: </span>
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What is inside */}
        <section id="inside" className={`${section} scroll-mt-16`}>
          <span className={eyebrow}>What is inside</span>
          <h2 className="text-h1 max-w-2xl">Built on your syllabus, written like your exam</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
            Questions follow the NCERT textbooks chapter by chapter, and are written the way school
            exam papers ask them. For Civil Services, Indian Polity questions follow the current UPSC
            Prelims pattern: multi-statement, how-many and Statement-I/Statement-II.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3" aria-label="Subjects available">
            {subjects.map((s, i) => (
              <li
                key={s}
                className="border-border text-foreground rounded-full border px-4 py-2 text-sm font-semibold"
                style={{ background: ['var(--p-blue)', 'var(--p-mint)', 'var(--p-pink)', 'var(--p-yellow)', 'var(--p-peach)'][i] }}
              >
                {s}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-4 text-sm">CBSE, NCERT-based. More classes and subjects follow over time.</p>
        </section>

        {/* Principles */}
        <section className="bg-[var(--muted)]/50">
          <div className={section}>
            <span className={eyebrow}>What we promise</span>
            <h2 className="text-h1 max-w-2xl">Practice you can trust</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((p) => (
                <div key={p.title} className="bg-card border-border rounded-2xl border p-6 shadow-sm">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mb-3" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8 12 3 3 5-6" />
                  </svg>
                  <h3 className="text-h3">{p.title}</h3>
                  <p className="text-muted-foreground mt-2 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Students / parents */}
        <section className={section}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grad-surface rounded-2xl p-7">
              <h2 className="text-h2">For students</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
                <li>Know whether to revise the chapter or fix how you write.</li>
                <li>See the correct answer next to yours once it is marked.</li>
                <li>Question a mark you disagree with.</li>
                <li>Practise as often as you like.</li>
              </ul>
            </div>
            <div className="bg-card border-border rounded-2xl border p-7 shadow-sm">
              <h2 className="text-h2">For parents</h2>
              <ul className="text-muted-foreground mt-4 list-disc space-y-2 pl-5 leading-relaxed">
                <li>Your child signs up herself, and you agree as parent or guardian.</li>
                <li>She can share her chapter progress with you, for example on WhatsApp.</li>
                <li>No ads, no tracking code, and your child&apos;s data is never sold.</li>
                <li>Read the details in our <Link to="/privacy" className="text-primary underline">privacy policy</Link>.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16 bg-[var(--muted)]/50">
          <div className={`${section} max-w-3xl`}>
            <span className={eyebrow}>Questions</span>
            <h2 className="text-h1">Honest answers</h2>
            <div className="mt-8 space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="bg-card border-border group rounded-xl border px-5 py-4 shadow-sm">
                  <summary className="flex min-h-6 cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="text-primary text-xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="text-muted-foreground mt-6 text-sm">
              Something else? Write to{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary underline">
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className={section}>
          <div className="grad-surface rounded-3xl px-6 py-12 text-center sm:px-12">
            <h2 className="display-title text-3xl sm:text-4xl">Find out why the marks went</h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-lg text-lg">
              Take one paper and see which lost marks were knowledge and which were habit.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/" className={btnPrimary}>
                Get started
              </Link>
              <Link to="/" className={btnQuiet}>
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm">
          <span>PrepPlan · www.prepplan.in</span>
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/privacy" className="hover:underline">Privacy policy</Link>
            <Link to="/" className="hover:underline">Sign in</Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a>
          </span>
        </div>
      </footer>
    </div>
  )
}
