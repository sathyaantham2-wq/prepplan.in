# Fix verification: Class 7 Maths (class7-*) and Class 7 Science (class7sc-*) DPS reviews

Date 2026-10-08. Method: every HIGH item in each review was located in the chapter JSON by concept code plus a text quote and
judged against the current file. Templating was measured by script: claim_check verdict split, multi_statement and
assertion_reason key spread, and "slot-same" (share of the 20-22 slot positions whose item type equals the modal type
across the chapter's concepts; above about 85% means the same skeleton in every concept).

Scope notes: class7s-* (Social) reviews were not in the brief and were not checked. There is no class7-p1ch01 review file
(p1ch01.json has no review). The p1ch06 and sc-ch09 reviews have no HIGH section (0 HIGH).

## Result table

| chapter | HIGH total | HIGH fixed | HIGH not fixed | templating still present |
|---|---|---|---|---|
| M p1ch02 | 0 | 0 | none | no (7 distinct skeletons, claim 4 No / 1 Yes) |
| M p1ch03 | 3 | 3 | none | partly: claims fixed (4 No / 3 Yes) but slot-same 89% |
| M p1ch04 | 1 | 1 | none | partly: claims fixed, slot-same 92% |
| M p1ch05 | 3 | 3 | none | yes: 6 of 7 claim-checks still No, slot-same 95% (2 skeletons) |
| M p1ch06 | 0 | 0 | none | no (claims 5 Yes / 1 No, 7 skeletons) |
| M p1ch07 | 1 | 1 | none | yes, inverted: all 7 claim-checks now "Yes", slot-same 94% |
| M p1ch08 | 2 | 2 | none | no (claims 4/2, 7 skeletons) |
| M p2ch01 | 0 | 0 | none | yes: all 7 claim-checks still No/"not always", slot-same 92% |
| M p2ch02 | 1 | 1 | none | no (claims 5 Yes / 1 No, 7 skeletons) |
| M p2ch03 | 4 | 4 | none | mostly fixed (claims now 6-7 Yes, lopsided the other way; 7 skeletons) |
| M p2ch04 | 0 | 0 | none | no (claims 4/3, 7 skeletons; review said whole chapter templated) |
| M p2ch05 | 1 | 1 | none | partly: claims fixed (4/3) but slot-same 97% (2 skeletons) |
| M p2ch06 | 1 | 1 | none | partly: claims fixed (3 Yes), slot-same 94% |
| M p2ch07 | 2 | 2 | none | no (claims 5 Yes / 2 No, 7 skeletons, MS keys all different) |
| SC ch01 | 0 | 0 | none | partly: 3 skeletons for 3 concepts, MS keys varied, but claim-checks still lean No |
| SC ch02 | 4 | 4 | none | no (MS keys now 5 different, 5 skeletons) |
| SC ch03 | 1 | 1 | none | partly: MS keys varied, slot-same 88% |
| SC ch04 | 2 | 2 | none | no (slot-same 47%, MS keys varied) |
| SC ch05 | 3 | 3 | none | no (slot-same 51%, MS keys varied, claims 5 Yes / 2 No) |
| SC ch06 | 1 | 1 | none | partly: MS keys varied, but all 6 claim-checks still negative, slot-same 89% |
| SC ch07 | 1 | 1 | none | yes: 6 of 6 claim-checks "No", slot-same 95% (2 skeletons), MS key "1 only" in 3 of 6 |
| SC ch08 | 1 | 1 | none | no (MS keys varied, slot-same 54%; claims 4 No / 1 Yes) |
| SC ch09 | 0 | 0 | none | yes: 7 of 7 claim-checks still "No" (slot-same 49%, varied) |
| SC ch10 | 0 | 0 | none | inverted: 6 of 6 claim-checks now "Yes", MS keys fine |
| SC ch11 | 1 | 1 | none | partly: claims fixed, slot-same 92% |
| SC ch12 | 3 | 3 | none | no (slot-same 46%, 7 skeletons, claims 3 Yes / 4 No) |
| **Total** | **36** | **36** | **0** | |

Maths: 19 HIGH, 19 fixed. Science: 17 HIGH, 17 fixed.

## Per-chapter HIGH detail (all FIXED, evidence = current text)

Maths
- p1ch03: 3.5 Radha now says "three items given in grams" (FIXED); 3.6 tank/drum rewritten as one 600 L drum, key 306.55 L and 293.45 L spare (FIXED); the Indian Railways 35 paise item is no longer in the file (FIXED by removal).
- p1ch04: 4.1 Shabnam statement 1 now "cannot be written using the letter a" (FALSE), key "2 and 3 only" correct (FIXED).
- p1ch05: 5.3 PQRS now uses angle RQT on PQ extended, linear pair, 90 degrees (FIXED); 5.4 stage pipes stem now says upper two at m were read directly (FIXED); 5.7 AR now "In quadrilateral ABCD, AB parallel to DC", co-interior 120 (FIXED).
- p1ch07: 7.1 AR reason now "Only then are all three sides AB, AC and BC equal", keyed explains (FIXED).
- p1ch08: 8.6 cloth merchant now compares two named plans (FIXED); lemon juice now says "at most 30 cups", key 27 cups / Rs 243 derivable (FIXED).
- p2ch02: 2.3 MCQ distractor changed to "(-30) x 12 = (-30) x (-12)" and the other options are false (FIXED).
- p2ch03: 3.5 match replaced; 3.5 MCQ now "such as 12 and 36" so "exactly 2" is false (FIXED); "Fire in the Mountain" item and Guna "biggest number" item are gone from the file (FIXED by removal).
- p2ch05: 5.7 case study part (c) now asks for the LARGEST gap (Cricket), no Badminton/Chess tie (FIXED).
- p2ch06: 6.5 hexagon case study now states "exactly 250 hexagonal tiles ... smaller courtyard but still 250 tiles" (FIXED).
- p2ch07: 7.2 jar now "On the day of that 8th deposit the shop raises the price to Rs 380, before she can buy" (FIXED); 7.6 Aman and Bela: Aman now has two slips, Bela one, key says Bela, with the check (FIXED).

Science
- ch02: onion item now frames the plan without asserting the unsupported result, match 2.3 #13 sound (FIXED); no "Option (a)/(b)" text anywhere in the file (FIXED); 2.5 #9 now four situations with 4 situation marks plus 1 common-idea mark (FIXED); 2.4 Sanjana now lemon juice with lime water (FIXED).
- ch03: 3.6 case study now asks "Which of the insulators in the list does the chapter name for covering wires" (FIXED).
- ch04: 4.6 eco club (a) no longer printed in the stem (FIXED); 4.5 element Y is now named "sulfur" in the stem (FIXED).
- ch05: 5.2 #19 reworded to "new white substance that forms and makes the liquid look milky" (FIXED); Table 5.1 reference gone (FIXED); the 5.6 Q20 item with the missing part (b) key no longer exists (FIXED by rewrite).
- ch06: 6.2 Priya "(1 April)" removed from the stem (FIXED).
- ch07: 7.5 bukhari (b) now says no hot air blows towards the children, so radiation only is derivable (FIXED).
- ch08: 8.5 Priya step 3 now says "at 50 km/h she would cover 25 km in 30 min" (FIXED).
- ch11: 11.3 shadow item now "torch that is switched on", situations consistent with a lit torch (FIXED).
- ch12: 12.5 polar camp part (d) now asks North leader and South leader separately (FIXED); 12.4 show-impossible no longer claims "one hemisphere is always tilted more" (FIXED); 12.1 rotation MCQ no longer says "the second option" (FIXED).

## Residual items noticed while checking (not HIGH)

- class7sc ch07: the answer text of C7SC-7.3 #3 and C7SC-7.4 #5 refers to "the third option" / "the second and third options". The loader shuffles options, so these explanations will point at the wrong option. Same class of bug as the "Option (a)" finding in ch02.
- Chapters where the claim-check fix overcorrected into "all Yes": M p1ch07, SC ch10 (and M p2ch03 is 6-7 Yes). The goal was a mix, not a flip.

## Chapters needing another fix pass (templating only; no HIGH remains)

1. Claim-checks still all negative: M p2ch01, M p1ch05 (6 of 7), SC ch07, SC ch09, SC ch06 (and SC ch01 leans No).
2. Claim-checks flipped to all Yes: M p1ch07, SC ch10, M p2ch03 (mostly Yes).
3. Identical slot skeleton across concepts (slot-same above 85%, 2-4 distinct skeletons): M p1ch05, M p1ch07, M p2ch01, M p2ch05, M p2ch06, M p1ch03, M p1ch04, SC ch07, SC ch11, SC ch06, SC ch03. This is partly required by the loader's per-concept minimums, so treat it as low priority.
4. Option-position wording in explanations: SC ch07 (7.3 #3, 7.4 #5).
