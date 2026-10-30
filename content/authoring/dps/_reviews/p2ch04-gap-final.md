# p2ch04-gap final review

Loader --check: valid (7 concepts, 34 questions). Diff vs v1 backup: 22 items differ. All recomputed in python. Pages checked against content/extracted/gegp204 (file 002 = p68 ... 019 = p85, 021 = p87, 022 = p88).

## Tina auto-fare item (C7M-4.2 #3) - all parts recomputed
(a) 6.8 - 1.5 = 5.3 km, 5.3 x 14.5 = 76.85, fare 106.85: correct. (b) 8 trips: ordinary 854.80; plan 650 + 42.4 x 4.25 = 650 + 180.20 = 830.20; plan cheaper by 24.60: correct. (c) 6 trips: ordinary 641.10; plan 650 + 31.8 x 4.25 = 785.15; ordinary cheaper by 144.05: correct. 7 trips: 747.95 vs 807.675 (shown 807.68): correct. Break-even is 7.71 trips, so "plan only for 8 or more" is right. The minimum fare is correctly absorbed in the 650 (stated in the stem). Marks 1+2+2 = 5, steps 5. No second answer. PASS.

## New recurring/non-terminating items - recomputed
4.6 #1 (9 / 40 = 0.225, remainders 10, 20, 0): correct. 4.6 #2 (4/27: digits 1,4,8 remainders 13,22,4; 27 x 0.148 = 3.996; 27 x 0.148148 = 3.999996): correct. 4.6 #3 (next terms 0.03125, 0.00032; products 0.1, 0.01, 0.001; 1/16 = 0.0625; 1/24 digits 0,4,1,6,6 remainders 10,4,16,16): correct. 4.6 #4 (7/22 digits 3,1,8,1,8 rem 4,18,4,18,4; 15/22 digits 6,8,1,8,1 rem 18,4,18,4,18): correct. Book p.85-87 teaches remainder chains and "never ends" (1/7 chain) and the 1/2, 1/5 pattern: in scope.

## Other differing items - all correct
4.1 #4 (3.0462, 30462/10000, 10000, then 3.1 with multiplier 10); 4.2 #0 (3.9 sq cm); 4.2 #1 (176.50, change 23.50); 4.3 #0 (18.6, 9.3, 0.75, 0.8, 0.99, 12.276); 4.3 #2 (1.5, 0.9, 0.54, 4th bounce 0.324); 4.4 #1 (2 tenths -> 20 hundredths; 261/8 = 32.625); 4.4 #2 (x25, x8, x625; 8.675, 2.776, 21.6875; long division 21 r11, 6 r14, 8 r12, 7 r8, 5 r0); 4.5 #1 (37.2, 46.5, 62 vs 55.8); 4.5 #2 (750, 900, 7.5, 7.2, 18 s, 72 vs 75 m/min); 4.5 #4 (30, 40, 60, 120; extra 10, 20, 60); 4.7 #1 (18.5; 9020 vs 9018.5; 18 leap years 9018; 1000 yrs 180 -> 90180 vs 90185; every 200th year restores 5 -> 185 -> 90185); 4.7 #3 (291, 438291, 438290.64, 0.36). Steps sum to marks everywhere. Pages right.

| Item | Severity | Problem | Fix |
|---|---|---|---|
| C7M-4.7 #3 (1200 years, 1200/4 - 1200/100 + 1200/400) | MEDIUM | Same method and the same comparison with 365.2422 as existing class7/p2ch04.json C7M-4.7 "Count the calendar days in 2000 years under the full leap-year rule" (divisible by 400, century years, total days, compare). | Make it find-the-error: give a wrong formula (e.g. 1200/4 + 1200/100 - 1200/400) and ask the student to find the slip and correct; or change span to a start not at year 1 (e.g. 1901 to 2100) so counting differs. |
| C7M-4.7 #1 (imaginary planet) | LOW | Same mechanism as existing la4 "Kavya ... divisible by 4 except divisible by 200 over 1000 years", though setting and numbers differ and the task is design. | Accept; or change the rule to a "every 8th year, not every 40th" pattern. |
| C7M-4.2 #1 (bill 6 x 12.75 + 2.5 x 40, change from 200) | LOW | Close to existing "Amina buys 2.5 kg ginger ... balance from a 200 note". | Change to a different payment note or drop the change part. |

HIGH 0, MEDIUM 1, LOW 2.

VERDICT: PASS
