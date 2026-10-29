# Question bank in production: long answers and case studies (read-only check, 2026-10-29)

Run by the owner's request against the production database with a **read-only transaction** (`begin read only` ... `rollback`): no writes, no migrations, no fixtures. Only counts were read. The SQL is in `docs/schools/BANK_DEPTH_REPORT.md`.

"long5" is an approved written (short/long answer) 5-mark question that is not a case study; "long4" the same for 4 marks; "case" is an approved question tagged `case_study`.

## Per subject

| Class | Subject | Approved | Retired | long5 | long4 | case |
|---|---|---|---|---|---|---|
| 6 | MATH6 | 1280 | 35 | **0** | 45 | **0** |
| 6 | SCI6 | 1509 | 1460 | 145 | 3 | 148 |
| 6 | SST6 | 1781 | 1717 | 174 | 0 | 175 |
| 7 | MATH | 2295 | 2222 | 222 | 0 | 222 |
| 7 | SCI | 1460 | 1562 | 142 | 0 | 142 |
| 7 | SST | 2804 | 2994 | 274 | 0 | 274 |
| 8 | MATH8 | 1780 | 1684 | 170 | 0 | 173 |
| 8 | SCI8 | 1604 | 1577 | 157 | 1 | 161 |
| 8 | SST8 | 2640 | 2431 | 242 | 9 | 243 |
| 9 | MATH9 | 1021 | 940 | 96 | 0 | 96 |
| 9 | SCI9 | 1826 | 1731 | 172 | 2 | 172 |
| 9 | SST9 | 1167 | 1160 | 116 | 0 | 116 |
| 10 | MATH10 | 1780 | 8 | 0 | 5 | 0 |
| 10 | SST10 | 960 | 0 | 0 | 55 | 0 |
| 11 | MATH11 | 1800 | 0 | 0 | 0 | 0 |
| 12 | MATH12 | 1760 | 0 | 0 | 6 | 0 |
| 11 / 12 | PHY11, PHY12 | 2160 / 2120 | 0 | 0 | 0 | 0 |

## Class 6 Maths (MATH6)

**The older grid is what is live; the DPS-style Class 6 Maths set is not loaded.** 1280 approved questions (10 chapters, 120 to 180 each), 35 retired, and **no 5-mark long answers and no case studies in any chapter** (only 45 four-mark written questions overall). So a CBSE-style 80-mark paper for Class 6 Maths would have Sections D and E empty, exactly as for Classes 10 to 12.

## Classes 6 to 9: per-chapter depth (long5 and case studies)

| Class | Subject | Chapters | long5 min / median / max | case min / median / max |
|---|---|---|---|---|
| 6 | MATH6 | 10 | 0 / 0 / 0 | 0 / 0 / 0 |
| 6 | SCI6 | 12 | 12 / 12 / 13 | 12 / 12 / 14 |
| 6 | SST6 | 14 | 12 / 12 / 15 | 12 / 12 / 15 |
| 7 | MATH | 15 | 14 / 14 / 20 | 14 / 14 / 20 |
| 7 | SCI | 12 | 6 / 12 / 14 | 6 / 12 / 14 |
| 7 | SST | 20 | 12 / 14 / 18 | 12 / 14 / 18 |
| 8 | MATH8 | 14 | 12 / 12 / 13 | 12 / 12 / 14 |
| 8 | SCI8 | 13 | 12 / 12 / 13 | 12 / 12 / 13 |
| 8 | SST8 | 15 | **0** / 18 / 21 | **0** / 18 / 20 |
| 9 | MATH9 | 8 | 12 / 12 / 12 | 12 / 12 / 12 |
| 9 | SCI9 | 13 | 12 / 14 / 16 | 12 / 14 / 16 |
| 9 | SST9 | 9 | 10 / 12 / 16 | 10 / 12 / 16 |

Chapters in Classes 6 to 9 with fewer than 6 long answers or fewer than 6 case studies: **every Class 6 Maths chapter (10)** and **Class 8 Social Science Part II chapter 8** ("Cultural Currents: 13th to 17th Century", 0 and 0: its DPS questions are not loaded yet). Nothing else is short.

## Things seen in production that are not part of the bank (for the owner; nothing was changed)

- Test/seed subjects exist with approved questions: `MATH-SEED` (class 7, 852 approved, 24 chapters named "Sample Chapter ... (seed)" and "Adaptive fixture chapter"), `SCI-SEED` (class 7), and two `E2E-AD-...` subjects (class 7, 12 approved each, chapter "Adaptive E2E chapter"). CLAUDE.md records that fixture subjects reaching a real student's subject list has happened before; worth checking they are inactive or hidden.
- `CIVILS / POLITY`: 6909 approved, 3689 retired (the Civil Services bank; unrelated to the school module).
