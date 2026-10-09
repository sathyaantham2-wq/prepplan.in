# Review v4: Class 7 Social Science Part I ch 10 "The Constitution of India: An Introduction" (gees110)

File: content/authoring/dps/class7s/p1ch10.json (after the v3 fixes). All 120 questions (6 x 20) read against pages 001-020 of content/extracted/gees110. Every key decided before reading the key. Numbers recomputed in python:

- 9 Dec 1946 to 26 Nov 1949 = 1,083 days.
- 26 Nov 1949 to 26 Jan 1950 = 61 days.
- 9 Dec 1946 to 9 Dec 1949 = 1,096 days, so the Assembly fell 13 days short of three years.
- 9 Dec 1946 to 26 Jan 1950 = 1,144 days.
- 389 - 299 = 90, and 90/389 = 23.1 per cent.
- 15/389 = 3.86 per cent and 15/299 = 5.02 per cent.
- 1950 - 1789 = 161; 1992 - 1976 = 16; 1992 - 1950 = 42; 2004 - 1976 = 28.
- 22 + 8 = 30 and 25 + 12 = 37, so the growth is 7.
- 6/60 = 10 per cent.
- Nine value words minus Socialist and Secular = 7.
- Ages 6 to 14 = 8 years.
- The infographic has 6 duties, 4 rights and 6 DPSP.

Step marks sum to `m` in every item. The `mcq` correct option is always at index 0 (the loader shuffles).

Compared with v3: the lookup-only items are mostly reworked. The two keys you flagged are right:

- 10.4 #13 key "2 only" is correct. Statement 1 is false (Fundamental Rights are enforceable). Statement 2 is true (Articles 38 and 47 are both in the DPSP column of Fig 10.14). Statement 3 is false (the duty is addressed to the parent or guardian).
- 10.5 #14 "22 to 25 parts" matches the book. p.212 reads: "25 parts and 12 schedules ... When it came into effect, it had 22 Parts and 8 schedules". The chapter names only Part IV-A (p.223) as added. See the MEDIUM note on the wording of (b).

All MS and AR keys recomputed and correct (table at the end). One second-defensible-answer defect remains, in 10.3 #9. Case studies are still mostly decided by the stem.

## HIGH

1. C7S-10.3 #9 (mcq, "Which job draws on the freedom struggle's experience ... and not on a foreign model or India's heritage"). Two options are defensible.
   - The key is "Deciding how the school's rules may be changed" (the amendment question, p.216).
   - But option "Making the discipline panel independent of the principal" is also an answer the book supports. p.216 lists, among the 'how' questions the freedom struggle answered: "How do we ensure that the powers of the executive, legislature and judiciary are kept separate?"
   - The key's explanation files the independent panel under the foreign model ("independent judiciary shaped with the American Constitution", p.217). The book gives that credit to the USA for the concept of an independent judiciary, and gives separation of powers to the freedom struggle. A student who reasons "separate powers, so freedom struggle" is right.
   - The parenthetical "(and not on a foreign model ...)" does not remove this, because the panel option is a foreign-model idea and a separation-of-powers idea at once.
   - Smallest fix: replace the "independent of the principal" distractor with one that is clearly not a freedom-struggle answer, for example "Copying another school's whole rulebook after reading it for useful ideas" (a foreign model) or "Asking every student to look after the school garden" (a heritage duty). Keep the rules-can-be-changed key.

## MEDIUM

2. POSITIONAL REFERENCES (rule 7), C7S-10.5 #8 and #10. Options are shuffled, so these explanations will point at the wrong option.
   - #8 answer: "The second option's case protects the book ... the third has neither; the fourth supports only the art description."
   - #10 answer: "The second option turns 'many times' into 'every case'; the third and fourth drop the debate in Parliament."
   - Fix: name the content, for example "The option that says the public must be asked in every single case turns 'many times' into 'every case'".

3. C7S-10.3 #9 is not the only item where the options and the key sit on a thin boundary. See #7(b) below (10.5). Also see item 12 (cross-concept repetition).

4. STEM-ONLY ITEMS (the chapter is not needed). These fail check 2/4.
   - 10.3 #3 fill_blank: both 1789 and 1950 are given in the stem, so the answer 161 is pure subtraction.
   - 10.5 #1 fill_blank: both 1992 and 1976 are in the stem; the answer 16 is pure subtraction.
   - 10.5 #7(a): the stem already says "scenes ... from Mohenjo-daro to the freedom movement" and (a) asks for exactly that range back.
   - 10.2 #12(a) and (b): "389 - 15" and "389 - 299" use numbers given in the stem. Only "the chapter does not say how many women remained" needs the book.
   - Fix: take the figure from the book. For example, 10.3 #3 could say "the year the ideals were formulated in France's declaration" and ask for the gap to 1950. 10.5 #1 could ask how many years after the Constitution came into effect Panchayati Raj was integrated (the student supplies both 1950 and 1992). Replace 10.5 #7(a) with a question on what the illustrations show.

5. C7S-10.5 #7(b): "Which of the chapter's three influences ... does this choice of scenes match most closely? Key: civilisational heritage."
   - The book never links the illustrations to an influence. The scenes run "from Mohenjo-daro to the freedom movement", so the freedom struggle is equally defensible. The key hedges "mainly".
   - This is inference beyond the book, with two defensible answers.
   - Fix: ask what the calligrapher and the illustrator did (Raizada, Nandalal Bose), or accept either influence with a reason.

6. C7S-10.5 #14(b): "what can the visitor therefore not claim from the chapter?" Key: that all three added parts are amendments "like Part IV-A".
   - The numbers (22 to 25) are right. But the chapter's own prompt on p.212 ("can you guess why they have increased since 1950?") together with the "living document / amendments" section makes the visitor's claim a fair inference from the chapter. The key penalises a reasonable reading.
   - (a) "3 parts added" is a net figure. State it as "net increase".
   - Fix: change (b) to "Which one added part does the chapter name, and in which year?" (Part IV-A, 1976). That is checkable and fair.

7. STRAWMAN / RIGGED CASE STUDIES. Of the 12 case studies, the stem itself hands over the decisive criterion in about 10, so part (c) is not a real weighing. The v3 fix added the "1 of 2 only if" clause to every one, but the stems still carry the answer.
   - 10.1 #17: "no other document lets anyone question the Games Committee" and "the annual vision note already prints the academy goal" decide it. Member Y wins by construction.
   - 10.1 #18: Plan P dominates Plan Q. Q has no stated advantage, so the "can adopt only one" choice is a strawman. Give Q a real cost-saving, or give P a real cost.
   - 10.2 #12: the teacher "wants the audience to learn how the makers were chosen", and Scene 1's text in the stem already says how.
   - 10.2 #17: Plan A fails the principal's stated first aim ("copy how the real Assembly's members were chosen"). Also part (b), the 10 per cent against 23 per cent comparison, does not feed (c).
   - 10.3 #20: "must start from his grandfather's words" makes Fundamental Duties the answer, and (b) already answers (c).
   - 10.4 #2: Letter 3 is weakened by "has since found another room", and Letter 4 by "school year starts next week".
   - 10.4 #16: the class's aim ("what she is expected to do and what she can demand from a judge") excludes Directive Principles in so many words. Also the Duty cards are not classed in (a) (they are neither "enforceable" nor "goals"); say so or add a third count.
   - 10.5 #4: the stem's rule ("different routes") fixes 2004 plus either amendment. The key accepts both, so there is no real decision.
   - 10.5 #20: Plan 2 for a fee rise is obvious. The second half is open either way, so nothing is actually decided.
   - 10.6 #5: the critic's objection is weak by design.
   - 10.6 #9: "follow the Preamble's values" makes Sunrise the answer. The Ashoka continuity benefit is a mention, not a counter-weight.
   - Genuinely good: 10.3 #2 (the "two of four is not most" count has to be made) and 10.4 #2 in spirit. Suggested fix for the rest: remove the sentence that names the deciding fact, and put a real cost on the option the chapter favours.

8. TEMPLATED CASE-STUDY SHAPE. 12 of 12 case studies:
   - run (a) lookup, (b) lookup, (c) "decide and justify";
   - carry an "only one can be chosen/dropped/shown" constraint;
   - end with the formula "... earns 1 of 2 marks only if ...".
   Vary the constraint (some "rank", some "which of three is least needed"), and vary the final clause.

9. EASY-IN-DISGUISE. About 24 of 120 items still have an answer the book states in one line or reach it by one lookup, whatever the Bloom label. The Hard label is carried by wording, not by thinking. Worst offenders:
   - 10.1: #5 (one way the Constitution goes beyond a rulebook, any of three listed things), #8 (oath wording lookup), #14 part (b).
   - 10.2: #2 (list match), #3 (who said which line), #5 (two listed questions), #15 (AR where R restates A).
   - 10.3: #5 (swapped meanings), #8 (A/R both straight from p.217), #16 (two listed cultural principles).
   - 10.4: #1 (Article 48-A), #12 (TF restating the "Don't Miss Out" box), #15 (textbooks print the duties), #17 (AR with an absurd R), #19 (three-tier vs two-tier, a one-line fact), #14.
   - 10.5: #2 (a), #11 (AR with a silly A), #19 (AR with an obviously false R).
   - 10.6: #2 (Article 14 is Equality), #7 (AR where R is the book line), #8 (Sovereign), #13 (AR with a crisp misconception).
   Fix: for the AR items, make R a real fact that is true but not the explanation, and make A a non-obvious claim. For the 1-mark facts, wrap them in a short case in which two chapter ideas compete.

10. 10.6 #10 (long_answer, 5 marks): item (i) "admission open to children of every caste, religion and gender" is keyed Justice, but "equal opportunity for all" (Equality, p.225) is also defensible.
    - Fix: either keep Justice and say "which is reflected most directly by the Preamble's wording on discrimination", or accept Equality with a reason in the mark scheme.

11. 10.4 #20(b): "the failing is most likely in how the system is carried out" (the executive), for a Gram Panchayat voters' list. The book never says who runs elections. The scenario drifts beyond the book (state election bodies). Fix: ask only (a), or make the executive part conditional ("if the Constitution's design is sound, which organ's work is in question?").

12. CROSS-CONCEPT REPETITION OF IDEAS (check 6).
    - 1,083 / 1,096 / 13 days appears in 10.2 #8, #9, #16 and #18 (four times in one concept).
    - "Provincial legislative assemblies elected the members" appears in 10.2 #7, #12(a), #17 and #20.
    - Year arithmetic (1976, 1992, 2004) fills 10.5 #1, #4, #5 and #18.
    - "Apply the amendment process to a club" appears in 10.5 #16 and #20.
    - "District court overrides the collector" appears in 10.1 #10 and 10.4 #5.
    - "Directive principle vs enforceable right" is tested in 10.4 #1, #4, #8, #12, #14 and #18. That is heavy but defensible; the chapter's main contrast is this one.
    - Fix: change at least two of the four items in 10.2 (#9 or #18 to ask something other than the day count) and one in 10.5.

## LOW

13. 10.1 #13: options "rights and duties of the players" and "long-term goals of the association" use leftover vocabulary from a sports-club draft; the stem is about a housing society. Reword to "residents" and "society".
14. 10.4 #5 answer: "the district collector's office is part of the executive, which ... is headed by the prime minister". The book says the executive is headed by the PM at the national level. Add "at the national level" or drop the clause.
15. 10.1 #2 (i) is a pure recall of two moments in the story; the real thinking is only (ii).
16. 10.6 #3 (TF "True"): the stem already says the head of state "is elected by the people", so the verdict is given away. Make the head's election the open point.
17. 10.4 #6, 10.5 #6, 10.6 #18: the claim-check stems ("X says ... Test her claim") are close to one template. The verdict mix is fine (1 right, 3 partly right, 2 no).
18. AR verdict mix: 12 AR items. "Both true, R explains A" x4; "Both true, R does not explain" x2; "A true, R false" x3; "A false, R true" x3. The standard asks for "true but does not explain" about as often as "explains"; add two more of the "does not explain" kind by editing easy AR items (see item 9).
19. 10.5 #5 and 10.4 #11 are generic open items: any plausible answer scores. The mark scheme is fine, but the item is closer to recall than the Hard label suggests.
20. Structural template: every concept has 45 marks, exactly 16 Hard and 4 Hardest, one fill_blank, one MS, one or two match, 8 short and 4 long. Slot order differs per concept (it is not identical), so this is a distribution template, not a position template. Vary one or two concepts (for example drop the fill_blank from one, add a figure item).

## Per-concept verdict

| Code | Items read | HIGH | MEDIUM | LOW | Verdict |
|---|---|---|---|---|---|
| C7S-10.1 | 20 | 0 | 2 (#17/#18 rigged, easy items) | 3 | pass after fixes |
| C7S-10.2 | 20 | 0 | 3 (stem-only #12, rigged #12/#17, repetition) | 1 | pass after fixes |
| C7S-10.3 | 20 | 1 (#9) | 3 (#3 stem-only, #20 rigged, easy items) | 0 | pass after fixes (fix #9 first) |
| C7S-10.4 | 20 | 0 | 3 (#2/#16 rigged, easy items, #20(b)) | 3 | pass after fixes |
| C7S-10.5 | 20 | 0 | 5 (#8/#10 positional, #1 stem-only, #7(b), #14(b), #4/#20 rigged) | 1 | pass after fixes |
| C7S-10.6 | 20 | 0 | 3 (#5/#9 rigged, #10 second reading, easy AR) | 1 | pass after fixes |

## Counts read

- Items read: 120 (6 x 20).
- Findings: 1 HIGH, 9 MEDIUM (items 2, 4, 5, 6, 7, 8, 9, 10, 11; item 12 is repetition and item 3 is a cross-reference) and 8 LOW. By issue, HIGH 1, MEDIUM 10, LOW 8.
- Case studies: 12 read. 10 have a stem-decided final part, and 12 of 12 share the same ending formula.
- MCQ: 21 items, correct option longest or tied-longest in 3 of 21 (14 per cent). Not a length tell.
- Multi_statement: 6 items, three statements each, keys 1 only / 2 and 3 only / 1 and 3 only / 2 only / 1 and 2 only / 3 only. No "1, 2 and 3" key, well spread. Each false statement hinges on a real chapter fact (swapped numbers, wrong source country, rights vs duties, public vs Parliament).
- Assertion_reason: 12 items, keys 4 / 2 / 3 / 3 as in item 18. All keys recomputed and correct.
- Claim_check: 6 (1 right, 3 partly right, 2 no). True_false: 6 (4 False, 2 True).
- Positional option references: 2 items (10.5 #8, #10).
- Option named by letter: none.
- No scope_out line was violated. 10.4 #20 and 10.4 #5 use outside-the-book civic detail (voters' list, High Court, collector) only as scenario furniture.

Templated or not: structurally templated at the concept level (identical mark totals and difficulty split, same case-study shape), but not templated by slot order. Overall verdict: pass after fixes. Fix 10.3 #9 first (second answer), then the two positional explanations in 10.5, then rework the stems of the case studies so the decision is not already made.
