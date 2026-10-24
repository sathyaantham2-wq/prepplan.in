# Review v2 (independent, merged): Class 6 Maths ch04 "Data Handling and Presentation" (dps/class6/ch04.json)

Read: all 124 questions (4.1: 22, 4.2: 20, 4.3: 20, 4.4: 20, 4.5: 21, 4.6: 21), no sampling, plus textbook pages
001-044 of fegp104. Every number, tally, ratio and rounding was recomputed in python before the stored key was read;
every case-study part was recomputed in order. Programmatic checks: every mcq/match/AR/multi_statement key text is one
of its options (0 failures); no duplicate options; no positional option references (0 hits); short-answer step marks
sum to the item marks; 5-mark items sum to 5; case studies are 4 marks with stems of 90 to 139 words.
Item numbers are the 0-based index inside the concept, in file order. An earlier review file existed at this path; its
findings were re-checked against the pages and merged here (credit noted where I added to it).

## HIGH (2)

1. **C6M-4.3 [5] multi_statement: keyed "1 and 3 only", but all three statements are true.**
   Bars 1.5, 12, 10, 8, 7, 6 units at 100 vehicles per unit. Statement 2: "From 7-8 a.m. to 8-9 a.m. the traffic fell by
   200 vehicles": 1200 to 1000 is exactly 200, TRUE. Statements 1 (about 150) and 3 (800) are also true. The correct
   option is "1, 2 and 3" (present among the options), so a student who reads correctly is marked wrong.
   Smallest fix: make Statement 2 false, e.g. "fell by 2000 vehicles" or "rose by 200 vehicles"; keep the key
   "1 and 3 only" (4.6 [5] is already "1, 2 and 3", so do not change the key instead).

2. **C6M-4.5 [10] short_answer 2m: the model answer states a false fact.** Part (b) key: "...the two mountains are close
   in height, much closer than the others." Gaps between neighbours: Everest-Aconcagua 1886 m, Aconcagua-Denali 768,
   Denali-Kilimanjaro 299, Kilimanjaro-Elbrus 253, Elbrus-Vinson 750, Vinson-Koscuiszko 2664. Kilimanjaro-Elbrus
   (253 m) is closer than Denali-Kilimanjaro (299 m). Smallest fix: end the answer "...so the two mountains are close
   in height (299 m apart)" and delete "much closer than the others" (adjust the step text to match).

## MEDIUM (12)

1. **C6M-4.4 [14] claim_check (Mohan, tigers, scale 1 unit = 50).** The key rejects the scale because "74 units is far
   too tall for an ordinary page", but the stem gives no page height, so nothing stated rules it out and "clear" cannot
   be rejected. Fix: add "on a chart that can hold bars up to 10 units tall".
2. **Template: identical slot order in all six concepts.** Sequence is mcq x5, multi_statement, assertion_reason,
   fill_blank/match, then 2-mark items, three 3-mark (claim, claim, reverse/show_impossible), 5, 5, 4, 4 in every
   concept; every case study ends in a "recommend between plans" decision. Fix: reorder and vary at least three
   concepts (show_impossible earlier in two, give a concept one 5-mark and three 4-mark items, move true_false and match,
   make two case studies something other than a two-plan choice).
3. **Repeated idea, C6M-4.5 (bar direction).** About nine to twelve of 21 items turn on "heights upward, so vertical;
   lengths along the ground, so horizontal": [0], [1], [5], [6], [9], [12], [14], [15], [16], [17](d), [18](a), [19](a),
   [20](d). [6] (AR) and [14] (claim) are the same tallest-person-in-each-class question; [14] and [15] are the book's
   own two Figure-it-Out questions with "Dev says"/"Rani says" added. Fix: cut to about four and add other 4.5 ideas
   (fit to space with an unusual scale, colour/decoration not changing accuracy, reading a comparison off a column graph);
   change the settings (rainfall in a district, length of a corridor).
4. **Repeated idea, C6M-4.6 (Everest "twice" Elbrus).** 2 x 5642 = 11,284 against 8848 is the heart of [0], [7], [9],
   [16] and [20](a)(b); the triangle-width calculation is both [10] and [17](a)(b). Keep [0] or [16] and [20]; turn the
   rest into other misleading-presentation ideas the book supports (unequal widths, a decoration that changes width,
   the rainfall-drop style of [19], symbols drawn bigger instead of repeated); merge [10] into [17].
5. **Repeated ideas, C6M-4.1.** Multiply-by-frequency (Kabir/Leena hockey [4] and Sonu hockey [15], both goals) and
   "the table cannot say which child chose which" twice ([3] and [16], the same Mr Das numbers 6, 9, 13, 3, 7, both from
   the book's example). Vary [15]'s setting and replace or rework [16].
6. **Repeated frame, C6M-4.4.** [10], [13], [14], [16], [17], [18], [19] are all "values, a page holds N units, compare
   two or three scales, recommend". Keep [16] and [19]; make [17] "find the scale from two bars" and [18] "which bar is
   wrongly drawn".
7. **Easy in disguise (a one-step computation or a line the book states, labelled Hard).** 4.1 [0] (3x5+4), [7] (8+11+6+5),
   [12] (Pari, the book's Q4) and [13] (data v frequency definitions); 4.2 [0], [3], [7] (54/6) and AR [6] (the book's
   own sentence as R); 4.3 [0], [1], [3], [7], [9], [10], [12] (why equal width: a book bullet); 4.4 [1], [4] (order of
   drawing steps), [6] (AR from the book), [7], [9], [12] (describe axes, a book step list); 4.5 [7] (8848-2228), [12]
   (the book's river answer); 4.6 [1], [3] (what is an infographic), [8] (T/F whose answer is the chapter moral), [11], [12].
   Fix: add a second step or a trap (a half symbol plus a changed key; a bar that stops between marks plus a comparison;
   a blank needing two conversions) or replace with an Analyse item. In particular make 4.6 [8] a False statement.
8. **C6M-4.2 [11]** "Find a key that shows both numbers (33 and 27) with whole symbols only": keys 1 and 3 both work, and
   part (b) has opposite answers for them (35 exact with key 1, not with key 3). Fix: "the largest key" or "does
   1 symbol = 3 show 35 exactly".
9. **C6M-4.6 [11]** The stem says "even though no data value has been changed", but the second key way ("bars reshaped
   into unequal pictures") is vague and the book's mountain-range example does change apparent heights. Fix: use "a picture
   whose area grows faster than its height makes a small difference look big".
10. **C6M-4.4 [18](d)** "...and what does it cost?" No cost is defined in the stem. Delete the phrase or give a cost.
11. **Soft case-study decisions.** 4.1 [21] (shoes): parts (b) and (c) are boxes-of-5 and rupee arithmetic, and (d) says
    "either choice is acceptable" so no decision is defended (4.1 [20] likewise). 4.2 [18] (samosas): (c) is profit
    arithmetic, not the chapter, and (d) is "either acceptable"; 4.3 [18] (bus depot): the extra bus gains Rs 200 on both
    days, so (d) restates the arithmetic. Fix: add a constraint that makes the options close (an extra bus at Rs 2100, a
    frequency-reading step such as "only children above size 5 are eligible") and make (d) turn on one computed number.
12. **C6M-4.3 [19] case study (a) is free.** The stem lists the bars "8, 5, 1, 10, 9, 0, 9 and 5 units"; "which match has no
    visible bar" is read off the stem. Fix: ask for the runs in Match 3 and Match 6, or describe Match 6 as a missing bar.

## LOW (7)

1. C6M-4.1 [6] AR: R ("equal values sit next to each other") is true but does not explain why frequencies stay equal;
   defensible key, yet arguable. Safer R: "Arranging in order only changes positions, not the values."
2. C6M-4.2 [6] AR: A is a narrative ("Jarina used 1 symbol = 5...") rather than a claim; rewrite A as "A key of 5 suits
   attendance values from 20 to 35".
3. C6M-4.4 [3] (Tara): two options are visibly silly ("extremely tall indeed", "as many units as there are hundreds");
   make them real confusions (multiplying instead of dividing; using the smallest value as the scale).
4. C6M-4.4 [8] T/F: the True verdict is plain proportion with no misconception; use "changing the scale changes the data"
   (False). Same weakness in 4.5 [8]. The chapter's verdicts are 3 True / 3 False, so the mix itself is fine.
5. fill_blank items are one-step arithmetic (4.1 [7], 4.2 [7], 4.5 [7], 4.6 [7]); replace two with a reasoned blank
   such as "the largest whole key for 40, 60, 100 and 80 is 1 symbol = ___".
6. C6M-4.1 [1] needs "a leap-year February has 29 days", a fact not in this book (use the book's own fixed fact, the
   capital of India, or a fixed calendar fact). 4.1 [18](d): "Samosa is cooked for everyone who chose it" adds nothing.
7. C6M-4.5 [5] Statement 2 ("colour and pictures are separate from whether the data is correct") is true for colour
   but the chapter shows pictures can mislead; reword to "colour alone does not change the data".

## Checked and fine

- multi_statement keys: 4.1 "2 and 3 only", 4.2 "1 only", 4.3 (wrong, HIGH 1), 4.4 "3 only", 4.5 "1 and 2 only",
  4.6 "1, 2 and 3": well spread (three-statement form, as the DPS standard asks).
- assertion_reason keys: 2 "explains", 2 "does not explain", 1 "A true R false", 1 "A false R true". Every A/R truth value
  checked; 4.3 [6] R (divided instead of multiplied) is correctly false.
- claim_check verdicts (12): No 6, Yes 3, Partly 3. true_false: 3 True / 3 False.
- Correct option strictly longest in 5 of 30 mcq (15%); including ties 15 of 30, but the ties are numeric options of
  equal length. Not a length tell on its own (an earlier count of 51% counted ties and non-mcq items).
- Bloom: Analyse 47, Apply 38, Evaluate 28, Understand 7 (5.6%), Create 4; Analyse/Evaluate/Create = 64%.
- Case-study arithmetic all correct: 4.1 [18]-[21] (13/6/6/5; 13/10/8/5; pairs Rs 4300, 5800, 6000, 4500 covering 21,
  18, 18, 13 students; 8 boxes, Rs 8000 v Rs 8250), 4.2 [18]-[19], 4.3 [18]-[19], 4.4 [18]-[19], 4.5 [19]-[20]
  (6.4 cm, 1.4 cm), 4.6 [19]-[20].
- Scope: nothing violates scope_out (no mean/median, pie, line, histogram, range as a named measure, double bar,
  probability, sampling). The goal-total items use the book's Mayank multiply-and-add idea without the word "mean".
- Mountain data, sweets table, Smriti's runs and "Koscuiszko" spelling match the book. No fact beyond the book except
  4.1 [1] (leap year) and the profit idea in 4.2 [18].

## Per-concept verdicts

- C6M-4.1: pass after fixes (repeated hockey/Mr Das ideas, soft case-study endings, easy items). Keys correct.
- C6M-4.2: pass after fixes ([11] ambiguity, [18] profit and soft decision). Keys correct.
- C6M-4.3: fix required: [5] wrong key (HIGH); [19](a) free; [18](d) soft.
- C6M-4.4: pass after fixes ([14] missing page height, [18](d), repeated page-fit frame). Keys correct.
- C6M-4.5: fix required: [10] false claim (HIGH); about a third reworked (the bar-direction idea and book copies).
- C6M-4.6: pass after fixes (Everest/Elbrus and triangle repetition; [11] premise; easy items).

## Counts

124 read; 2 HIGH; 12 MEDIUM; 7 LOW. Templated: partly (identical slot order in every concept and a few repeated
ideas, but item frames inside a concept vary). Overall: pass after fixes.
