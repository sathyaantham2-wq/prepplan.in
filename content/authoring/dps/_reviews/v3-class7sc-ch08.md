# Review v3: DPS pack, Class 7 Science, ch08 "Measurement of Time and Motion" (gecu108)

File: content/authoring/dps/class7sc/ch08.json (modified after the v2 review). Questions read: 123 of 123, every item and every case-study part.
Every key was recomputed in code or by hand before reading the stated key (multi_statement, assertion_reason, match, all arithmetic); every fact was checked against content/extracted/gecu108/pages/.

## Verdict: PASS (HIGH 0, MEDIUM 5, LOW 8)

No wrong key, no second defensible answer on any MCQ, multi_statement, assertion_reason or match item. Step marks sum to the item marks everywhere (checked in code). No positional option references. Correct option is the unique longest in 3 of 29 MCQs (10%).

## v2 findings: status

Fixed: 8.1 #10 five-way mapping (now a compare item); 8.1 #16 circular case study (alarm clock supplies the start time); 8.1 #9 hourglass start (stem now says all sand in the upper bulb); 8.2 #2 "why late nineteenth century" not in the book (item removed); 8.2 #1 strawman (now a real shift-length vs cost trade-off); 8.3 #3 and #13 (constraint added, "treat the swing as a simple pendulum" added); 8.4 #12 ECG contradiction (reframed); 8.5 #7 and 8.6 #6 decision parts now have real tension (600 m relay with 5% slowdown; tight 1:00 pm deadline with a town stretch and gate delay); 8.5 #4 and #19 and 8.6 #2 and #16 no longer copy the book's numbers or tables; 8.3 #6 unfinished option and 8.3 #14 fill_blank answer given in the stem; the carry-over easy items were largely replaced (Understand-level one-liners are gone). Remaining from v2: partial, see MEDIUM 2 to 5.

## HIGH

None.

## MEDIUM

1. C7SC-8.2 #1 (5-mark Galileo/Huygens): (a) "How old was Huygens when Galileo died?" is keyed 1642 - 1629 = 13. The book gives only years, and by the real dates (Huygens born April 1629, Galileo died January 1642) he was 12. A year subtraction cannot give an age. Fix: ask "How many years after Huygens's birth did Galileo die?" (13) or use a year-difference wording throughout.
2. C7SC-8.4 #11 case study (d): the key assigns the corridor clock to the drug chart, but the quartz timer is at least as good for it (error is only needed to the minute, and the quartz timer is more precise), so "quartz for both" is also defensible; only the ECG half is forced. Fix: say the ECG machine's timer is not a clock that shows the time of day, or ask only "which clock cannot be used for the ECG analysis, and why", or make the choice cost- or availability-driven.
3. Repetition of single ideas (chapter-wide): "N sinkings x 24 min" or "day / 24 min" in 8.2 #0, #6, #9, #13(II), #17, #19 (six items); "mass of the bob does not change the period" in 8.3 #2(b), #6(b)(d), #12(c), #13, #14, #15(d), #19 (seven); a coarse timer cannot separate close finishes in 8.4 #2, #7, #9, #15, #17 (five). Replace two or three per idea (for example 8.2 #19 or #9, 8.3 #14 or #13, 8.4 #17).
4. Unit-conversion arithmetic with no chapter thinking in 8.4: #5, #6, #8, #12, #13, #14 (six items, three of them 1-mark single conversions); also 8.5 #3(a) and #17, and fill_blank 8.2 #19 (1440 / 18) and 8.6 #9. Easy-in-disguise count is down from v2 but about 20 items (16%) are still one-step; keep two in 8.4 and convert the rest to principle items (what precision a task needs, which repeating process each clock uses).
5. C7SC-8.2 #6 option 1 ("Refloating was delayed by 30 minutes in all") is the key, but the stem never says the first float was at sunrise; a late first float would produce the same 4 h 30 min. The three wrong options are clearly wrong, so only the wording of the key is loose. Fix: add "The bowl was floated at sunrise" to the stem.

## LOW

6. C7SC-8.1 #15 (case study): the family has an alarm clock "whose face is cracked and cannot be read" yet the key sets it to ring at 5:00 am; setting it needs the current time. Say the alarm can be set by its own numbered dial, or that it already rings at 5:00 am.
7. C7SC-8.1 #1: verdict "partly right" for a claim that is false as a whole ("all four will keep working"). Acceptable, but "No, the sundial fails" is the cleaner verdict.
8. C7SC-8.4 #2: key option says the 3 ms gap is "visible only to a thousandths timer"; a microsecond timer (D in 8.4 #7) also sees it. Change "only" to "needs at least".
9. C7SC-8.4 #19: the 32,768 vibrations per second is not in the book (the book says only "tiny and very rapid"). It is supplied in the stem, so answerable, but it is outside-book content.
10. Bloom labels: no Understand-level item at all (Analyse 59, Apply 34, Evaluate 25, Create 5). Fine for the "no easy" rule; note for the loader mix if it expects a few Understand items.
11. Multi_statement 8.1 #13, 8.2 #13, 8.3 #16, 8.4 #16, 8.5 #7, 8.6 #14 use three statements (I, II, III); this is the known bank-wide inconsistency already recorded in CLAUDE.md, not a new defect. Key spread is good (false statements: I; II; III; II and III; I and III; none).
12. C7SC-8.6 #12 (AR): "6 km in every 10 minutes" fixes equal distances only at 10-minute granularity; the key (A true, R true but not explaining) is right at Class 7 level. No change needed.
13. Fill_blank items (8.1 #16, 8.2 #19, 8.3 #13, 8.4 #13, 8.6 #9): all numeric single-token answers, machine-matchable, answer not given in the stem. Pass.

## Template check (counts)

- Items per concept: 21, 21, 20, 20, 21, 20 (123). Types: 50 short_answer, 29 mcq, 24 long_answer, 6 assertion_reason, 6 multi_statement, 5 fill_blank, 3 match. Case studies: 2 per concept (12). Bloom: Analyse 59, Apply 34, Evaluate 25, Create 5.
- Assertion-reason: not-explaining 2 (8.1, 8.6), explains 2 (8.3, 8.5), A true R false 1 (8.4), A false R true 1 (8.2). Good spread.
- Claim-checks: partly right 2 (8.1, 8.5), wrong 2 (8.2 is "No", 8.4, 8.6), agree 1 (8.3). Good.
- True/False: 6 (False 4, True 2). Good.
- Scope: no use of "Exploratory projects"; no figure needed that cannot be drawn.
- Facts checked against this book: Ghatika-yantra 24 min / 60 ghatis, Samrat Yantra 27 m / 1 mm per s / 2 s / about 300 years, Arthasastra 2nd century BCE to 3rd century CE, Varahamihira around 530 CE, Aryabhata, Huygens 1629-1695 and 1656, 10 s a day, atomic clocks, late nineteenth century. All match.

## Counts read

123 of 123. HIGH 0, MEDIUM 5, LOW 8. Verdict: **pass** (fix MEDIUM 1, 2 and 5 as quick wording edits; 3 and 4 are optional polish).
