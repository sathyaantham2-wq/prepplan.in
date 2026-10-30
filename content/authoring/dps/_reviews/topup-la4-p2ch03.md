# Review: topup-la4 p2ch03 (Class 7 Maths II ch3, gegp203), 9 items

Every key recomputed in python (factor lists, gcd/lcm, brute force over all pairs with HCF 6 / LCM 180, remainders for the marble problem). Printed pages checked: file 001.txt = p47, so file n = p(46+n); all `p` values use the printed scheme.

## Item by item

| # | Concept | Verdict | What is wrong | Fix |
|---|---|---|---|---|
| 1 | C7M-3.1 shelves 84/126 | LOW | Key correct (HCF 42, 5 shelves; cap 30 gives 21, 10 shelves). Pages 47-48 fine. Same idea as existing pack's apples/oranges baskets (96/144) and fences. Steps 4 x 1 match parts. | Optional: change the setting (e.g. two ropes or cloth rolls). |
| 2 | C7M-3.2 factors of 504 / Farhan | LOW | Key correct (504 = 2^3 x 3^2 x 7; 56 x 9, 63 x 8; 54 fails; 32 has 6 factors, 30 has 8). Pages 50-52 correct (division method p50, conjecture p52). Claim-check on number of factors duplicates the existing pack's Anil "every number has an even number of factors" idea. | Swap Farhan's conjecture for a different one, or make it a true claim. |
| 3 | C7M-3.3 HCF of 168, 252, 420 / Rohit | LOW | Key correct (HCF 84, 12 common factors; Rohit's 2520 is actually the LCM). Pages 53-54 fine. "Took max instead of min counts" is the same error as the existing Ishan 1372 item. | Keep, but vary the error (e.g. Rohit includes the prime 5 once). |
| 4 | C7M-3.4 torans 12/18/20 | **HIGH** | Key part (c): "it repeats primes more often than needed (for example four 2s instead of two)". 4320 = 2^5 x 3^3 x 5, so it has FIVE 2s (and three 3s), not four. Everything else correct (LCM 180; 15, 10, 9 strips; 24 times; 360 and 540 cm). Existing pack also has Mahi's tile borders, a close setting. | Change to "five 2s instead of two (and three 3s instead of two)". Consider a different setting. |
| 5 | C7M-3.5 LCM when one is a factor of the other / Meena | MEDIUM | Key correct (7/35, 12/60, 15/45; Meena is right). But parts (a) and (b) are Figure it Out Q2 (p59) nearly word for word ("The LCM of 3 and 24 is 24...", "describe using algebra"), and (c) is the book's n and 5n Math Talk: about 3 of 4 marks are book recall for a "Hard Evaluate" slot. Key (c) sentence is garbled ("and of course its own"). | Replace (a)/(b) with a new situation (e.g. LCM of n and kn when n is given only through its prime factors, or a counterexample hunt on a changed claim); fix the (c) wording. |
| 6a | C7M-3.6 Neha / Kiran | LOW | Key correct (42,63 then 2,3; HCF 210, LCM 1260; 264600 both sides; Kiran should divide by 7 again). Stem says "Three students" but only two are named. Overlaps existing Imran item (stopping a division table early, 168/252). | "Two students". Vary the error type. |
| 6b | C7M-3.6 HCF 6, LCM 180 | LOW | Key correct (brute force gives exactly (6,180), (12,90), (18,60), (30,36); 24 impossible; check of (30,36) correct). Step 3 packs method plus four pairs into one mark; "Create" is generous for a find-all task. | Split step 3 (method 6a, 6b with ab = 30 and co-prime; the list of pairs), merge the check, or relabel Apply/Analyse. |
| 7a | C7M-3.7 carton 24 x 36 x 60 | OK | Key correct (4 and 6 fit; 8 fails on 36, 9 on 24; HCF 12; 30 cubes; 240 cubes, 8 times). Page 64 correct (Q6). Little overlap with existing pack. | None. |
| 7b | C7M-3.7 marbles / Priya | MEDIUM | Key correct (LCM 60; 240; 62 fails twice; next 660, checked by python). But the remainder-after-LCM type is already used three times in the existing pack (chairs, goats, mangoes), and it is the book's Q8 type. Part (d) (add LCM(60,7)) edges toward the OUT line "modular arithmetic proofs -- not used". | Use a different Q for this slot; if kept, replace (d) with "list the next multiple of 60 that leaves remainder 2" without the general reason. |

## Cross-checks

- Marking steps: all 9 have 4 steps summing to 4, each a checkable item; they match the parts and the key (only 3.6b step 3 is overloaded).
- Page `p`: all within the printed scheme and on the right pages; no page fixes required.
- Scope: no OUT line clearly violated. Euclid's algorithm, unlike-fraction sums and formal proofs are not used. 3.7b(d) is borderline (see above).
- Template (counts): 7 of 9 are claim-checks (3.2, 3.3, 3.4, 3.5, 3.6a, 3.6b, 3.7b). Verdicts: 6 "wrong or impossible", 1 "right" (3.5, Meena). 9 of 9 are lettered (a) to (d) with compute first and justify last; 7 of 9 hang on a named person ("X says/conjectures"). One-sided and templated: MEDIUM. Mix in at least two more true claims or plain non-claim items (3.1 and 3.7a are already non-claims).
- Difficulty: only 3.5 is recall in disguise; the rest need the chapter.
- Repeats of existing pack: 3.1 (baskets/fences), 3.2 (factor-count conjecture), 3.3 (max vs min counts), 3.4 (tile border), 3.6a (Imran), 3.7b (remainder trio).

## Counts

HIGH 1 (item 4, "four 2s" should be five), MEDIUM 2 (items 5 and 7b) plus one MEDIUM for the overall claim-check template (counted separately), LOW 5 (items 1, 2, 3, 6a, 6b).

Verdict: pass after fixes.
