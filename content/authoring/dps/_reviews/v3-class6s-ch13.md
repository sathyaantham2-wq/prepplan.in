# Review v3: class6s ch13 "The Value of Work" (SST6, fees113)

Re-review after one fix pass. 122 questions (20 + 21 + 21 + 20 + 20 + 20). I diffed the file against the pre-edit copy and read all 72 changed items (13.1: 3; 13.2: 8; 13.3: 9; 13.4: 11; 13.5: 10, with the old #19 deleted so later indices have shifted; 13.6: 16 changed items, all read). Index is the 0-based position in the concept's list in the NEW file. I recomputed every number in code. All changed-item step marks sum to the marks, and the correct option sits at o[0] in every option item.

## v2 status
- HIGH 13.6 #15(a) (second defensible answer): FIXED. The stem now asks the pupil to name one of the other two (social welfare or quality of life) and the key accepts either. Part (a) is now personal wellbeing, which has one answer.
- 13.1 #9, #18, #19 reworked. Arithmetic is correct (1,000; 13,500; 31,500).
- 13.2 repeated-idea cluster: #6, #13, #16, #20 are now different ideas with new characters. #14 no longer adds the clause beyond the book. #4 now has 1 false, 2 and 3 true. #19 now has a real distractor set.
- 13.3 #3 now has a false statement 3. #5 now has a real R. #12, #14, #18 and #2 are transfer cases. #19(d) is now a genuine trade-off (checked below).
- 13.4 template cluster partly cured. #6 now tests value addition, and #7's stem is fixed. #9 is now an item about what is not value addition. The Rajesh figures recur less. 13.4 #13 and #18 are new (see below).
- 13.5 #0, #8, #12, #18 reworked. #8 is now a scenario decision. #12's step 3 is limited to the selling-price point. #19 (floods) is deleted.
- 13.6 #2, #4, #13, #14, #17 reworked. #4 is now a claim the book decides. #14 now has a weakening detail.
- Not touched, and still LOW: the unchanged items keep their v2 LOW notes. These are 13.1 #7, #8; 13.2 #8; 13.3 #1 and #16; 13.5 #5; 13.6 #3's accepted spellings.

## HIGH
1. 13.6 #17 (3 marks): "The chapter discusses the Swachh Bharat Abhiyan and Van Mahotsav together under 'The strength of community participation'. ... say under which larger section of the chapter both are placed." Key: "Both are placed in the section 'The Importance of Non-Economic Activities'."
   - Problem: the key, and the stem's own premise, depend on a page structure the text does not prove. In `content/extracted/fees113/pages` p.192 reads "Van Mahotsav / Swachh Bharat Abhiyan / The strength of community participation". The first two lines may be photo captions, like the two captions before them ("Temple distributing prasād", "Langar at the Golden Temple").
   - I cannot tell from the text which line is a heading, or at what level. The PDF cannot be rendered here (no poppler), so I could not check it by eye.
   - The nesting under "The Importance of Non-Economic Activities" (p.191) is plausible, because no other major heading intervenes before "Before we move on". It is an inference from reading order, not something the pages state. `scope_in` does not state it either (it only says pp.192-193).
   - The step mark "Both placed under 'The Importance of Non-Economic Activities'" would mark a correct pupil wrong if the book's layout differs.
   - Smallest fix: delete the section clause from the stem and the key. Make it "State two features the two examples share" for 2 marks. The two features are already keyed correctly: people come together, and both are called collective community participation. Alternatively, make the third mark "Name the chapter's closing-summary term for what such activities add to (social welfare, personal wellbeing, quality of life)", which is on p.193.
   - If the author has verified the heading levels on the PDF page and writes that into the scope file, this drops to LOW.

## MEDIUM
2. File-wide, scope (not a defect in any one item): `scope_out` line 2 says "Specific rupee amounts for anyone's salary, wage or fee other than Rajesh's wood-and-chair figures ... Inventing numbers ... would test a fact that does not exist."
   - The reworked items keep invented amounts: 13.1 #9 and #18; 13.2 #20 (₹2,000); 13.3 #2, #12, #18, #19; 13.5 #8 and #19; 13.6 #5, #13, #14 and others.
   - This is consistent with the DPS standard (application needs numbers) and the v2 pack did the same. But the scope file literally forbids it.
   - Fix: amend the `scope_out` reason in `content/authoring/class6s/ch13.json` to "no pay figures are stated in the chapter; items supply their own figures in the stem". Do not change the items.
3. 13.4 #13 (5 marks, Hema's claim): Judgement asked of me. The key's logic is sound, but it is an inference, so it is MEDIUM not HIGH.
   - The book says "Economic activities also add value at each stage of the process of transforming something into another form. This is called value addition." On that definition an unchanged sack of onions is not value addition, and the key says "in the chapter's sense". The Rajesh subtraction alone would also give ₹300 for the onions, so a pupil can argue "same method, so value added". The key rejects that argument only through the word "transforming".
   - The step mark "Case 2: ₹300 difference" is trivial.
   - Fix: add a short phrase to the stem such as "as the chapter's definition requires", and fold the arithmetic marks together so that 3 of the 5 marks sit on the reasoning.
   - Verdict: acceptable and a good misconception item; it is not "wrong" if the stem points to the definition.
4. 13.4 #9, same inference (MCQ): "NOT an example of value addition: buys rice for ₹500 and sells it unchanged for ₹500". This one is safe, because the difference is ₹0 and no change of form occurs, so both readings agree. It is fine. (No fix needed. Listed to show it is the sound version of the idea in #13.)
5. 13.5 #12 (show_impossible, 3 marks): "cannot be applied to the meals served at a langar". The key says there is no selling price so there is nothing to subtract from.
   - A pupil can fairly subtract (₹0 selling price minus raw-material cost, giving a negative figure), so "cannot" is arguable on arithmetic alone.
   - The book does not say value addition is only for economic activities; it only places it in the economic section.
   - Fix: stem becomes "Explain why the chapter's value-addition method, which it develops only for activities done for money, does not fit the meals at a langar." Key step 2: "meals are free, so nothing is sold and no money value is added".
6. 13.5 #18 (3 marks, "Which two features of seva ... place it among non-economic activities?"). All three marks are book lines (free food, expects nothing in return, satisfaction and gratitude). This is recall in disguise at 3 marks. Fix: give a short unseen case (for example a cook at a temple kitchen who is later paid a salary) and ask which feature is lost.
7. 13.5 repetition: the langar-for-free idea is still the engine of #2, #8, #9, #12, #14, #18 and #19 (7 of 20). Within these, #8(c) and #19(b) are the same test (a charge for a free kitchen), and #8(a) and #19(a) are the same cost-per-meal division (₹14 and ₹15). Fix: replace #19 with a different angle (for example a paid cook inside a free kitchen, whose work is economic).
8. 13.3 #5 (assertion_reason) and 13.5 #3 (assertion_reason): both are keyed "Both true, R not the explanation". In 13.3 #5, A rests on "equal value", which neither A nor R states. R ("mangoes are a non-cash payment") does not explain why the worth is the same, so the key is correct. But a pupil cannot decide A from the stem; they must recall that the book says "equal value". It works as an item, but it is thin. Across the file the key "R not the explanation" appears 3 times in 6 (13.1 #1, 13.3 #5, 13.5 #3). Fix: change one of the three to "R explains A" (13.5 #3 could swap R for "Seva is selfless service, done expecting nothing in return").

## LOW
- 13.1 #18 (e), "Name one of the family's activities that would still be economic": the key accepts the father, mother or daughter. This fixes the v2 LOW. Fine.
- 13.2 #14: (a) and (b) are book lines (no payment; love, care, gratitude, respect). 2 marks on recall; relabel Understand or fold into a case.
- 13.2 #2 (fill_blank): answer 1. Verified: garden and free classes and errands are non-economic; the radio repair paid in vegetables is economic. Accepted forms should be "1" or "one".
- 13.3 #10 (true_false): the stem says "the same daily wage", so "False" follows from the stem. Add the word "paid" differently (for example "a labourer paid a ₹700 wage, ₹200 of it in mangoes, is worse off than one paid ₹700 in cash").
- 13.3 #19 (d): the stem now gives a genuine trade-off (B is higher in total, A is all cash and steady), and the key accepts either choice with figures. The marks match.
- 13.4 #8: "Differentiate" between raw-material cost and value added is a two-line definition with new numbers (₹360, ₹490). Easy in disguise; fold into #7 or drop.
- 13.4 #18: the book computes Rajesh's ₹400 from the wood only, while the key insists every input is subtracted. The logic is consistent with "the value of skill, time and effort", so one answer. State "everything she bought for the chair" in the stem to close it.
- 13.4 #3 (fill_blank "baker"): verified 300, 300, 500, so one answer. State in the key that "the baker" is accepted.
- 13.5 #8 (d): the stem frames the closure plainly ("the kitchen earns nothing"), so the verdict "keep it free" is close to dictated. Add a real cost, for example that the families' donations are falling.
- 13.5 #9 (match): situation 1 (a visitor eats a free meal) can be read as receiving seva. The options still leave one defensible set. Rephrase situation 1 as "A gurudwara kitchen serves every visitor free" (term: langar).
- 13.5 #11: a distractor ("contributes to society, expecting nothing") is also a true seva feature; the key relies on "most directly" and Arun's remark about thankfulness. Fine, but it is thin.
- 13.6 #3 (fill_blank "6") is one step after the stem says who is paid; easy in disguise.
- 13.6 #8 multi_statement: statements 2 and 3 are obvious contradictions; key "1 only" is guessable.
- 13.6 #13: (d) and (e) are loosely keyed (the book says only that economic activities "have value in terms of money" and non-economic ones generate "important value"). Accept the reading and keep it.
- 13.6 #14 (c) accepts a judgement either way with one detail each side, which is correct.
- Slot template: claim_check sits at index 4 in four of six concepts (13.1, 13.4, 13.5, 13.6). Fix: move two of them.

## Checked and clean (recomputed)
13.1 #9: 40 x 25 = ₹1,000; the rice-paid stitching is economic. 13.1 #18: ₹6,000 + ₹7,500 = ₹13,500, plus ₹18,000 = ₹31,500. 13.2 #6: partly right. 13.2 #13, #19: one answer each. 13.3 #2: 600 / 30 = 20 kg. 13.3 #3: key "1 and 2 only". 13.3 #12: 19,500, 1,300, 15,000. 13.3 #18: 4,800. 13.3 #19: A 17,500; B cash 13,000, total 18,200; C 4,800; 24 days; mangoes 5,200. 13.3 #20: one wrong line. 13.4 #0: 450. 13.4 #6: key "2 only". 13.4 #7: 600, 900, 2,000, 2,600. 13.4 #8: 360 and 490. 13.4 #12 and #19: one answer each. 13.5 #0: key "3 only". 13.5 #8: 4,200 / 300 = 14. 13.5 #14: one answer. 13.5 #19: 12,000 / 800 = 15. 13.6 #0, #1, #2, #4, #5 (150, 80%, 180, 160), #8, #9, #11, #12, #13 (450), #14 (6 kg), #15, #16 and #19: one defensible answer each.

## Counts and template
- Read: 122 (all); changed items read in full: 72.
- Option items: correct at o[0] in all (except match, whose key is the first pairing). No positional references ("option (b)") found. Correct option strictly longest: 3 of 44, which is fine.
- claim_check verdicts: No, Partly, Yes, No, Partly, Yes (balanced). assertion_reason keys: not-explanation 3, A-true-R-false 1, A-false-R-true 1, R-explains 1 (a mild lean; see MEDIUM 8). multi_statement keys: "1 and 3 only", "2 and 3 only", "1 and 2 only", "2 only", "3 only", "1 only" (well spread).
- All items carry difficulty Hard or Hardest, with no Easy. Slot order is not identical across concepts, apart from the claim_check position noted above.
- Repetition remains the template risk (langar 7 of 20 in 13.5; salary/wage/fee in 13.3; subtract-cost frame in 13.4), but it is much reduced from v2.

Counts: HIGH 1; MEDIUM 7 (items 2, 3, 5, 6, 7, 8, plus 4 as an informational no-fix entry); LOW 14.

Verdict: NOT load-ready as it stands. Fix HIGH 13.6 #17 (drop or verify the section clause), which is a 1-minute edit, then it is load-ready. 13.5 #12 and the scope_out wording (MEDIUM 5 and 2) are recommended with it.
