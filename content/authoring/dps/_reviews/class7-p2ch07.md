# Review: Class 7 Maths Part II ch 7 "Finding the Unknown" (gegp207)
File: content/authoring/dps/class7/p2ch07.json. Questions read: 146 of 146 (7 concepts, 20-21 each), none sampled.
Method: every equation, trial value, check and case-study part was recomputed in Python with exact fractions (linear solver; sympy not installed) and by substitution; every history fact was compared with pages 019-021 of content/extracted/gegp207/pages/. Structure/scope: "Part II Ch 7" in content/structure/class7-maths-part2.md.

Headline: **no arithmetic or key errors.** All 146 keys recompute. Two HIGH findings are answerability defects in case-study decision parts (a second defensible answer). The rest is textbook reuse, repeated moves and mild template structure.

## HIGH (2)

1. **C7M-7.2 [19] case study "Bhavna's savings jar", part (d).** Stem: "The shop raises the price to Rs 380 after the end of that month." The jar holds Rs 350 exactly at the end of month 8, and the price rises only *after* that month, so "buy at once" is fully defensible. The key ("short by Rs 30; wait until month 9") assumes the price is already 380 at the end of month 8. Fix: "The shop raises the price to Rs 380 on the day of her 8th deposit (before she can buy)", or ask "Rs 350 now; the price will rise to Rs 380 in a month. What should she do?" and key it on the stated timing.

2. **C7M-7.6 [19] case study "Aman and Bela", part (d).** "Whose working deserves more marks?" Key: Bela. But each student makes exactly one slip (Aman: 2 not multiplied by 5, then every later step is correct for his line; Bela: 3x added instead of subtracted, everything else correct). "Equal" or "Aman" is equally defensible, and the key's own check (both answers fail) does not separate them. Fix: give one of them a second error (for example Aman also slips on "-4"), or change (d) to a decision the data settles, such as "which slip would a substitution check expose in the *first line*?".

## MEDIUM

3. **C7M-7.5 [19] case study "Tuition Centre X / Y", part (d).** The stem never says which of Y's two fees applies to Ishita's 24 sessions. With Y's first fee X is cheaper (Rs 1400 v Rs 1500). The key uses the new fee. Fix: "(d) Using Y's new fee, ..." (the decision itself, Y saves Rs 20, is a good real trade-off).

4. **Textbook items reused with the numbers unchanged, C7M-7.6.** Seven items are the book's own "Mind the Mistake" and Q11 equations: [0] 4x+6=10; [2] 2v-4=6; [3] 7-8z=5; [5] 6x+9=66 -> x+9=11; [7] AR on 4x+6=10; [13] Rahul on 4x+6=10; [14] 7-8z=5, z=4. A student who did the exercise recalls the answers. Also the same 4x+6=10 slip is tested three times ([0], [7], [13]) and 7-8z=5 three times ([3], [14] and the book). Fix: keep one verbatim, change the rest to new equations of the same mistake type (for example 5y+3=18 written as 5y=18+3).

5. **Textbook reuse elsewhere (the standard asks for no "numbers-only" copies).**
   - C7M-7.1 [13] is the book's Math Talk question verbatim (exactly 200 sticks) with a name added. [14] uses the book's 4+2y=16.
   - C7M-7.2 [3] and [5] reproduce the book's trial table (n=30 -> 61, 40 -> 81, 50 -> 101). [8], [12] and [15] are all 5x-4=7 (book Math Talk).
   - C7M-7.3 [0], [4], [7], [9], [11], [8] (u/15=6) use Figure it Out Q1 (a), (b), (c), (e) verbatim; [5] is Example 10 verbatim; [18] is Q18 (c) and (e) with changed numbers; [12], [13] are Q2 (c), (d) re-numbered.
   - C7M-7.4 [4]/[17] Imran-Zoya is Example 9 with new numbers; [11] is Q6 (taxi); [14] is Example 8 (plates + delivery) with new numbers; [7] and the match use Q7 (sum 76, three times) and Q17 verbatim.
   - C7M-7.5 [8]/[7] is the book's y+1=6 / 3y=15 chain; [17] is the book's closing magic trick verbatim (x2, +10, /2, -x, +3 = 8).
   - C7M-7.7 [9], [10] are the book's own formula examples (5x+4=3x+8, 2x+3=4x+5); [18] is the Bakhshali problem with 132 changed to 165; [17] is the horses problem with new numbers; [19] mirrors Example 9.
   Fix: at least 2 per concept should be genuinely new settings. The new case studies (7.4 caterers, 7.5 tuition centres, 7.7 Oma) are good models.

6. **Same reasoning move repeated: "n comes out as x.5 / parity, so impossible".** C7M-7.1 [13], [17](c), [19](d); C7M-7.2 [20](d); C7M-7.4 [15], [20](c)(d). Also "same rate on both sides so never equal / 2=5 false" appears in C7M-7.5 [14], [15], [18](i), [19](a)(b) and C7M-7.7 [14], [15], [19](d), where [14] and [15] are near-duplicates (A = C, subtract, false statement). Fix: drop C7M-7.7 [15] or turn it into a "find D so the equation has no solution" item; change two of the parity items to a different impossibility reason (for example a negative count).

7. **C7M-7.2: 5x-4=7 asked three ways** ([8] mcq, [12] SA, [15] SA3, all the same insight "solution 11/5 is not whole"). Keep [8] or [12]; replace [15] with a new equation.

8. **Claim-checks lean to "No" (6 of 7; only C7M-7.3 [14] says Yes) and two are strawmen.** C7M-7.2 [14] Meera contradicts a sentence the book states outright (all four operations keep equality); C7M-7.7 [14] Sara is the exact A = C case the lesson warns about. Fix: make two verdicts "yes" or "partly right" (for example "Meera is right that subtracting works, wrong that multiplying breaks it").

9. **Decisions that are forced by the stem (strawman-lite).** C7M-7.6 [20](d) prints the rule "all three right" so the answer is automatic; C7M-7.5 [20](d) is read off (c); C7M-7.2 [20](d) "whole-number trials can never succeed" is obvious; C7M-7.3 [19](d) "substitute to check" has no competing option. Fix: add a cost or a trade-off (time, confidence) to one or two of these.

10. **C7M-7.7 [7] AR:** "The word 'algebra' comes from the Sanskrit word bija" is keyed false, but the book says "bijaganita, also now known as algebra". A student can read A as true. Fix: "The English word 'algebra' comes from the Sanskrit word bija." Also the AR keys otherwise vary properly (explains in 7.2, 7.4, 7.6 only).

11. **C7M-7.7 [8] match:** "kā ... a second unknown" claims more than the book ("kā and nī referred to the first letters of colour names"). Fix: "first letter of kālaka (black), another unknown".

12. **Inequality flavour (scope_out says "quadratics and inequalities"):** C7M-7.3 [20](d) "at least Rs 50 ... largest number of helpers"; C7M-7.1 [18](d) "at most 140 kg, at most 23 sacks"; C7M-7.4 [19](d) "B is cheaper for groups above 70" (only 45 and 90 are tested, so "above 70" is asserted, not shown). All can be answered by comparing numbers, so not a violation, but keep the 7.3 wording to "exactly" or test both sides of 70.

## LOW

13. **Free marks / weak parts.** C7M-7.5 [11] states x = 7 in the stem and asks for it ("State its solution"). C7M-7.5 [13] is two trivial solves labelled Analyse. C7M-7.5 [20](d) restates (c). C7M-7.1 [18](b) tells the student the operation ("Remove one sack and 2 kg"), so (b) is recall. C7M-7.3 [19](d) "one habit that catches both slips" has a single obvious answer.
14. **Distractors / option length.** The correct option is clearly the longest in C7M-7.2 [8], C7M-7.3 [4], C7M-7.4 [0] and [5], C7M-7.5 [1], C7M-7.6 [1] and [4], C7M-7.7 [5] (stated as longest by 30% or more). Several wrong options are not chapter confusions: C7M-7.2 [8] "5x-4 cannot be evaluated for x=1", C7M-7.4 [5] "forgot to include the fare 228 on the left". Use the book's real slips (divide only one term; move a term without changing its sign).
15. **Answer key wording.** C7M-7.3 [19](c) "moved -5 as -5 to the other side instead of +5" is hard to read; say "wrote 16 - 5 instead of 16 + 5". C7M-7.6 [9](a) mixes two slips (the sign of 9 and the sign of 2k); name one. C7M-7.6 [8](a) is muddled ("3 was taken from 12 instead").
16. **Step marks.** All real, none generic. One weak one: C7M-7.7 [17] "Uses the debt as a negative amount throughout" is not a separable step; fold it into part (c).
17. **Reading level / realism.** C7M-7.3 [19](b) asks for arithmetic in elevenths (92/11 v 260/11), which is heavy for a 1-mark part. C7M-7.3 [20] "honorarium shared among student helpers" is an odd setting. The rest are realistic Indian settings (Nashik grain merchant, Hyderabad picnic, auto fare, Diwali borders).
18. **Slot pattern is identical in every concept** (6 mcq, 1 MS, 1 AR, 5 two-mark, 3 three-mark in the same order: claim-check, show-impossible, create; then two 5-mark and two case studies; "show impossible" is forced into every concept, including 7.6 and 7.7 where it is a thin fit). Content and stems do vary, and the MS keys (1&2, 1&3, 2&3, 2, 3, 1, all three) and false-statement positions are well spread, but the grid shape is mechanical.

## Checks that passed
- Keys: all 146 recomputed, including every case-study part (a)-(d) and later parts that depend on earlier ones (7.1 [18][19], 7.2 [19][20], 7.3 [19][20], 7.4 [19][20], 7.5 [19][20], 7.6 [19][20], 7.7 [19][20]).
- Assertion-reasons: 7.1 true/true not explanation; 7.2 explains; 7.3 not explanation; 7.4 explains; 7.5 A true R false; 7.6 explains; 7.7 A false R true. Not all "R explains A".
- History facts (bija = seed, Ch 18 of Brahmasphutasiddhanta 628 CE, Al-Khwarizmi c. 825 CE, al-jabr, ya / ru / dot / ka, Aryabhata 499 CE, Bhaskaracharya 1150 CE, formula x = (D-B)/(A-C)) match pages 019-021, apart from the points in 10 and 11.
- scope_out: no two-unknown systems, no quadratics, no tangram or number-lock items. Items using two quantities (4.9, 4.12, 4.13) are reduced to one unknown, as the book does.
- Reversal items carry rev=true where NOT/impossible appears in the keyed sense.
- Case studies are 83-119 words with four 1-mark parts, and parts climb.
- Bloom split: Remember/Understand 31.5%, Analyse/Evaluate/Create 37.7% (limits 60% and 15%).

## Per-concept verdicts
- C7M-7.1 (20): keys sound; stem reuse of the book (4+2y=16, the 200-stick question); parity move repeated.
- C7M-7.2 (21): keys sound; HIGH #1 on the savings case study; 5x-4=7 three times; Meera claim is a strawman.
- C7M-7.3 (21): keys sound; very heavy verbatim use of Figure it Out Q1; good Chitra/Beena case study.
- C7M-7.4 (21): keys sound and the strongest concept (caterer case study is a real trade-off); Q7/Q17 textbook numbers reused.
- C7M-7.5 (21): keys sound; (d) of the tuition case needs "new fee" wording; the magic trick is the book's own.
- C7M-7.6 (21): keys sound; HIGH #2 on Aman/Bela; heavy verbatim reuse of the book's mistake list.
- C7M-7.7 (21): keys sound and facts match the book; duplicate no-solution items; Bakhshali problem is a number swap.

## Count
146 questions read in full; HIGH 2; MEDIUM 9 (items 3-11) ; LOW 6 (items 12-18, counting pattern notes). Templating: structural (identical slot grid and order in every concept), not textual (stem frames and settings vary). Verdict: accurate bank; reaches the DPS standard on the case studies and 5-mark items, but fix the two HIGH items and reduce verbatim textbook reuse (7.6, 7.3, 7.7) before loading.
