# F-number map (F133–F166)

Added 2026-11-04 at the owner's request. Work that shipped with "(no F-number yet)" in its commit message, or that
`CLAUDE.md` said no F-number covered, now has a row in tab 03 of `docs/ExamPrep_AI_Module_Development_Plan.xlsx`.
Status is as recorded in column J on that date. Commits are short hashes on `main`; earlier commits are left as they are
(history is not rewritten).

| F-number | Module | Title | Status | Commits |
|---|---|---|---|---|
| F133 | M20 | School tenant, roles and isolation; school logins kept out of personal PrepPlan | Done | `8d5fade`, `ce4a127` |
| F134 | M21 | School classes, sections, subjects, teacher assignments, roster upload and terms acceptance | Done | `ca1b001`, `824db3e` |
| F135 | M02 | School sign-in: staff links and codes, student slips by admission number | Done | `f38e121`, `e634194` |
| F136 | M21 | School self sign-up, demo until approved, per-school AI allowance | Done | `60f24a9`, `39b576f`, `b93d814` |
| F137 | M21 | School set-up wizard, home actions, choice of parts and the demo school | Done | `20a13d6`, `cba7e43` |
| F138 | M06 | School paper patterns (layouts) and coverage preview | Done | `971428f` |
| F139 | M06 | School exam paper: master paper, teacher copy and answer key (PDF and Word), avoiding repeats | Done | `dc3c00d`, `0c6052a`, `fcaf739` |
| F140 | M07 | School question paper as an editable Word file (.docx) | Done | `c0700e1`, `8611efd` |
| F141 | M07 | No answer booklet: questions-only CBSE question paper; booklets, cover pages and QR sorting switched off | Done | `516a44c`, `dc3c00d`, `69ff6eb`, `2a6b28f`, `b277c53`, `4b3fafd`, `9eee80e` |
| F142 | M10 | Use your own paper: upload, AI reading, chapter mapping, answer-key draft and teacher approval | Done | `b85fdac`, `19a701d` |
| F143 | M10 | AI correction: student-wise answer-sheet upload with wrong-upload checks | Done | `3c073b3`, `0483aa4` |
| F144 | M09 | School AI marking engine: two readings plus a stronger tie-break | Done | `e9a62f0`, `f0cdc31`, `04f4982`, `ab8c378`, `63dc67f`, `6be7c08`, `dc73ac8`, `4c80c56`, `c15e6ef`, `d5ada51`, `2b2f457`, `73716e2` |
| F145 | M09 | School results release, student flags, dispute window and mark lock | Done | `aa6ced4`, `13de155` |
| F146 | M09 | Rubric answer keys and AI rubric drafts for descriptive subjects | Done | `2b76241`, `f681e6f` |
| F147 | M09 | Side-by-side review of AI marking | Done | `8860d95` |
| F148 | M20 | Per-school name-area mask template and terms disclosure | Done | `1c3a1ae` |
| F149 | M14 | School Progress Report (student) and Class Progress (teacher), with Practise this | Done | `66afe0d`, `18b5a59`, `eff15e4` |
| F150 | M14 | Exam-week board for the office and the principal | Done | `a890382` |
| F151 | M16 | School messaging to parents, teachers and principal (WhatsApp through Make) | In Progress | `9986222`, `d965941` |
| F152 | M14 | School UI redesign: sidebar frame, light and dark palette, toasts, tables and welcome tour | Done | `34667f6`, `6454bb9`, `3606af7`, `f4517fd`, `75639eb`, `5429905`, `1cad521`, `c50ea62` |
| F153 | M06 | "Make paper" builder: Quick, Auto + edit and Hand-pick; swap, lock, checklist, drafts, versions, set B | Done | `2b7f307`, `1e66061`, `669e2cb` |
| F154 | M05 | Phase 2: the school's own questions in the paper builder | In Progress | none yet (plan: `docs/SCHOOLS_MODULE_PLAN.md` 16.13) |
| F155 | M02 | Student-only sign-up, share mastery with a parent, every submitted paper marked at once | Done | `086a7ba`, `7a65aea`, `a039a73`, `d32a0e9` |
| F156 | M02 | Try as guest, share button and install offer | Done | `3e96c58`, `cd1e0d6` |
| F157 | M13 | Practise one chapter or concept from the mastery view, with advice | Done | `db7f303` |
| F158 | M19 | Student activity minutes for the admin | Done | `59d2b98`, `017f40f` |
| F159 | M06 | School Half-Yearly paper blueprint (80 marks, 3 hours) | Done | `b5173ab` |
| F160 | M06 | Difficulty not student-selectable on a normal paper; Combined and Written papers always carry written questions | Done | `b5173ab`, `57baa7d` |
| F161 | M14 | Student app redesign: home, navigation, one question per page | Done | `a5734a7`, `fc30670`, `ee089bf`, `96833fb`, `158ee45`, `9804d11`, `a517628` |
| F162 | M06 | Student paper builder: Made for you card, guided steps, live summary | Done | `7858158`, `c4b0349`, `710ff5b`, `4dba2bc` |
| F163 | M07 | Maths typed as plain text drawn as maths (app, PDF papers and Word) | Done | `ae8442f` |
| F164 | M07 | Dates shown as dd/mm/yyyy in India time | Done | `807ad87` |
| F165 | M05 | Question bank for Classes 6 to 12 (NCERT Maths, Science, Social Science) | Done | `38e95f7`, `ada6aed`, `8e853bb`, `a9c0eb7`, `b38de05`, `883b74f`, `9ee925f`, `5f9fd68`, `3387020`, `e0d7326`, `5caa5a1` (representative; see `git log -- content/authoring/`) |
| F166 | M05 | DPS-style question bank rewrite | In Progress | `cde1cd8`, `aef2fe0`, `a550a85`, `baaa2a0` |

F133–F154 are PrepPlan for Schools (design: `docs/SCHOOLS_MODULE_PLAN.md`, `docs/schools/`). F155–F166 are other
unnumbered work on the student app and the question bank.
