# Real-photo check for the scan reader (S6)

The scan reader is tested two ways:

1. **Synthetic photos** (`src/lib/schools/page-reader.test.ts`): real booklet pages made to look like
   phone photos (tilt, upside down, slanted phone, shadow, blur, grain, pen scribbles). These run every time.
2. **Real photos** (`src/lib/schools/real-scan-photos.test.ts`): photos of a hand-filled copy of the
   practice booklet. You add these. This is the check that matters, because real desks, light and
   handwriting are messier than any simulation.

## How to add real photos

1. Print `fixture-booklet.pdf` (this folder). Print it single-sided, at 100% / "actual size", on A4.
   It holds two practice students, **Practice Student One** and **Practice Student Two**, 5 pages each.
   No real names are on it.
2. Fill it in by hand like a student would: tick bubbles, write answers in the boxes, cross things out,
   make it messy.
3. Photograph every page with a phone. Tilted, in a shadow, on a crumpled desk, upside down: all welcome.
   Keep the four black corner squares and the QR code in the picture.
4. Name each photo for what it is and put it in `real/`:

   `s1-p2-anything.jpg` means Practice Student One, page 2.
   `s2-p5-shadow.jpg` means Practice Student Two, page 5.

   (`s1` or `s2`, then `p` and the page number, then a dash and any words.)
5. Run `npx vitest run src/lib/schools/real-scan-photos.test.ts`. It writes `REAL_PHOTOS_REPORT.md` here:
   how many photos sorted to the right student and page, and why any did not.

## The rule the test enforces

A page may be **unreadable** (it then waits in the teacher's "Pages we could not place" list). A page
must **never** be sorted to the wrong student or page. The test fails on any wrong sort.

## Regenerating the practice booklet

It is deterministic (fixed ids and secret in `scan-test-support.ts`), so it prints the same codes every time:

`S6_FIXTURE_DIR=test-fixtures/school-scans npx vitest run src/lib/schools/scan-fixture-booklet.test.ts`

Do not put photos of real students, or booklets of a real school, in this folder.
