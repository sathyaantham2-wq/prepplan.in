# School module UI redesign — plan for the owner's approval

Status: **PLAN ONLY (2026-11-03).** Nothing in the app has changed yet. No business logic, permissions or data change in any
phase. Local only; no deploy until the owner approves the result. No F-number covers this yet.

Screenshots (git-ignored, local):
- Before, the current app at 1440 px: `local-private/ui-redesign/before/` (home, settings, students, progress; light and dark).
- After, a static mock-up of the new Home (not app code): `local-private/ui-redesign/after-mock/` (1440 and 390 px, light and dark).
  Source: `local-private/ui-redesign/mock/home.html`.

## 1. What is wrong today, and why

| What you saw | Cause in the code |
|---|---|
| Narrow centred column, big empty sides | Every school page sits in `max-w-3xl` (768 px) in `src/routes/school/$schoolId.tsx`; header and nav too. |
| Ten nav items in one row, running off the right edge | A single top row of links (`navFor`), sized for 5–6 items; it now carries up to 10 for the office. |
| Dark navy page, headings nearly invisible | Dark mode was built only for the Progress screens (`useDarkMode` in `progress-ui.tsx`). Its switch puts `.dark` on the whole page and paints the body `#0b1220`, but the other screens have no dark colours, so default dark text lands on the navy background. |
| Faint grey labels, broken black checkbox on Settings | Same cause: light-only classes (`text-slate-700`, unstyled `<input type="checkbox">`) shown on a dark page; the browser's dark native checkbox shows as a black square. |
| Inconsistent look between screens | Each page builds its own cards and lists; `ui.tsx` has only a few parts (button, card, notice, chip). No table, drawer, toast or confirm. |

## 2. Design rules

- **Light by default.** Dark only from the profile menu, from one set of colour tokens (CSS variables) used by every school
  component. No hard-coded `slate-*`/`emerald-*` colours in school screens after the change; no body-colour hacks.
- **Tokens** (light / dark): page `#f6f7f9` / `#0f1318`; surface `#fff` / `#171c22`; border `#e3e6ea` / `#2c343e`; text
  `#16191d` / `#eef1f4`; secondary text `#4a5260` / `#c3cad3`; brand `#0b6b4f` / `#3fbf8f`; warning, danger and info each with a
  strong and a soft tone. Every text/background pair is checked for **WCAG AA** (4.5:1 body, 3:1 large text and controls) by an
  automated test on the token list.
- **Type:** body 15 px minimum (Manrope), headings by a fixed scale (26 / 20 / 16). Telugu uses **Noto Sans Telugu** (already
  loaded) with line-height 1.7 whenever the language is Telugu.
- **Controls:** one checkbox, toggle, radio, input and select style, clearly visible in both themes, 44 px tap targets, a visible
  2 px focus ring on everything focusable. `prefers-reduced-motion` turns off drawer and toast animation.
- **Width:** content uses the space: max 1440 px, a 12-column grid that steps down to 1 column; nothing scrolls sideways from 360 to
  2560 px (checked by a test at 360, 390, 768, 1024, 1440 and 2560).

## 3. The frame (every school page)

- **Left sidebar** (≥ 1024 px), grouped and collapsible, showing only the parts the school turned on:
  - Office: **Home** · **Set up**: Classes, Teachers, Students · **Exams**: Make paper, AI correction, Results, Progress board ·
    **Messages** · **Settings** (pinned to the bottom). The exam-week board goes inside AI correction as its first tab (see
    question 1).
  - Teacher: Home · Students · Exams (only what they teach) · Messages.
  - Principal: Home · Exams (Results, Progress board, exam-week board; read-only) · Messages.
  - Student and parent: Home · My results · Progress (the sidebar becomes a short list; same frame).
  - A count badge next to AI correction when answers wait for a check.
- **Below 1024 px** the sidebar is a slide-out drawer opened by a menu button; the phone's bottom bar goes away.
- **Top bar:** school initials/name, page title, **English / తెలుగు** switch, **Help (?)** (replay the tour, short how-tos),
  **profile menu** (name and role, Dark theme on/off, Sign out). The demo banner stays.

## 4. One pattern for every page

- **Page header:** title, one plain-language line under it, **one** primary button top-right (e.g. "Add student", "Make paper").
- **Lists** become tables with search, filters and pagination (25 a page); on a phone each row becomes a card.
- **Add / edit** opens a right-side panel (drawer); the list stays behind it.
- **Feedback:** a "Saved" toast after every save; leaving a panel or page with unsaved changes asks first; every delete or remove
  asks for confirmation (with what will happen, in plain words).
- **Empty states:** one sentence and one button, e.g. "No students yet — upload your Excel list", plus "Download the Excel
  template" where a template exists.
- **"?" tips** next to terms a teacher may not know: flag, question window (dispute window), sample check, release, rubric,
  name area. Plain words on screen everywhere; technical words only inside tips if at all.

## 5. Home (dashboard)

Matches the mock-up (`after-mock/home-1440-light.png`):
1. **Greeting** + one line + primary button (Make a paper, or Add students while set-up is unfinished).
2. **Today** panel: things waiting, each with a button that goes there — answers to check, students with no answer sheets,
   question windows closing in the next 3 days, parent messages not sent. Only lines with something in them are shown; when
   nothing waits it says so in one line.
3. **Finish setting up** checklist with progress (the existing seven steps); hidden once all are done.
4. **Three action cards**: Make a paper, AI correction, See results — only those the school turned on.
5. **Stat row** (one slim strip, not big cards): classes, teachers, students, exams this term.
6. **Recent exams**: last 5 papers with where each stands (to check / uploading / results out) and a "See all".

Data: the Today panel and "exams this term" need counts that no endpoint returns in one go today. I will add **one read-only
endpoint** (`GET /api/schools/:schoolId/today`) that counts from existing tables with the same scoping as today's screens (a
teacher sees only their sections, the principal read-only, never a student). No new table, no write, no change to who may see what.

## 6. Screen map (all school routes)

| Route | Sidebar | New pattern | Primary button | Notes |
|---|---|---|---|---|
| `/school/$id` (Home) | Home | Dashboard (section 5) | Make a paper / Add students | Role-aware: teacher Home lists their checks; student/parent keep their own home in the new frame |
| `/classes` | Set up › Classes | Table of classes and sections; drawer to add/edit; class teacher in a column | Add class | Section add inside the drawer |
| `/teachers` | Set up › Teachers | Table (name, email, classes taught, status) + search; drawer | Add teacher | Assign classes in the drawer |
| `/students` | Set up › Students | Table with search, class/section filter, pagination; card view on phone; drawer | Add students | Excel upload and template link in the empty state and the drawer |
| `/exams`, `/exams/new`, `/exams/$examId` | Exams › Make paper | List table → step page for a new paper → paper page with tabs | Make a paper | The paper builder keeps its steps; only the frame and parts change |
| `/papers`, `/papers/edit`, `/papers/check` | Settings › Paper patterns | Table + editor page | New pattern | Advanced; reached from Settings |
| `/own-papers`, `/own-papers/new`, `/own-papers/$paperId` | Exams › AI correction | List table → upload page → paper page with tabs: Questions and answers · Answer sheets · Marking · Release | Upload a paper | The side-by-side review stays a full panel inside the Marking tab |
| `/board` | Exams › AI correction (first tab "Where sheets stand") | Grid table as now | — | Office and principal |
| `/results`, `/results/$examId` | Exams › Results | Table + result page | — | |
| `/class-progress` | Exams › Progress board | Filters bar + grid | — | |
| `/messages` | Messages | Tabs: Activity · Parents · Settings; tables | — | |
| `/settings` | Settings | Sectioned settings page with left sub-menu: School, Parts used, Students' progress, Name area, Messages, Terms, Paper patterns | Save (per section) | Fixes the checkbox and labels |
| `/terms` | Settings › Terms | Text page | Accept the terms | |
| `/welcome` | (no sidebar) | Set-up wizard, same steps, new parts | — | |
| `/my-results`, `/my-results/$paperId` | My results | Student list → paper page | — | Student only |
| `/progress`, `/progress/exam.$paperId`, `/progress/practise` | Progress | Same content, new frame and tokens | — | Student and parent |
| `/school/sign-in`, `/sign-up`, `/set-password`, `/school` | (no sidebar) | `AuthShell` restyled with the same tokens | — | |

## 7. First-time users

- A **4-step welcome tour** on the first sign-in of each person (remembered in that browser; skippable; "Replay the tour" in Help):
  1. the sidebar and where things are; 2. Today panel; 3. the primary button on each page; 4. Help and the language switch.
  Different short texts for office, teacher and principal.
- Plain words everywhere; the "?" tips explain the few terms we must use.

## 8. Language

- One **English / తెలుగు** switch in the top bar, remembered in the browser (no data change). Today only the Progress screens and a
  few others are translated (`src/lib/school-i18n.ts`, 222 phrases); the redesign moves **every** school screen's words into that
  file and adds Telugu for all of them (about 300 more phrases). Telugu text will be written by me and **needs a Telugu-speaking
  teacher's read-through** before real use (see question 3).

## 9. Not changing

Business rules, permissions, the API routes and their answers (except the one new read-only endpoint above), the database, the
marking engine, the messaging, the student-role answer-key rules, and every `data-testid` that the browser tests use (kept or moved
with the element).

## 10. Build phases (after approval)

1. Tokens, theme switch, the frame (sidebar, drawer, top bar, profile menu) and the part kit: page header, table, drawer, confirm,
   toast, empty state, tip, form controls. Fix dark mode at the root.
2. Home (with the read-only Today endpoint) and Settings.
3. Set up: Classes, Teachers, Students (tables and drawers).
4. Exams: Make paper, AI correction (tabs, board, review), Results, Progress board; Messages.
5. Student and parent screens, sign-in pages, welcome wizard, tour.
6. Telugu for every screen; contrast test; no-sideways-scroll test at six widths; full browser test run; the screenshot set:
   Home, Students list, Add-student drawer, Make paper, AI correction, Results, Settings, each at 1440 and 390 px, English and Telugu,
   light and dark (56 pictures), then a short report for approval.

Each phase ends with the full school test suite and browser tests green before the next starts.

## 11. Questions for the owner

1. **Exam-week board:** inside AI correction as its first tab (proposed), or its own sidebar item under Exams?
2. **"Exams this term":** count papers since 1 April (school year) or since the last term start you set? Proposed: since 1 April,
   labelled "this school year".
3. **Telugu read-through:** who checks the Telugu wording before schools see it?
4. **Logo:** the frame shows the school's initials. A real logo upload would be a data change (out of scope here); later?
5. **Student and parent screens:** include them in this redesign (proposed, phase 5), or office/teacher/principal first?

## 12. Build status (2026-11-03, local only, not deployed)

Owner decisions: no Telugu translation (the switch is dropped; the Progress screens keep their own Telugu); the exam-week
board is the first tab of AI correction; "exams this term" counts from 1 April ("this school year"); no logo upload (initials);
student and parent screens included.

Built in five commits (`3606af7`, `f4517fd`, `75639eb`, `5429905`, `1cad521`):
1. **Palette and frame.** `src/lib/schools/school-theme.ts` sets every Tailwind colour the school screens use as CSS
   variables, light and dark; the dark set turns the greys round, so no screen can put dark text on a dark page.
   69 text/background pairs pass WCAG AA in both themes (`school-theme.test.ts`). Grouped, collapsible sidebar
   (drawer below 1024 px), top bar (page title, Help, account menu with the dark theme and Sign out), skip link, focus
   rings and reduced motion. The kit (`kit.tsx`): toast, confirm box, right-side panel that asks before losing unsaved
   work, "?" tip, checkbox, switch, and a table with search and pages that becomes cards on a phone.
2. **Home** (Today, set-up checklist hidden when the first six steps are done, action cards, figures, recent exams;
   read-only `GET /api/schools/:id/today`, scoped like the screens, tested) and **Settings** in sections with a side menu.
3. **Students, Teachers** as tables with add-from-file panels and template links; **Classes** in a wide layout with an
   add-class panel.
4. **Exams, AI correction** (tabs: Where sheets stand · Papers; the paper picker in a panel), **Results** as tables; one
   heading style; forms at a readable width.
5. **Welcome tour** (four steps per role, skippable, from Help; it does not open by itself in an automated browser) and tips
   for flagged answers and the question window.

Checks: all seven school browser test files pass (68 tests, phone size), tsc and lint clean. Screenshots of Home, Students,
Add-student panel, Make paper, AI correction, Results and Settings at 1440 and 390 px, light and dark:
`local-private/ui-redesign/final/` (28 pictures; none scrolls sideways).

Not done: the paper detail screens (own paper, exam paper, class results), Messages and the Progress board keep their
existing layout inside the new frame and palette (they are wide and readable but not rebuilt as tables/panels); the classes
page edits inline rather than in a panel; leaving-with-unsaved-changes is wired on Settings and the panels, not on every form.
