# How to restore my database from a backup

A plain-language guide for the owner. The technical version is `docs/runbooks/backup-restore.md`.

## What you already have

- **Every night at 2:00 AM (India time)** GitHub makes a copy of the whole PrepPlan database: accounts,
  students, papers, answers, marks and the question bank.
- **Each copy is locked** with your backup passphrase. Without it, nobody can open the copy, including you.
- **Each copy is tested the same night.** GitHub opens it in a scratch database and checks every table. A green
  tick means the copy really works.
- **Each copy is kept for 30 days**, so you can go back up to a month.
- **If a nightly backup fails**, GitHub e-mails you and opens an issue called "Backup failed" in the repository.

## Before anything else

1. **Don't panic, and don't delete anything.** The live database and the backups are separate. Nothing you do
   while restoring changes a backup.
2. **Never restore over the live database.** A restore always goes into a new, empty database. The restore
   script refuses to do anything else.
3. **Have your backup passphrase ready** (from your password manager or the paper copy).

## Which situation are you in?

| Situation | What to do |
|---|---|
| A few records are wrong or missing (one student's marks, some questions) | **Partial restore**: open the backup in a scratch database and copy back only what is missing. Ask Claude Code or a developer to do the copying, and check what will change before anything touches the live database. |
| The whole database is lost, broken, or the Supabase project is gone | **Full restore** (steps below). The site is down until it is done; plan about 30 minutes. |

## Full restore, step by step

1. **Pick the backup.**
   - On GitHub, open the repository, then **Actions**, then **Backup**.
   - Click the last run with a **green tick** from *before* the problem started.
   - Scroll to **Artifacts** and download `prepplan-backup-…`. It is a zip; unzip it.
2. **Make a new empty database.**
   - In Supabase, create a new project. Choose the region **Mumbai (ap-south-1)**.
   - Copy its **Session pooler** connection string (Connect → Direct → Method: Session pooler).
3. **Load the backup into it.** This needs a computer with Postgres 17 tools. Ask Claude Code to "restore the
   backup file into the new Supabase project using scripts/db-restore.sh". It asks for the new project's
   connection string and your passphrase. Type them yourself; never paste them into a chat.
4. **Check the result.** The restore ends with "restore verified: all N tables present". Anything else means
   stop and ask for help.
5. **Point the website at the new database.**
   - In Vercel, set `DATABASE_URL` to the new connection string, then **Redeploy**.
   - Don't change `BETTER_AUTH_SECRET`: changing it makes stored scan photos unreadable.
   - Everyone has to sign in again once.
6. **Update the backup secret.** In GitHub, set `PROD_DATABASE_URL` to the new connection string, so tonight's
   backup copies the new database.

## What you can lose

At most the changes since the last 2:00 AM backup, so up to one day. Saving every minute (point-in-time
recovery) needs the paid Supabase Pro plan.

## Keep it working

- **Once a month**, run the backup by hand (Actions → Backup → Run workflow) and check for the green tick.
- **If you change the Supabase database password**, update `PROD_DATABASE_URL` in GitHub the same day.
- **If the Supabase project is paused** (the free plan pauses projects after a period of inactivity), backups
  fail until you resume it in Supabase.
- **GitHub stops scheduled jobs** in a repository with no activity for 60 days. Any push restarts them.
