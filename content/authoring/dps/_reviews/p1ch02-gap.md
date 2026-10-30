# Review: class7-topup/p1ch02-gap.json (C7 Maths P1 ch2, gegp102)

Read: 35 questions, every one recomputed in python or by hand against the textbook pages (printed page = file page + 23).
Loader `--check`: valid (7 concepts, 35 questions). Marking steps sum to the marks in all 28 items that have them.
Slot mix present: 9 one-mark (6 mcq, 2 multi_statement, 1 match), 19 sa3, 7 la5. No ar1, sa2, la4 or cs4 items in this file
(I could not see the requested counts; the author must confirm 9 / 19 / 7 is what was asked).
Levels: Apply 13, Analyse 17, Evaluate 5, no Understand/Remember. Hard 28, Hardest 7.

Keys: no wrong key and no second defensible answer found. Key spot checks that matter: Q1 875 = 875; Q5 totals 2785/2786/2785;
Q6 140/138/140; Q11 165/170/165, Ravi off by 120; Q16 squares 10, -12 and 55,64,82,60,30; Q18 89 and 80; Q21 30/33/24/21 and 32 vs 34;
Q27 2580, 2440, 2485, 80; Q31 90/130/5/127/300; Q35 171600/172800/1200/171300. Scope: nothing in the OUT list is used (no BODMAS,
no variables, no powers, no fractions, no nested brackets, no new rules for negatives). Page references all match where the idea is taught.

## Problems

| Item (concept, topic) | Sev | What is wrong | Exact fix |
|---|---|---|---|
| C7M-2.3 sa3 "pairs of actions" part (c) "Close the classroom door and then lock it" | MEDIUM | Not clearly one-answer: a door bolt can be locked while the door is open, and a spring latch locks a door as it closes, so "cannot be locked before it is closed" is arguable. The book's own contrast (socks/shoes, hat/shoes, p.31-32) is the safe model. | Replace (c) with an unambiguous order-matters pair, e.g. "Break an egg into the pan and then fry it", answer: order matters because a whole egg cannot be fried first. Keep step 3 wording. |
| C7M-2.3 la5 board game (counter on 40, cards +15 -22 +9 -30 +18) | MEDIUM | Same idea as the existing pack's drone question (Madhu: same final height, heights on the way differ, which order is safe) and the lift question: final value fixed, path depends on order, which order avoids the limit. Repeated idea. | Change the idea: e.g. ask for the order of cards that makes the counter first reach a target square, or compare two named orders' lowest squares to decide a bet, without the "claim: every order equally safe" frame; or drop the 'safest order' (e). |
| C7M-2.2 sa3 flour packets (5, 96 / 4, -2 x 3) | MEDIUM | Same setting and structure as existing C7M-2.2 mcq "Sunita already has 3 bags of flour of 5 kg each... packs another 90 kg" (and the book's Example 9 packets). | Change the setting (e.g. seed packets, tiles, pages read) keeping the reverse-engineering task. |
| C7M-2.5 mcq 85 passengers, 27 off, 1 more | MEDIUM | Same bus-passengers-getting-off bracket setting as existing C7M-2.5 mcq (62 passengers, 18 off, 7 back on). | Use a non-bus story (stock in a store room, balance in a wallet) with the same four-option structure. |
| C7M-2.5 multi_statement (9+14)-5 ... 33-(15+6) | MEDIUM | Statement 3 is the existing multi_statement's Statement 1 (40-(15+6)) with new numbers, and Statement 2 type (a-(b-c) vs (a-b)-c) is also in the existing pack. | Replace Statement 3 by a different test, e.g. 50 - (20 - 6) = 50 - 20 + 6 with a bracket that holds three terms, or a statement about a bracket after '+'. |
| C7M-2.7 sa3 tomatoes, Leela and Mani, 4 weeks | MEDIUM | "Every day except Sunday" / "closed on Sundays" weekly-count setting is already in existing C7M-2.7 (baker 120 buns, tailor shirts, Tanmay cycling) and in the 2.7 la4 (hostel milk). Also mirrors the book's Begur market exercise (p.42) closely. | New setting with a different count rule (e.g. a library open only on weekdays plus one Saturday per fortnight) or a different task (check someone's wrong grouping). |
| C7M-2.7 sa3 Kavya 101 x 37 and 99 x 37 | MEDIUM | Same error pattern as the existing Rohit claim (98 x 15 = 100 x 15 - 2: forgets to multiply the subtracted part) and near the existing 36 x 101 / 36 x 99 item. | Make the error different: e.g. she writes 99 x 37 as (100 - 1) x 37 = 100 x 37 - 1 and adds 1 x 37, or she splits 37 instead of 99. Use new numbers (e.g. 103 x 26). |
| C7M-2.7 la5 Meena, job offers | MEDIUM | Same structure as existing C7M-2.7 mcq (Lalitha earns 18,500, expenses, savings in 12 months), the existing Ravi tiffin la5 and the book's Binu savings exercise (p.43): (income - costs) x 12. Also a Class 7 pupil weighing job offers is an odd frame. | Keep the compare-two-options evaluation but change the quantity: two phone plans or two bus passes over a year, with a one-time charge, no income-minus-expenses-times-12 template. |
| C7M-2.2 sa3 -64 + -29 = -93 (change one or both terms) | MEDIUM | Same idea as the 2.2 la4 top-up ("given 284 + (-97) + 6 x 15 = 277, use how the terms have changed") and the book's Tinker the Terms I. Adds nothing new to that top-up. | Swap for a different 2.2 task, e.g. rewrite a mixed expression with the terms of a given list, or a reverse question: "an expression with terms 8 x 3, -45 / 9 and a number whose value is 30; find the number". |
| C7M-2.1 sa3 Pooja 607-248 vs 610-245, sa3 Arjun stalls, mcq Yamuna/Ganga | MEDIUM | Three of the six 2.1 items are the same "compare by how the numbers differ" reasoning, and the existing pack (Asha 1,205+340; fill_blank 1450+36) and the 2.1 la4 (water tankers, includes subtraction pairs (b) and (c)) already cover it, including subtraction. Pooja's item repeats la4 parts (b)-(c). | Keep Yamuna/Ganga (target-balancing is new). Change one of Pooja/Arjun to a different 2.1 skill: modelling a situation as an expression (e.g. write an expression for a given story, then test a learner's expression), or equal-value expressions from two numbers. |
| C7M-2.1 mcq newspapers 7A..7D ascending | LOW | Only needs arithmetic on four tiny expressions (54, 55, 56, 57) and is the book's Fig it Out 2 (p.25) in new numbers; nothing needs the chapter's reasoning. Close to a one-step compute. | Add reasoning pressure: ask which two sections can be ranked without working out any value and why, or give values near each other that force comparing 84-27 and 84-30 by structure only. |
| C7M-2.3 sa3 eco-club net change | LOW | Easy: terms group visibly into 1,000 and -1,000; existing pack has passbook and stock-register items of the same kind. | Use less pairing-friendly changes, or ask which pair of terms to group to make a stated total, with a wrong grouping to catch. |
| C7M-2.2 la5 bus fares, (c) | LOW | Money left after both days comes out as 165, which equals Saturday's fare in (a). A pupil can confuse the two numbers and the check in (d) (335) is easy to mis-compare. | Change Mr Mehta's money to 550 (left 215). Re-key (c) 215, (d) correct 385, Ravi's 505 off by 120. |
| C7M-2.5 sa3 Ritu change 200-48+97 | LOW | Nearly the book's own Example 5/Irfan (pp.27, 35) with new numbers; (b) and (c) are routine. Step (a) is the only thinking. | Acceptable; if wanting more depth, add a part: "Find another purchase for which 200-a+b would give a possible but wrong change". |
| C7M-2.6 la5 Independence Day march | LOW | Scouts/guides in rows is the book's Example 16 (p.39) setting. | Change to another rectangular arrangement (stalls, desks, seat blocks). |
| All five-mark items (Q6, 11, 16, 21, 27, 31, 35) | LOW | Template shape: 5 lettered parts, a "somebody says / somebody wrote" slip in part (c)-(e), a closing "evaluate the claim". Seven of seven end the same way. | Vary at least three: e.g. end one with a design task (choose numbers so that...), one with a prediction, one with a rule to state. |
| C7M-2.6 mcq (46-19) x 37 | LOW | Key text is nearly the longest option (36 vs 34, 29, 27 chars) in the mcq; options are otherwise fine. Not a defect. Also C7M-2.3 mcq courier: correct option longest (60 vs 59, 51, 56). | Trim the correct option's explanation clause by a few words so it is not the longest. |

## Template counts

- Claim-check verdicts: Pooja wrong, Arjun right, Rehan partly, Devi's brother right, Farhan wrong, Kavya partly, Rahul partly, Binod wrong, Sohan wrong; mix is acceptable.
- multi_statement key spread: "2 only" and "1 and 3 only" (two items; fine). Option position cannot matter (shuffled at load).
- Correct option longest: 1 of 6 mcq (courier, by one character) ; the rest not longest.
- Identical slot order across concepts: each concept runs mcq/ms, sa3 items, then one la5 near the end (2.1, 2.2, 2.3, 2.5, 2.6, 2.7 all end in a 5-mark question); two of seven concepts differ (2.4, 2.6). Mild.
- Repeated ideas: see the MEDIUM rows; 9 of 35 items repeat an idea or setting in the existing pack or in the 2.2/2.1 la4 top-up.
- No answer names an option by position. No `Remember`; Understand count 0.

## Per-concept verdicts

- C7M-2.1: keys correct, two MEDIUM repeats of the compare idea.
- C7M-2.2: keys correct, flour and -64 + -29 items repeat.
- C7M-2.3: keys correct, door item ambiguous, board game repeats drone/lift idea.
- C7M-2.4: keys correct, no problems (multi_statement and sa3 fine, café item is routine at Hard).
- C7M-2.5: keys correct, bus setting and multi_statement repeat.
- C7M-2.6: keys correct, no repeats of note; march setting is the book's.
- C7M-2.7: keys correct, three items repeat existing settings or error patterns.

## Counts

HIGH 0 / MEDIUM 9 / LOW 7

VERDICT: PASS
