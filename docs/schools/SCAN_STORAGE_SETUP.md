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

Retention keeps the amount held at one time well below the yearly total. With the default 60 days
and exams spread over the year (a test every couple of months), the most held at once is roughly a
third to a half of the yearly figure: about 8 to 12 GB (class, phone photos) or 2 to 3 GB (class,
scanner), and about 160 to 240 GB (school, phone photos) or 45 to 65 GB (school, scanner).

What this means in practice:

- **Originals dominate.** A phone photo is 15 times the size of the straightened copy.
  Asking schools to scan at 200 dpi (as the upload screen now says) cuts the storage by about a
  factor of 3.5 against raw phone photos.
- A pilot (one class, one or two exams) is a few hundred MB to a few GB: it fits any plan.
- A full 800-student school on phone photos is hundreds of GB held at once. Check Supabase's current
  storage allowance and price for your plan before such a school is on-boarded (the Free plan is
  1 GB; Pro includes 100 GB, with a per-GB charge above that). These prices change: confirm them on
  Supabase's pricing page, I have not looked them up.
- If space becomes a problem, the lever is not shrinking the original at upload (you asked that it
  never be). It is a shorter retention for a school (30 days minimum) or, later, dropping the
  original once marks are locked while keeping the straightened copy. That is a policy decision for
  you; it is not built.

## Not changed

Finished booklet print jobs (the joined PDF, kept 7 days) and their batches are still stored in
Postgres. They are generated documents with no student work in them and can be made again. Say so if
you want those moved to storage as well.
