# Round 2: class7-topup/p1ch02-gap.json (C7M P1 ch2)

Loader --check: valid, 35 questions, slot/marks mix identical to v1 (19 sa3, 7 la5, 6 mcq, 2 multi_statement, 1 match). Step marks sum to marks everywhere. Diffed against v1: 17 items changed; all 17 recomputed (newspapers 65/66/67/69, auto fare 142/156/13 km, 30 = 24-36+42, tiles 24, bus 165/170/215/385/505, courier 9,071, egg, eco-club -133, slips 30/15/15/43/-13, reams 200, ms key "1 and 2 only", milk 2,580/2,440/80/2,560, (46-19)x37, saplings 90/130/5/127/300, library 22 days 1,100/1,002, phones 7,164/6,138/1,026/1,176). All keys correct.

## Earlier findings: status
All 9 MEDIUM and the LOWs from round 1 are resolved: door -> egg; board game -> envelope slips (different idea); flour, -64+-29, Pooja, 85-passenger bus, tomatoes, Kavya, Meena, march all replaced; multi_statement Statement 3 replaced by a 3-term bracket after '+'; bus-fare money changed to 550; 5-mark endings now vary.

## Problems
| Item | Sev | Problem | Fix |
|---|---|---|---|
| C7M-2.7 sa3 Tanya, 104 x 27, "Way 2: (100+4) x (20+7) = 100x20 + 4x7" | HIGH (scope) | The key needs the product of two sums, (a+b)(c+d) = four products (100x7 and 4x20 "left out"). The chapter teaches only a x (b +- c) (scope IN list; the book's summary says "multiplying a number with an expression inside brackets"). Product of two bracketed sums is beyond this book, and the only book mention is a one-line "no computation" identification item (Fig it Out 5(b)). | Rewrite the item so only a x (b + c) is used. Example: Way 2 is "104 x 27 = 100 x 27 + 4 = 2,704"; ask (a) check Way 1 (2,808), (b) which product was left out (4 x 27 = 108) and show 2,808 - 2,704 = 104 = 108 - 4, (c) verdict. Or replace with a different 2.7 skill; avoid the existing Rohit slip pattern. |
| C7M-2.1 mcq newspapers | LOW | Still four small subtractions, but now stem forbids evaluating and the key reasons by differences. Acceptable. | None |
| C7M-2.1 sa3 Arjun stalls + mcq Yamuna/Ganga | LOW | Still two "compare by how numbers differ" items in 2.1 (the third, Pooja, was replaced). Acceptable. | None |
| C7M-2.6 mcq (46-19) x 37 | LOW | Correct option still marginally the longest (36 vs 34, 29, 27). | Add two words to the third and fourth options |
| C7M-2.2 la5 bus fares, C7M-2.7 phones, C7M-2.5 milk | LOW | All still use the "(a)...(e), then a slip or a design" shape, but the endings now differ (design, slip, prediction, threshold, rule). Not templated. | None |

## Counts and template reads
Claim-check verdicts: Mohan wrong, Bhavna right / Tej wrong, Tanya partly, Joseph wrong, Ravi wrong, accountant wrong; mix acceptable. multi_statement keys: "1 and 2 only" and the earlier "2 only" / "1 and 3 only" item. Correct-option-longest in mcq: 1 of 6. No option named by position. No new item repeats class7/p1ch02.json or p1ch02-la4.json (milk coop vs library-fine fund, phones vs bookshop, bus fare vs metro trip differ in task).

HIGH 1 / MEDIUM 0 / LOW 4

VERDICT: FAIL
