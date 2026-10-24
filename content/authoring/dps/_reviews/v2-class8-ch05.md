# Review v2: class8 ch05 (Number Play, hegp105), independent first review

Read: all 128 questions (21+22+21+23+20+21) in `content/authoring/dps/class8/ch05.json`. Every key, case-study part and statement truth recomputed in python; every cryptarithm brute-forced (scratch: `scratchpad/review-class8-ch05/crypt.py`). Question index = 0-based position in the concept's list.

## HIGH (wrong key, second answer, fact or arithmetic error)
None. All 128 keys and every case-study part recomputed correct. All 23 cryptarithms brute-forced; solution counts match the author's claims (see table at the end). Textbook fact checked: Aryabhata II (c. 950 CE) is on p.131 (page 020.txt).

## MEDIUM
1. C8M-5.6 #13 "Ravi is solving KL x 3 = MML ... he works out L from the units digits. Which digit must L be?" Key 5, but the units digit alone gives L = 0 or 5, and option "0" is a live option under the stem's own method. 0 fails only after K0 x 3 = MM0 is tried (3K = 11M, no digits). The stem implies units reasoning is enough. Fix: ask "Which digit must L be, once the whole puzzle is solved?" or ask for the digits the units column allows, or drop option 0 and change the stem to "Which digit is L?".
2. C8M-5.2 #18, #20 and C8M-5.3 #6 are the book's closing Figure it Out items 7, 8, 9 (p.134) almost verbatim, and the book prints the answers (2,3,4 then 14,15,16 "every 12"; "five multiples of 36 between 45,000 and 47,000" with 45036, 45072...; "middle of five consecutive even numbers is 5p" giving 5p-4...5p+4). A student who read the book recalls these; they are recall in disguise. Fix: change the numbers and the setting (for example 3, 4, 5 multiples of 3, 4, 5 respectively; multiples of 24 between two new bounds; middle number 7p of seven consecutive odd numbers), or add a second reasoning step the book does not give.
3. C8M-5.2 #19 "three consecutive integers, which number must divide the product" (key 6). The book never teaches that a product of consecutive numbers is divisible by 6 (one multiple of 3 among any three, and an even one), so it goes beyond this book's scope. Scope has only the sum, factor and LCM rules and the p.134 three-consecutive item. Fix: replace with a sum item such as "the sum of three consecutive numbers is always divisible by ..." or remove.
4. Forced "decision" last parts, not trade-offs. The decision is fixed by a criterion in the stem and by the previous part's count, so it is a computed fact, not a judgement:
   - C8M-5.6 #5(d) (print the puzzle with one solution), #17(d) (use 8D, wants exactly one solution), #15(b) is the same idea.
   - C8M-5.2 #4(d) (crate 12 or 24: 24 fails Mon/Wed shown in the table), #15(d) (520 or 540, one divides), C8M-5.4 #19(d) (box 8 packs 3 batches vs 1), C8M-5.3 #14(d) (25 prizes, d = 8 gives 25), C8M-5.1 #9(d) (140 is a multiple of 4, so block of 5).
   Genuinely good judgements are C8M-5.5 #4(d) (is the digital-root check enough: 8,460 passes) and C8M-5.5 #12(c) (11-rule versus 9-rule for swaps). Fix: give the last part a real two-sided trade-off, for example a cost or a risk against a benefit (the 9-rule is quicker but misses swaps; 11 catches every adjacent swap but is slower), or ask the student to justify a choice whose alternative is also partly valid.
5. Repeated ideas inside one concept (the standard allows one idea about twice):
   - C8M-5.6: "two-digit plus two-digit sum begins with 1" is tested in #0(a), #9 and #20 (three times); "B x B must end in B" in #7, #12, #14, #19 (four times); "choose or construct a puzzle with exactly one solution" in #5(d), #15(b), #17(d), #19. #0 and #18 are the same frame with swapped numbers (AB+AB=BCC, AB+AB+AB+AB=CBB; "(a) explain why B must be ..., (b) find A and C"; text similarity 0.91).
   - C8M-5.2: "4p + (4q+2) never a multiple of 4" in #0, #2 and #21(a)(b); "4 and 6 do not give 24 (only 12)" in #4(a), #11, #16 and C8M-5.5 #1, #16.
   - C8M-5.4: "nearest or next multiple of 9 from the digit-sum remainder" in #0, #14, #17; rearranging digits keeps the digit sum in #4, #8, #12.
   - C8M-5.1: "never zero by parity" in #3, #15(b), #19(b); "four consecutive numbers sum" in #0, #9, #13, #14.
   Fix: replace one of each cluster with a different skill (for example C8M-5.6: a three-letter addition with a carry, and the book's own BYE x 6 = RAY style; C8M-5.4: a remainder-by-9 of a product or sum; C8M-5.1: a parity item on an expression with squares).
6. Easy in disguise (answer is a one-line book fact or one step, whatever the Bloom label):
   - C8M-5.4 #22 "digit sum 27, what follows?" (key divisible by 9 and 3; labelled Understand) and #21 (why only the last two digits decide 4; the book states it, then 7,318,516 ends in 16) and #0 (nearest multiple of 9 to 7,000, one digit sum) and #3 (4 hundreds, 6 tens, 5 ones, mod 9 is just 15) and #2 (digits 3 and 6 only).
   - C8M-5.4 #16, five marks, "Explain the digit-sum rule using 6,254": this is the book's own derivation (pp.124-125) re-run on one number, with three of the five parts (c), (d), (e) one-line restatements. Not Hardest.
   - C8M-5.2 #14 (circles for multiples of 4, 8 and 32 nested: book fact), #8(a) (42 x 13 divisible by 7: the multiples rule stated), #17 (every multiple of 11 stays one when doubled; the answer is the rule itself).
   - C8M-5.3 #12 (write 13k+12, then 13k+13 is 13(k+1), two lines), #9 and #17 (add remainders, one step).
   - C8M-5.5 #15 (1001 and 11, one line), #5 (root 3 or 6 means divisible by 3).
   - C8M-5.6 #20 (E must be 1: the book's first lemma), #10 (XYZ x 7 in three digits).
   Fix: give each a second step or an invented twist, for example a number that is two-thirds of the way (digit sum 27 but also leaves remainder questions on 4 and 12), or merge (a)(b) into one deduction about a different divisor.
7. C8M-5.2 #4 case study (a) "Monday's 1,212 is divisible by 4 and 6; show that 24 crates fail" can be answered by direct division (the table already shows 'No' under 8); and (c) is read off the table once (b) is answered. Fix: drop the 8 column from the table and give only the 3 and 4 and 6 columns plus the totals, so that deciding on 24 needs the LCM reasoning.
8. Template at concept level (counts, not impression): every concept has the same composition. Per concept: 20-23 items, 8-9 short answers, 4-5 long answers, 4-6 MCQs, and exactly one each of multi_statement, assertion_reason and fill_blank (match in 5 of 6). Marks mix 8-9 / 5-6 / 3-4 / 2 / 2 in every concept. Slot orders differ only by shuffle (for example each opens with mcq1 or sho2). All 128 are labelled Hard or Hardest (no Medium). Question frames repeat: "True or False" opens 7 stems, "Assertion (A)" 6, "Show that" 4, "A school/In a" 8. This is a recipe, not variation. Fix: vary the number of long answers (3 to 6) and one-markers (7 to 11) concept by concept, and open some items with a different frame.

## LOW
1. C8M-5.6 #3 "PQ x 6 = RS, which PQ is correct?" The puzzle has two solutions (13 x 6 = 78 and 15 x 6 = 90); only one is among the options so the key stands, but the stem says "a correct solution" and 15 is a valid answer a student could write. Fix: switch to a one-solution puzzle (for example AB x 7 = CA, only 13), or word it "which of these four values is a solution".
2. C8M-5.1 #18 "three expressions in m and n ... each with at least one odd coefficient". The samples (3m+5m+2n, 7m-m+4n) are artificial: they collapse to even coefficients at once, so the condition is empty. Fix: say "unsimplified, write each as a sum or difference of at least three terms with an odd coefficient in at least one term", or "use terms such as 3m and 5m".
3. C8M-5.5 #3 Statement 1: the stem's own example "such as 545" is not divisible by 11 (545 = 11 x 49 + 6), so statement 1 is refuted inside the stem. Fix: drop the example, or use one that does not decide the statement.
4. C8M-5.5 #13: stem 7x48 is a fill_blank that needs x = 3 from one alternating sum (8 - 4 + x - 7 = x - 3). It is an application but the lightest in the concept. Optional: make it 3 digits unknown with a second condition.
5. C8M-5.1 #9 (case study) part (a) is answerable by algebra from the stem alone (no chapter need beyond 4s+6); part (b) restates the sum in (a)'s working. Climb is weak: (a)(b) are one step each. Fix: swap (a) and (c), or merge (a)(b).
6. Divisors beyond the list in scope_out line 1 ("any divisor beyond 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 22 and 24"): C8M-5.5 #2 (44), C8M-5.2 #5 (36), C8M-5.4 #1 and #12 and C8M-5.5 #16(e) (18 and 36). They are reached by combining factors already taught, so the parenthesis in that line probably allows them, but 44 and 36 are not named in the book. Keep, or confirm with the owner.
7. C8M-5.4 contains place-value items for 4, 8 and 10 (#19, #21) and C8M-5.5 contains digital-root items in 8 of 20 slots (#0, #4, #5, #9, #10, #11, #17, #18), although the concepts are titled "shortcuts for 9 and 3" and "11 and combined shortcuts". Cosmetic, but the concept labels do not describe what is tested. Fix: rename the concepts or move the items.
8. C8M-5.2 #7 "largest number a multiple of 6 plus a multiple of 9 must be a multiple of" (key 3). Correct, but it needs the HCF (scope_out: HCF not taught as a method) and equals "common factor 3 of 6 and 9"; fine as a mental step, but wording "largest" invites 3 only if the student knows that 6+9=15 is allowed. Keep; just ensure #8 and the key accept "3" only.
9. All 45 option items put the key at o[0]; this is correct only because the loader shuffles. Informational. No option is named by position anywhere in the file (grep clean). The correct option is the longest in 3 of 45 items (two are assertion-reason boilerplate, one is C8M-5.2 #10 "Boxes of 12" by one character), so not systematic.
10. C8M-5.2 #21 is tagged `figure` but there is no figure; the dot picture is described in prose well enough to answer. Fine; consider dropping the tag.

## Template and mix counts (read, not impression)
- claim_check verdicts (9): No 4, Yes 2 (C8M-5.3 #4, C8M-5.6 #9), partly right 3 (C8M-5.2 #12, C8M-5.3 #16, C8M-5.6 #19). Healthy mix.
- multi_statement keys (6): "1 and 3 only", "1, 2 and 3", "2 and 3 only", "1 and 2 only", "2 only", "1 only". Spread across all six values. One statement set is all-true (C8M-5.2 #3). Good.
- assertion_reason (6): both true and explains x2, A true R false, A false R true, both true not explains x2. Good spread. C8M-5.4 #13 and C8M-5.6 #11 have an R that is a trivial or generic fact (zeros in 4,005; leading digit never 0), so "R does not explain A" is easy to guess.
- true_false (7): 4 True, 3 False. Fine; all give a reason.
- fill_blank (6): all numeric, single-answer, no natural equivalents found (46, 3, 4, 1, 3, 5); C8M-5.3 #3 (9k - 4) has a natural equivalent 9k - 13 only if the student leaves the stated k = 1, 2, 3 range, so acceptable.
- match (5): 4-4 pairings correct.
- correct option longest: 3/45 (6.7%), not systematic.
- wrong option equal in value to key: none found.
- Identical slot order across concepts: not identical, but the composition is (see Medium 8).
- Case studies (12): all numbers and parts recompute; step marks match parts. Only 2 of 12 end in a real judgement.

## Cryptarithm brute-force table (solutions found by exhaustive search, distinct digits, no leading zero)
AB+AB=BCC: 1 (61+61=122) matches. RS x 9=TTT: 1 (74x9=666; 37x9=333 fails as R=T) matches statements. WX x 6=YYY: 1 (37x6=222) matches. PQ x 6=RS: 2 (13x6=78, 15x6=90) see Low 1. GH x H=8K: 0 matches. PQR x 3=SQR: 2 (150, 250) matches. PQ+PQ+PQ=RQQ: 1 (85) matches. DE+29=7D: 1 (45+29=74) matches. AB x 9=CAB: 2 (50x9=450, 75x9=675) matches the False verdict. AA x AA=BCB: 1 (22x22=484) matches. AB+BA=CAC: 1 (29+92=121) matches. MN x N=MPM: 1 (19x9=171) matches. AB x B=CDA: 2 (64x4=256, 93x3=279) matches. KL x 3=MML: 1 (75x3=225). AB x AB=CAB: 1 (25x25=625). AB x 3=CA: 3 (17x3=51, 24x3=72, 31x3=93) so "another solution" true. AB x 9=BAC: 1 (87x9=783). AB x 7=CA: 1 (13x7=91). AB x 7=CD: 2 (12, 14). AB x 7=8D: 1. AB x4 sum=CBB: 1 (50x4=200). AB x B=CAB: 2 (25x5=125, 75x5=375) matches "partly right". AB x 3=7A: 1. Every "two-solution" item says so in its key and lists all; none of the stems pre-announces the count, which is right.

## Per-concept verdict
- C8M-5.1: keys all correct; fix #18 wording and the #9 climb; repeated "parity never 0" idea. PASS AFTER FIXES.
- C8M-5.2: keys all correct; #18/#20 are book copies, #19 off-scope, forced decisions, heavy repeats of 4p+2 and 4/6 to 24. PASS AFTER FIXES.
- C8M-5.3: keys all correct; #6 is a book copy, #12 easy; good AR and claim-check mix. PASS AFTER FIXES (light).
- C8M-5.4: keys all correct; several easy items (#0, #3, #21, #22) and #16 is the book's derivation. PASS AFTER FIXES.
- C8M-5.5: keys all correct; #3 stem leaks the answer, the digital-root block crowds the concept; #4 and #12 are good. PASS AFTER FIXES (light).
- C8M-5.6: keys all correct; #13 second-defensible-option risk, uniqueness theme repeated four times, #0/#18 twins. PASS AFTER FIXES.

## Counts read
Read 128 of 128. HIGH 0. MEDIUM 8. LOW 10. Templated at the composition level (moderate), not at the sentence level except C8M-5.6.
Overall verdict: PASS AFTER FIXES (no key errors; fix the Medium items, then a second review).
