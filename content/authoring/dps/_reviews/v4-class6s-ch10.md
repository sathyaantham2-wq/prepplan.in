# v4 final verification: class6s ch10 (SST6, fees110, Grassroots Democracy Part 1)

Pack read: content/authoring/dps/class6s/ch10.json, 122 questions. Compared by text against orig.json: 52 changed or new items, all
reviewed individually (plus unchanged 10.1 [8], 10.3 [1], [6], [7], [18], [19] for the points you named). Every key decided before reading it;
all numbers recomputed in python; facts checked against content/extracted/fees110/pages/ (149-161).

## HIGH (0)
None. No wrong key, no second defensible answer on any option item.

## MEDIUM (1)
M1. C6S-10.3 [11] (hill-district case study), part (c) "Did the State's teams go home when the army arrived on Day 6?" The stem never
says what the State teams did, so "No" is an inference from the book's "the Central Government may also come to help", not a fact the
student can read off. Smallest fix: "Should the State's teams have gone home when the army arrived on Day 6? Explain." (key unchanged).
Also part (d)'s "taking them away from the rest of the State" goes slightly beyond the book; harmless, but the rubric should rest on the
"closest level first" line only.

## LOW (9)
L1. 10.5 [5], [10], [12], [16] say "the State list / the Central government's list". scope_out bars the formal Union/State/Concurrent
Lists. The items mean the executive-functions column of Fig. 10.5, but the word "list" invites the formal one. Say "the table's State column /
Central column".
L2. 10.6 [3] (class without a monitor) is the book's own sentence ("one representative can be selected for this specific purpose") almost
verbatim; recall in a scenario wrapper. Add a second constraint (e.g. the principal sees only two people) or accept as the one easy-ish item.
L3. One-line table or text lookups: 10.4 [13] (All India = National level; Supreme Court), 10.4 [9](a) (High Court), 10.3 [0] (State level;
legislature; distractor "Legislature level; State organ" is not a real confusion), 10.6 [14] (pick the line).
L4. Steering decisions: 10.5 [5](d) (stem says doctors already cope, so Irrigation is obvious), 10.6 [13](d) (stem makes a direct vote clearly
feasible), 10.6 [18](d) (rubric lets "speed" earn the mark only if it answers a risk the report itself supplies). Each has an "either with
reason" rubric so none is a strawman by the key, but the stem tilts the answer. Optional: add one stem fact favouring the other side.
L5. 10.3 [1] statement 3 ("Apart from India, democratic countries have government at only one level") touches scope_out's non-Indian systems;
rewrite as an Indian-only false statement. 10.3 [6] names a "local court" (scope_out: courts below the High Court); say "district-level
court" is worse; better "a court in my town" is fine, or swap for "the Supreme Court, the High Court and the Lok Sabha".
L6. 10.2 and 10.6 hold 21 questions; the other four hold 20. The bank standard is 20 per concept: drop or retire one before load.
L7. 10.6 [8] A/R: "R not the correct explanation" is defensible and argued, but a reader could call R a fair description of how the vote
works; consider making R "Every member's own opinion is taken" with A made false to remove the argument.
L8. 10.6 [20] correction says India is largest "because" of 970 million voters; the book says "with some 970 million voters". Use "with".
L9. 10.4 [7] Tanmay's Lok Sabha/Vidhan Sabha pairing is also defensible as a pair; the rubric marks only the Rajya Sabha clause wrong.
Make the rubric say so.
Skeleton: 10.2 ends with two consecutive 5-mark long answers (indices 19, 20); 10.4 and 10.5 also end on a long answer at 19 or 18-19.

## The things you asked me to confirm
- Opening quotes: no question in the pack mentions the Mahabharata verse or Menchu Tum any more (grep clean). The old 10.1 [8], [9], [14]
  items are gone; scope risk closed. 10.1 [8] is now a claim-check on law vs rule (in scope).
- 10.6 one adult per family: fixed (stem "one adult voting for each family"; part (a) "one adult from every family"). Arithmetic
  300/12 = 25, 300/150 = 2, 9 x 25 = 225 correct.
- 10.3 motto: rewritten as [9]; sound (Yato Dharmastato Jayah is the Supreme Court's, p.156). In scope_in.
- "Local level first" keys (10.3 [1] statement 1, [2](i), [3], [11](a), [16], [18]): supported by the stem plus the book's flood
  ("if it is not too severe, the local authorities may be able to deal with it") and bulb ("first check the bulb") passages. Not HIGH. [16] reversal
  has one clear NOT (border talks = Foreign Affairs, Central column); the three local items are all single-lane, single-village faults.
- Numbers recomputed: 10.2 [7] executive 4 of 6; 10.4 [14] 900, 700, 400 left, 750 > 400, both singly fit; 10.5 [5] 300 beds, 80%, 50 a day;
  10.6 [5] 38 present, red 21, blue 19; 10.6 [10] 5; 10.1 [7] 7. All match keys.
- Format checks: option items have the key at o[0]; every step list sums to its marks; no position-named options (grep clean); matches
  (10.2 [13], 10.4 [3], 10.5 [12]) each have exactly one consistent mapping; figure item 10.3 [2] describes its pyramid in full.

## Counts and template
- Types: short_answer 48, mcq 28, long_answer 26, assertion_reason 7, multi_statement 6, fill_blank 4, match 3. Marks 1:48, 2:30, 3:18, 4:13,
  5:13. Bloom: Analyse 77, Evaluate 25, Apply 14, Create 6 (no Remember, no Understand, no Easy). Hard 92, Hardest 30.
- multi_statement keys: 1&3, 2&3, 1&2, 1-2-3, 1 only, 2 only (one each: well spread). AR verdicts: explain 2, not-explain 2, A-false 2, R-false 1.
- true_false 10: True 3, False 7. claim_check 8: No 3, Partly 3, Yes 2.
- Correct option is the longest in 2 of 28 MCQs (10.2 [1], 10.3 [3]): 7%, fine.
- Settings varied (Kochi, Mysuru, Tiruppur, hill district, school, club). Not templated.

## Per-concept verdicts
- C6S-10.1: keys sound; load-ready.
- C6S-10.2: keys sound; load-ready (21 items, see L6).
- C6S-10.3: keys sound; load-ready after M1.
- C6S-10.4: keys sound; load-ready.
- C6S-10.5: keys sound; load-ready (L1 wording).
- C6S-10.6: keys sound; load-ready (21 items, see L6).

Counts: 122 read, 52 changed items reviewed individually. HIGH 0, MEDIUM 1, LOW 9.
Verdict: load-ready. M1 is a one-line stem reword that should be done first; L6 (21-item concepts) is a bank-count decision for the owner; the rest is optional polish.
