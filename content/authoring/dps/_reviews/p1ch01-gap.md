# Review: class7-topup/p1ch01-gap.json (Class 7 Maths Part I ch 1, gegp101)

All 24 questions recomputed in python; every key, step split and mark total is correct. `--check` says valid
(10 concepts, 24 questions). Pages checked against `content/extracted/gegp101/pages/`. No second defensible answer.
Only items with a problem are listed.

| item | severity | what is wrong | exact fix |
|---|---|---|---|
| C7M-1.10 "Niharika wants the smallest number that uses exactly 24 sticks" | MEDIUM | Same idea, same stick table and same answer (2,008) as the existing pack's C7M-1.10 MCQ "Which is the smallest number that can be made using exactly 24 sticks?". A pupil who has seen one has the other. | Replace with a different book idea from p. 23, e.g. "largest number using exactly 24 sticks, and how many digits it must have" (twelve 1s), or a stick-rearranging item (63,890 -> 88,078 style), with new numbers. |
| C7M-1.7 "(c) Both products are of two 6-digit numbers ... 11 or 12 digits" | MEDIUM | Part (c) repeats the existing pack's C7M-1.7 short answer "Can both factors have 6 digits? ... A 6-digit x 6-digit product has 11 or 12 digits". | Change (c) to a different shape not in the pack (e.g. why the pattern product of two 4-digit numbers 1,111 x 1,111 has 7 digits while 3,333 x 3,335 has 8, using 1,000 x 1,000 and 10,000 x 10,000 bounds). |
| C7M-1.7 depot "bill still fits the screen" (8,000 x 3-digit price) | MEDIUM | Third item in this concept with the same "product must fit a fixed number of digit boxes" frame (existing pack: printing press slips, cinema software 9 boxes). The 125 x 8 = 1,000 step is new, but the setting is repeated. | Change the setting away from a display/field that holds N digits (e.g. count how many 3-digit prices make the bill a crore or more, or compare the bill with 10 lakh with no digit-box device). |
| C7M-1.5 "A table of city populations ... Chennai ... Kolkata" | MEDIUM | Idea (round book-table populations to the nearest lakh, compare, find change) is the existing pack's C7M-1.4 Pune/Jaipur and C7M-1.5 Bengaluru items. Chennai and Kolkata are book-table rows (fine as data), but the task is the same. | Keep the data, change the task: e.g. ask which rounded-to-lakh conclusion is wrong ("Kolkata fell by 1 lakh" vs exact fall of 86,197) or use ten-thousand rounding and ask when the lakh rounding hides the change. |
| C7M-1.5 Sohan (13,52,416 - 3,97,850) | MEDIUM | Same trick as the file's own solar-farm item (compare with a round value, direction of the difference) and as the existing pack's "8,47,300 - 3,47,300 = 5,00,000 ... 3,52,900 is more" item. Two items in this file are one idea. | Keep the solar-farm item; replace Sohan with a different estimation idea from p. 11-12 (e.g. which of Roxie/Estu is closer for a new sum, or an estimate that is nearer after rounding to ten thousand). |
| C7M-1.4 Riddhi (five nearest neighbours all 3,00,00,000) | LOW | This extends the book's own question on p. 11 and the existing pack's part (c) "8-digit number whose nearest ten lakh, lakh and crore are all 5,00,00,000". The range-and-count version is harder and genuinely new, so keep. | Optional: none needed. |
| C7M-1.4 "2,318 pilgrims ... Rs 2,318 for rice" | LOW | Round-up vs round-down by context is also the existing pack's water-bottle item (round up so nobody is short). Rice/money round-down is a different half. | Optional: change pilgrims/seats to a setting other than "enough for everyone". |
| C7M-1.3 Sippy +14/+18 item and the 7,000 vs 6,999 true/false | LOW | Both items rest on "fewest clicks = digit sum" (and the existing pack has several Sippy items). The exchange explanation in the first is new. | Optional: make the true/false use a different button set or the Handy Hundreds machine. |
| C7M-1.7 stem uses 1,11,111 | LOW | You asked about 1,11,111. It appears in the new item only as a product pattern (333 x 335 = 1,11,555; 1,11,111 x 1,11,111). The existing pack uses 1,11,111 as the answer of the C7M-1.10 sticks MCQ (largest number from 1s and 7s, 12 sticks). Different idea and concept; no real clash. | None. |
| C7M-1.6 Tara (halve one factor, double the other) | LOW | Halve-and-double is not named in the chapter (it teaches x5 = x10/2, x25 = x100/4, 125 = 1000/8). It follows from the same multiplication/division reasoning and the answer is exact, so not out of scope. | Optional: add "(like 125 = 1000/8)" to the key's chain so the book method is visible. |
| C7M-1.9 coin stack | LOW | `p` says "p. 3" (statue and waterfall); the stacked-coins idea is the book's exercise 11 on p. 21. | Set `p` to "pp. 3, 21" (the loader accepts one range; use "p. 3" only if kept as is). |

## Per-concept verdicts
- C7M-1.1: key correct (99,00,999; 10,01,000; 88,99,999; 70,00,000 / 7,000 = 1,000). Pass.
- C7M-1.2: 2 billion = 200 crore = 20,000 lakh True; dam comma 3-3-2-1; comma counts 1/1, 2/2, 3/2 correct. Pass.
- C7M-1.3: 14 + 18 = 32; 5,801 in 14; saves 2 x 9; 33 vs 7. Pass (see LOW).
- C7M-1.4: range 2,99,99,500 to 3,00,00,499, 1,000 numbers; 2,400 / 2,300; 3,00,000 vs 4,00,000. Pass (one repeat-free).
- C7M-1.5: 1,240 less; 9,54,566, 2,150 more; city roundings correct. Pass after MEDIUM fixes.
- C7M-1.6: 450 = 450; 48 x 125 = 6,000; 1,23,600 and 41,200. Pass.
- C7M-1.7: 1,11,11,15,55,555 (12 digits); 12,34,56,54,321 (11 digits); 8,00,000, 79,92,000, 124, 875. Pass after MEDIUM fixes.
- C7M-1.8: 24 trips (97,037 vs 1,01,256), 1,824 h = 76 days; Amazon 40 crore = 400 million, 2 arab, 5 s, 12 days, 720 vs 730 (fails by 10); 2,000 vs 2,190 h, 190, 912 films. Book facts (4219 km, 76 h, Amazon 6400 x 62,500, 1000 movies a year) are all in the chapter. Pass.
- C7M-1.9: 45,000 people, 40 km (22 km more); 200 m (20 m taller), 50 floors, 2,25,000 coins. Heights and 38 km line are from p. 3-4. Pass.
- C7M-1.10: 2,008 (brute force confirmed); 2,31,435; 3,00,000; 4,35,000 with 400 unused (unique). Pass after MEDIUM fix.

## Counts read
- Items: 24 (short_answer 23, long_answer 1). Blooms: Apply 10, Analyse 13, Evaluate 1. Understand 0 (limit 30%).
- Claim-check verdicts (Farhan, Mahesh, Sohan, Tara, Rafi): partly-wrong, false, false, true, true. Mix is fine.
- True/false: 2 items (True, False). Mixed.
- Slot shape: sa2 8, sa3 15, la5 1. There is no mcq/ar/la4/cs4 here, which matches a gap file for sa2/sa3/la5.
- No item names an option by position. No Remember items. All `d` are Hard or Hardest.
- Template: no. Settings are varied (stamps, exam, dam, Sippy, trust, godowns, solar, depot, wedding, train, Amazon, films, chain, coins, sticks, cards). The only template-like pattern is two estimation items using one trick (C7M-1.5) and three digit-box items (C7M-1.7).

HIGH 0 / MEDIUM 5 / LOW 5

VERDICT: PASS
