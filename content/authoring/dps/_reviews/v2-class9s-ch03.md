# Review v2: Class 9 Social Science, Part I ch 3 "Atmosphere and Climate" (iest103)

File: content/authoring/dps/class9s/ch03.json (6 concepts, 122 items). Chapter file not edited.

## Method
- All 22 textbook pages (iest103/pages/001-022) read; every fact checked against them.
- Every number recomputed in code before reading the author's answer: pie total and 'others' 0.03; 78/21 = 3.71; bead counts 7800/2100/93/4/3 (sum 10000); layer thicknesses 38 km, 30 km (8 km difference), scale 3.8 cm, 2.4 cm, 124 cm, 7 m; rainfall mean 111.4 cm; Leh-Chennai 33.0; Chennai June-Sep 36.4 cm and Oct-Feb 85.4 cm; mid-values 12.5 and 36 (difference 23.5); season months 4+3+4+3 = 14; Moon arithmetic (nakshatra 24 and 7, 2 rounds, 60 = 2x27+6); footprint totals and averages (9/6/4; 2.0/2.33/2.0); Ananya 7 to 5. All correct.
- Programmatic: every mcq/match/AR/multi_statement key text is present as an option (key is stored as option 0 throughout); no duplicate options; no positional references ("all of the above", "option b") except the standard AR wording; rubric marks sum to item marks for all short/long answers; the key is the longest option in only 6 of 27 mcq, so no length cue.
- The loader --check could not be run (needs .env); format not machine-verified.

## Counts
HIGH 0, MEDIUM 6, LOW 9.

## HIGH
None. No wrong key, no unfaithful fact, no unanswerable item found.

## MEDIUM
1. C9S-3.5 [9] (2 marks) "In which season and in which months does the landmass heat up faster?" Key "summer, June to September". The chapter says "during summer" the land heats faster, and C9S-3.4 teaches summer as April to June, while June to September is the monsoon season. A student answering "summer, April to June" has a defensible second answer. Fix: ask only about the pressure and wind direction, or ask which months the south-west monsoon blows.
2. Scope: three case studies and one mcq compute from Table 3.3 (3.3 [2] Nagpur 124 cm, 3.3 [20] Leh/Delhi/Chennai, 3.5 [20] Chennai monthly rain). The scope file lists "calculations with the data table of ten stations" as out of scope except as the DIY exercise, and the table is labelled representational. Defensible because the stem gives the data and the chapter's exercise 7 uses it, but the owner should accept or swap for stem-supplied data.
3. C9S-3.5 repeats one idea three times and it is off the monsoon: Moon/27-nakshatra arithmetic in [6] (54 days = 2 rounds), [10] (10 days; 60 = 2x27+6) and [19](b) (nakshatra 24 and 7). The sidebar is context, not a concept; [6] is trivial division. Replace [6] and [10] with monsoon-mechanism items.
4. C9S-3.2 [18] (case study) Aim X "smooth cruise with no clouds": every flight "straight up" passes through the troposphere weather first, so the logic rests on where the flight ends. Flights 3 and 4 also cross the stratosphere. Mostly fine, but state that only the cruise layer counts.
5. C9S-3.3 [19](d) decision on which boats get engines is not anchored in anything the chapter says (land breeze is low speed; sea breeze direction). The "answer" is hand-waving and the rubric would accept almost anything. Tie the choice to the 2 vs 4 pressure difference explicitly or drop (d).
6. C9S-3.3 and C9S-3.5 each carry 21 items (one extra short_answer: 3.3 has 9, 3.5 has 9). Other concepts have 20. If the loader expects exactly 20, drop one weak short answer (suggest 3.3 [12] weather vs climate definition and 3.5 [13] Mission Mausam).

## LOW
1. Easy-in-disguise, labelled Hard but pure recall or table lookup: 3.1 [6] (78+21 = 99), 3.3 [6] (easterly), 3.3 [7] (list of five elements), 3.3 [12] (define weather/climate, labelled Apply), 3.4 [2] (Table 3.2 lookup), 3.4 [6] (next Ritu is Sharad), 3.4 [12] (name Arthashastra), 3.5 [13] (Mission Mausam aims), 3.6 [7] (nitrogen not a greenhouse gas), 3.2 [17] (5 marks, list five layers; labelled Evaluate but is description).
2. 3.4 [6] key "Sharad" versus the book's "Sharad with diacritic": accept variants in marking.
3. 3.4 [4] multi_statement has all three statements true and copied from the text; no false statement to catch.
4. Weak distractors in several mcq: 3.1 [1] options 2 and 3, 3.2 [3] option 2 (troposphere cloud-free), 3.5 [2] option 3, 3.6 [1] options 1 and 3.
5. Strawman claims: 3.6 [13] Kabir (two absurd claims in one), 3.6 [14] "purely natural", 3.1 [18] poster 3 and 3.1 [19] Chetan are signposted errors; fine as practice but not demanding.
6. 3.4 [18] re-states winter as "December to March (4 months)" while the chapter says "December to early April". The stem declares the committee's simplification, so the arithmetic is valid, but it drifts from the text.
7. 3.5 [11] answer list includes "daily life" while the stem says "touches the daily life of people", slightly circular.
8. 3.6 [18] (c) "what does the chapter call its worst choice" is only a High-impact label, not a "worst choice" phrase; wording loose.
9. Bloom/difficulty labels run high across the board (everything "Hard", most 1-mark mcq tagged Analyse/Evaluate), which will blunt the difficulty mix in adaptive selection.

## Checks passed
- Keys: all AR outcomes distinct enough (3.1 not-explanation, 3.2 explanation, 3.3 A true/R false, 3.4 A false/R true, 3.5 not-explanation, 3.6 explanation); false statements spread across 1, 2, 3.
- Facts all from this book (pages 39-57); nothing beyond it found. Punjab floods items match pp 54-56 exactly. Aurora, nakshatra, Arthashastra, Meghadutam items match the sidebars.
- Case studies compute from stem data and have genuine, mostly open decisions; each of (d) names a trade-off.
- No positional option references; no repeated items except note MEDIUM-3.

## Verdict
PASS (no HIGH; MEDIUM items are small and fixable in one pass; recommended before load: MEDIUM 1, 3, 5, 6).
