# Verify-fixes: lk06b and ncert_polity5

Verdicts: lk06b = pass (0 HIGH). ncert_polity5 = pass on the items re-checked (0 HIGH).

Reviewer method: all 120 lk06b items were answered cold from ch06.txt (pp.93-109) and real history, then compared with the key. That covers all 72 rewritten items, every Statement-I/II and match item, and the other 48. For ncert_polity5 the 11 listed items were re-answered from ch81, ch82, ch33, ch23, ch19, ch18 and ch79. Other ncert_polity5 items were not re-answered in this pass.

## PART 1: lk06b (120 items)

HIGH: none. MEDIUM: 1. LOW: 4.

### Items the brief singled out

- **717.** Statement 1 is false (the three that refused were Hyderabad, Junagarh and Kashmir). Statement 2 ("Part B comprised ten states") is false on the page, which says nine, and also false in real history, which has 8. Statement 3 ("Part D comprised two territories") is false on the page ("solitary") and in history (only the Andaman and Nicobar Islands). Statement 4 is true (p.96). Exactly one is correct, so "Only one" holds under both readings.
- **1114.** The key "1, 2 and 4 only" holds.
  - Mizoram 23rd (20 Feb 1987) came before Goa 25th (30 May 1987), so statement 1 is true.
  - Sikkim (22nd, 1975) came before Mizoram, so statement 2 is true.
  - Meghalaya (1972) came after Nagaland (1963), so statement 3 is false.
  - Nagaland (1963) came before Haryana (1966), so statement 4 is true.
  - The page ordinals are 22nd, 23rd, 24th, 25th and 16th, 17th (pp.100-101).
- **818.** Statement-I (Part C ceased to exist after 1956) is true (p.98, "Part C states were abolished"). Statement-II is true: the page says the commission suggested abolition of the four-fold classification and the Government accepted "with certain minor modifications". II explains I (the Act and the 7th Amendment gave effect to the accepted scheme), so the key holds. A reader could argue "does not explain", but that reading is weaker. LOW.
- **820.** Ajmer to Rajasthan, Coorg to Mysore, Kutch to Bombay, Manipur became a union territory. This matches pp.97-99 and real history. The permuted options are distinct and the w-notes match the permutation.
- **1202.** Key Article 4 holds (p.95). Article 2-A, 371-F and 370 are fair distractors.
- **Stem phrases.** "According to Laxmikanth" and "as described in the chapter" no longer appear in any lk06b stem (script check).
- **Table facts.** All figures I checked match the page: Part A nine, Part B nine, Part C ten, Part D solitary, 29 total, 14 states and 6 UTs in 1956, 28 states and 8 UTs now.

### Other findings

- **MEDIUM, book table versus real history on the 1950 counts (705, 707, 711, 715).**
  - Laxmikanth's Table 6.1 puts Vindhya Pradesh in Part B (nine units) and lists Cooch-Behar in Part C (29 units).
  - The actual First Schedule had 8 Part B states (Vindhya Pradesh was Part C), so 28 units in all. The totals A+B+C = 27 and A+B = 17 follow from that.
  - **705** asks "how many units" with key 29 and the distractor "28". A student who knows the real count (28) has a defensible answer. Replace "28" with another figure such as 30, or word the stem "as listed in Table 6.1".
  - **707** statement 2 ("nine Part B states"), **711** statement 1 ("Part A and B together 18") and **715** statements 1 and 3 are true only on the book's table.
  - All of these are page-supported, so I did not rate them HIGH. 717 and 719 ("ten") are unaffected.
  - The wording "Part B nine" is also the author's own phrasing, so consider adding "(Table 6.1)" to those stems.
- **LOW, loose page lists.** 902 and 1204 list page 98 or 97 that does not hold the fact. Page 97 or 100 alone suffices.
- **LOW, near-duplicates.**
  - 1112 and 1114 test the same state-order idea.
  - 1013 and 1217 repeat the Arunachal/Mizoram facts.
  - 1011 and 1209 both cover the bifurcation of Punjab.
  - These are acceptable but add little variety.
- **LOW, Statement-I/II reasoning in 1019.** II restates the content of I, so "explains" is defensible but thin.
- **LOW, format mix.** The pack is 30 direct, 54 which, 18 howmany, 12 stmt12 and 6 match. The 2020-26 column is about 26/48/12/6 (direct, which, howmany, Statement-I/II), so statement-I/II is slightly heavy at 10% against 6%. This is harmless.

### Mechanical checks (script)

- The key equals o[0] in every item.
- There are no duplicate stems, ids or options.
- Each item has one w-note per distractor.
- In every which/howmany item, the explanation's "Statement n is correct/incorrect" list covers all statements and reproduces the key or count.
- In all six match items the w-note ("X and Y are interchanged") matches the permuted option it sits beside.
- `check-civil-pack.py` reports 0 problems.

## PART 2: ncert_polity5

HIGH: none. MEDIUM: 0. LOW: 2.

Items re-answered cold from the chapter text:

| Item | Result |
|---|---|
| 1-06 | Key "1 and 2 only" is correct (pp.815-816). Statement 3 is false: names and symbols both appear on the ballot. |
| 1-09 | Key "1, 3 and 4 only" is correct. Statement 1 is as printed on ch19 p.301. Statement 2 is false (ch19 p.301, ch18 p.278). Statements 3 and 4 are on ch18 p.277. |
| 2-12 | Key "1 only" is correct. The maximum is 500 and the minimum 60. Mizoram is 40 (Nagaland 46), so statements 2 and 3 are false (p.481). The four options are distinct. |
| 2-15 | "Only one" is correct (left forefinger, at least eight hours, public institutions, p.816). |
| 3-09 | "1 and 2 only" is correct. The Act gave the President the delimitation power, after consulting the Commission (p.821). |
| 3-12 | "1 and 3 only" is correct (p.817). |
| 3-13 | "1, 2 and 3" is correct, all three on pp.481-482. |
| 3-16 | "Only three" is correct. The 87th Amendment did not alter seat numbers (ch23 p.329; ch82 p.823). |
| 4-13 | "1 and 3 only" is correct (Police Observers are IPS, p.815). The options are distinct. |
| 4-14 | "1 and 3 only" is correct. In 2003 all state elections and by-elections used EVMs (p.816). The options are distinct. |
| 5-11 | "2 and 3 only" is correct (p.806, "four or more states"). |

- **LOW.** Stems of 1-06, 2-15, 3-12 and 5-11 still say "described by Laxmikanth" or "according to the chapter". The same stem-citation phrase appears in many other items of this pack (script check).
- **LOW.** 5-11 recognition thresholds are as printed in the book. The explanation already carries a currency note.
- **Mechanics.** The key equals o[0] in every item, the stems are unique, the statement lists in the explanations match the keys, and the w-notes name existing options. `check-civil-pack.py` reports 0 problems.

Total items answered cold: 131 (120 plus 11).

Files:
- /Users/satyanarayanareddy/claude projects /Prepplan/content/authoring/civil/polity/packs/lk06b.json
- /Users/satyanarayanareddy/claude projects /Prepplan/content/authoring/civil/polity/packs/ncert_polity5.json
