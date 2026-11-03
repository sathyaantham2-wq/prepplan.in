import { useEffect, useId, useState } from 'react'
import { Btn } from './ui'

// The short welcome tour (UI redesign plan, section 7): four steps on a person's first sign-in in this browser, skippable,
// and shown again from Help ("Show me around"). It does not open by itself in an automated browser (the browser tests),
// so it never stands in front of what a test clicks; Help still opens it there.
type Role = 'school_admin' | 'teacher' | 'principal' | 'student' | 'parent'
const STEPS: Record<'staff' | 'principal' | 'student', Array<{ title: string; body: string }>> = {
  staff: [
    { title: 'Everything is in the menu', body: 'The menu on the left has every part: setting up your school, making papers, AI correction, results and messages. On a phone, open it with the ☰ button at the top.' },
    { title: 'Home shows what is waiting', body: 'The Today list on Home shows answers to check, students with no answer sheets and other things waiting. Each one has a button that takes you straight there.' },
    { title: 'One main button on each page', body: 'The green button at the top right of a page does that page’s main job, like “Add students from a file” or “Make an exam paper”.' },
    { title: 'Help is always here', body: 'The ? at the top opens help and this tour. Your name at the top right has the dark theme and Sign out.' },
  ],
  principal: [
    { title: 'Your view of the school', body: 'The menu on the left shows your school’s exams, the progress board and messages. On a phone, open it with the ☰ button.' },
    { title: 'Home shows what is waiting', body: 'The Today list shows answers waiting for a teacher, missing answer sheets and question windows about to close.' },
    { title: 'Where every sheet stands', body: 'AI correction opens the exam-week board: for each paper and section, how many sheets are uploaded, marked, waiting or failed.' },
    { title: 'Help is always here', body: 'The ? at the top opens help and this tour. Your name at the top right has the dark theme and Sign out.' },
  ],
  student: [
    { title: 'Welcome', body: 'This is your school’s PrepPlan. Your marked papers and your progress appear here after your teachers mark them.' },
    { title: 'My results', body: 'My results shows each marked paper: your marks, the right answers and why marks were lost.' },
    { title: 'Progress', body: 'Progress shows your topics, what to practise this week and how you are growing.' },
    { title: 'Help is always here', body: 'The ? at the top opens help and this tour again.' },
  ],
}

export function WelcomeTour({ role, storageKey }: { role: Role; storageKey: string }) {
  const steps = STEPS[role === 'principal' ? 'principal' : role === 'student' || role === 'parent' ? 'student' : 'staff']
  const [step, setStep] = useState<number | null>(null)
  const titleId = useId()
  const key = `prepplan-school-tour:${storageKey}`
  useEffect(() => {
    let seen = true
    try {
      seen = window.localStorage.getItem(key) === 'done'
    } catch {
      // private window: do not nag
    }
    if (!seen && !navigator.webdriver) setStep(0)
    const open = () => setStep(0)
    window.addEventListener('school-tour', open)
    return () => window.removeEventListener('school-tour', open)
  }, [key])
  useEffect(() => {
    if (step === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && finish()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  function finish() {
    setStep(null)
    try {
      window.localStorage.setItem(key, 'done')
    } catch {
      // ignore
    }
  }
  if (step === null) return null
  const s = steps[step]
  const last = step === steps.length - 1
  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} data-testid="tour" className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
        <p className="text-sm font-semibold text-emerald-800">
          Step {step + 1} of {steps.length}
        </p>
        <h2 id={titleId} className="mt-1 text-xl font-bold">
          {s.title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{s.body}</p>
        <div aria-hidden="true" className="mt-4 flex gap-1.5">
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-emerald-700' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <Btn kind="plain" onClick={finish}>
            Skip the tour
          </Btn>
          <span className="flex gap-2">
            {step > 0 ? (
              <Btn kind="plain" onClick={() => setStep(step - 1)}>
                Back
              </Btn>
            ) : null}
            <Btn onClick={() => (last ? finish() : setStep(step + 1))} data-testid="tour-next">
              {last ? 'Done' : 'Next'}
            </Btn>
          </span>
        </div>
      </div>
    </div>
  )
}
