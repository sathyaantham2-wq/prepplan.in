# Scan storage: what to set up, and how much space it needs

Written 2026-10-29. Scanned answer pages are **not** kept in Postgres. Each page is two sealed files
(AES-256-GCM, sealed by the app before upload) in a **private** Supabase Storage bucket:

- `original.bin`: the file exactly as it was uploaded (never shrunk or re-encoded).
- `straightened.bin`: the page turned upright and stretched to A4, used to show and mark the page.

The database row keeps only the storage key (`<school id>/<exam id>/<page id>/original.bin`, no name
anywhere in it), the status, the reason, and a quality note. While a big file is arriving in pieces,
each piece is a sealed file at `<school id>/_chunks/<upload id>/<n>.bin`; when the pieces are joined
they are deleted and only the final file stays.

After the school's retention period (default 60 days, never under 30) the daily job deletes both
files, clears the keys and sets `purged_at`. The row stays, so the record that the page was received
stays. Pieces never joined are deleted after a day.

Anyone who gets a signed link (10 minutes) must also be signed in as the school office or the teacher
of that subject. The files are served by the app (it fetches and unseals them); the bucket itself has
no public or signed URL of its own.

## What you set up in Supabase (I created nothing in your account)

1. Supabase dashboard, project `examprep-ai-dev` (the production one) → **Storage** → **New bucket**.
2. Name it exactly `school-scans`. Leave **Public bucket OFF**. Set **Restrict file size** to
   `12 MB` (a photo is limited to 12 MB; pieces are at most 3.5 MB). Leave allowed types empty
   (the files are sealed, so they are not images as far as Storage can tell).
3. Do **not** add any Storage policy. With no policy, only the service key can read or write, which is
   what we want.
4. **Project Settings** → **API** → copy the **Project URL** (`https://<ref>.supabase.co`) and the
   **service_role** key (the secret one, not the anon/publishable key).
5. Vercel → project `examprep-ai` → **Settings** → **Environment Variables**, add for the
   **Production** environment only:
   - `SUPABASE_URL` = the Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = the service_role key (tick **Sensitive**)
   - `SCAN_BUCKET` = `school-scans`
6. Redeploy. Until these three exist, a production deployment **refuses** scan uploads with a plain
   message; it never writes anywhere else.
7. The service key can read the whole Supabase project. It stays on the server (Vercel) only: never in
   a `VITE_` variable, never in the repo, never in chat.
8. **Preview deployments:** do not give them these three variables or the production `DATABASE_URL`
   (see the preview-database note in the chat report). If previews need scans, use a separate
   Supabase project and a separate bucket.

Local development and the browser tests need nothing: they write to `./.scan-storage` (git-ignored).
Automated tests use an in-memory stand-in and never touch any real storage.

## Space needed (estimate, state assumptions before relying on it)

Assumptions, all adjustable:

- A subject exam booklet has about 10 pages for an 80-mark paper and about 6 for a 40-mark test
  (the 80-mark layout built in S5 has 10 pages).
- Each student sits 5 subjects × (2 unit tests of 6 pages + a half-yearly and an annual of 10 pages)
  = **160 pages per student per year**.
- **Straightened copy:** about 0.25 MB per page (1240 × 1754 JPEG, measured 0.06 to 0.3 MB on test pages;
  heavy handwriting is larger).
- **Original:** the big unknown.
  - Phone photo, straight from the camera: **3 to 5 MB** (take 3.5 MB).
  - Scanner PDF drawn at 200 dpi and kept as lossless PNG: **0.5 to 3 MB** per page depending on the
    scanner and how much paper texture it records (take 0.8 MB for a clean black-and-white scan).
- Sealing adds 28 bytes. Nothing else is stored per page.

| | Pages per year | If most uploads are phone photos (3.75 MB per page) | If most uploads are scanner PDFs (1.05 MB per page) |
|---|---|---|---|
| One class of 40 students | 6,400 | about **24 GB** written | about **6.7 GB** |
| One school of 800 students | 128,000 | about **480 GB** written | about **134 GB** |

### How long each file is kept (owner rule, 2026-10-29)

- **Original upload:** deleted **7 days after that exam's marks lock** (the row keeps its status and gets
  `original_purged_at`; the key is cleared; the deletion is logged in `audit_log` as
  `school.scan_originals_purged`, once per exam with the number of pages). The lock itself is set by the
  lock job in a later step (`school_exams.marks_locked_at`); until an exam is locked its originals are
  not touched by this rule. They still fall under the school retention below as a backstop.
- **Straightened copy:** kept for the school's retention period (default 60 days, never under 30), then
  deleted; the row stays marked `purged_at`.
- **Pieces of an upload** (while a big file arrives): deleted when joined, or after a day if never joined.
- **Booklet print PDFs:** sealed files in the same bucket (`<school>/<exam>/_print/<job>/result.bin`),
  deleted 7 days after the job; the batches are deleted the moment they are joined.

A page therefore lives about: original 3 to 5 weeks (marking, review, release, the 7-day dispute window,
the lock, then 7 more days); straightened copy up to 60 days; nothing is held longer than that.

### What is held at one time (updated with this rule)

The table above is what is **written** over a year. What sits in storage at once is far less. The
biggest moment is right after a half-yearly or annual round (10 pages × 5 subjects per student =
50 pages per student). Assume one big round of originals is present, plus about one and a half rounds of
straightened copies (60 days):

| Peak held at once | Phone photos (3.5 MB original) | Scanner PDFs (0.8 MB original) |
|---|---|---|
| One class of 40 (2,000 pages a round) | about **7.8 GB** (7.0 originals + 0.75 straightened) | about **2.4 GB** (1.6 + 0.75) |
| A school of 800 (40,000 pages a round) | about **155 GB** (140 + 15) | about **47 GB** (32 + 15) |

Between rounds it falls to the straightened copies of the last two months, a few GB for the whole school.
If the lock is late (for example a dispute drags on), originals stay longer; the school retention period
still caps them.

Compared with keeping originals for the whole retention period, this saves about 15 to 35 percent at the
peak (more for a school whose rounds are close together), and nothing is lost that marking needs: marking
uses the straightened copy. Phone photos are still the biggest cost, about three times a scanner at
200 dpi; the upload screen says so. Check Supabase's current storage allowance and price for your plan
before an 800-student school is on-boarded; I have not looked the prices up.

## Nothing else is stored in Postgres

No school table has a column that can hold file bytes (a test checks every `school_*` table). The
only thing left is `school_exams.marks_locked_at`, a date.
