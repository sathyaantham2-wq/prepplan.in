# Review v2: Class 9 Social Science, Part I ch 7 "Elections" (iest107)

File: content/authoring/dps/class9s/ch07.json (6 concepts, 121 items: 20/21/20/20/20/20). Chapter file not edited.

## Method
- All 22 textbook pages (iest107/pages/001-022) read; scope read from content/authoring/class9s/ch07.json.
- Every number recomputed in code or by hand before reading the author's answer: 2023+5, 2022+5, 2024+5; 30,000/80,000 = 37.5%; quota 72,000/6+1 = 12,001, 45,000/3+1 = 15,001, 80,000/4+1 = 20,001; Dhanapur shares (1,95,000 / 1,65,000 / 1,40,000 of 5,00,000 = 39/33/28%); 28% of 100 seats; round-two transfer (X 1,05,000+15,000 = 1,20,000 = 48%, Y 95,000+35,000 = 1,30,000 = 52%); 4 crore / 2,50,000 = Rs 160; STV count in 7.2[20] (A 31,000 and B 22,000 elected; C 16,000, D 11,000, then C 24,000); 600 x 2 = 1200 min and 301/11 votes; delimitation gaps 11, 10, 29; 180 lakh / 6 = 30, 50/15 = 3.3, 31/28 = 1.1, both sets sum to 180; 45,000 deletions and 14,93,000 on the roll; 90/15 = 6 days, Rs 44,000 vs Rs 36,000; 76 years; 108-9 = 99 vs 92+9 = 101, majority 101 and 96; 160 seats, 151 majority, 140/148/152; 96.8 x 0.6 = 58.08; 240 complaints 72/60/108, 8x6x2 = 96, 144 left; 900, 1,125, +225, Rs 267 and Rs 1,500. All arithmetic is correct. Nandgaon: March 2021 + 5 = March 2026, + 18 months = September 2027, correct.
- Programmatic: every mcq/match/AR/multi_statement key text is present as an option (key is stored as option 0 throughout, loader shuffles); no duplicate options; no "all of the above"/"option b" references (only the standard AR wording); rubric marks sum to item marks for every short and long answer; per-concept marks 45-46.
- Per-concept format checks pass: 3+ scenario MCQ, a three-statement multi_statement, an AR, 8+ one-mark, 5 two-mark, 3 three-mark, 2 five-mark, 2 case studies, a reversal each. Claim-check verdicts mixed (3 No, 1 Yes, 2 partly); true/false 3 True / 3 False; AR outcomes cover all four; multi_statement keys vary (1&3, 2&3, all three, 1&2, 2 only, 3 only). The loader --check was not run here.

## Counts
HIGH 0, MEDIUM 5, LOW 12.

## Verdict
PASS. No wrong key, no second defensible answer, no scope violation, no unfaithful fact. The medium items are data gaps, one logic slip and repetition; none changes a key.

## HIGH
None.

## MEDIUM
1. C9S-7.6 [18] (case study) never states what each plan costs. The officer "has Rs 60,000" and the answer divides the full 60,000 by 225 and by 40, which assumes each plan spends the whole budget. A student can reasonably say the costs are unknown. Fix: give each plan its cost (for example Rs 45,000 and Rs 30,000) and recompute.
2. C9S-7.5 [18] (case study) part (c) says "The 9 are later disqualified" and part (d) then asks "Should the Speaker disqualify them?". The decision in (d) has already been taken in (c). Fix: make (c) "if the 9 were disqualified", or move the decision before the arithmetic.
3. C9S-7.4 [19] (case study) is a strawman trade-off. The stem sets aside 3 days; one team needs 6 days, so it breaks the stated limit and the "cheaper" plan is not a real option. Fix: set aside 6 days, or give a deadline that both plans can meet at different cost and risk.
4. C9S-7.6 [19] (mcq) stem says the officer "turns Ishani away", which contradicts the chapter's story (she was verified with an alternative document). The key is recall of the story and the stem nearly states it. It also sits after the case studies (placed last). Fix: rewrite as a genuine application item or replace.
5. Repetition (rule: one idea at most about twice per concept; here the same data or story recurs). 7.2: Dhanapur FPTP-versus-seats in [2], [11], [18]; the 42/38/20 second-round data of 2,50,000 voters in [17] and [19]; "wins with under half" in [0], [9], [15], [16]. 7.3: the 5 lakh vs 25 lakh gap in [2], [9], [15]; the 15-50 lakh State in [17] and [18]; the Delimitation Commission gaps in [7] and [11]. 7.4: SIR in [3], [9], [17], [18]. 7.6: Ishani's polling day in [9], [14], [19]. Replace one item per cluster with a different idea (for example 7.3: corrupt-practice classification; 7.4: the party-recognition or ETPBS functions; 7.6: Voter Helpline/Saksham use).
(Also MEDIUM-adjacent: the key is the longest option in 22 of the 28 plain mcq (79%). The loader shuffles order but the length cue remains; the reviewed ch03 had 6 of 27. Shorten the keys or lengthen the distractors in the mcq that carry a long sentence, for example 7.1 [0]-[3], 7.2 [0]-[1], 7.3 [0]-[2], 7.4 [0], [3], 7.5 [0], [2], 7.6 [0], [2].)

## LOW
1. Easy in disguise, labelled Hard but a single recall or one-step lookup: 7.1 [3] (2022+5), [7] (2023+5), [9] (direct vs indirect); 7.2 [8] (not part of the STV steps), [12] (differentiate FPTP and PR); 7.3 [3] (a cousin is not government personnel), [7] (29 years); 7.4 [6] (76 years), [7] (a ruling party's preferred date is not a factor); 7.5 [1], [7] (1977-1967); 7.6 [2], [3], [6].
2. 7.6 [4] assertion-reason: A (EVM/VVPAT) and R (Article 82) are unrelated, so "R is not the explanation" is trivial. R also belongs to concept 7.3. Prefer a related R.
3. 7.1 [17] asks "one reason a country might use direct election for some offices and indirect for others". The chapter gives no reason; the key ("offices closest to citizens carry the direct vote") is the author's own. Accepting any reasoned answer is fine, but the key should be marked as one example only.
4. 7.1 [11] "In my town ... the Rajya Sabha member" does not fit; a town does not have its own Rajya Sabha member. Say "the State's Rajya Sabha member".
5. 7.1 [18] Rs 12 crore and 48,000 voters are decorative; only the dates matter in (a)-(b).
6. 7.2 [18] key says 28 per cent of voters "have no member"; their constituency MPs belong to other parties. Better: "no member of their choice".
7. 7.2 [17] does not state that all voters turn out again in round two and that X's and Y's voters stay the same. Add one clause.
8. 7.2 [19] opens "Two neighbouring regions elect an assembly" but only Region X is described. Delete the first sentence's "two".
9. 7.2 [20] STV count ignores transfer of A's and B's surplus. This matches the chapter's four steps, but a student who knows real STV could object. Add "ignore any surplus of elected candidates".
10. 7.2 has 21 items (extra short answer; 7.2 [12] "differentiate FPTP and PR" overlaps [9] and [11]). Within the loader's 20-24 range; drop [12] if exactly 20 is wanted.
11. Fill-blank keys need number variants accepted: 7.2 [7] "12001" (also "12,001"), 7.6 [6] "58.08".
12. 7.5 [15] relies on the position of boxes in Fig. 7.11 (text-only extraction); the opposition "ensures accountability" reading is reasonable but the figure's exact arrows could not be checked from the page text.

## Fidelity checks (page references)
Direct/indirect lists and the CR / term / single-party argument p.161; psephology p.162; FPTP, PR, STV, Vidhan Parishad, six States p.163-165; RPA 1950/1951, corrupt practices, delimitation, Article 82, four Commissions p.165-166; ECI, CEO, roll, SIR, ETPBS, schedule, symbols p.166-169; voting from home 2024, apps p.169-171; parties p.172; defection and Anti-Defection Law p.175; Janata Party, NDA/UPA p.177; challenges, MCC, EVM, VVPAT p.177-178; Ishani case p.180. Out-of-scope party-recognition percentages (p.176) are not tested anywhere. No fact beyond the book was found. The book states that the Rajya Sabha, President and Vice President use proportional representation; the items follow the book.
