# Review v3: class6s ch12 (SST6, fees112, Grassroots Democracy Part 3), re-review after one fix pass

Pack: content/authoring/dps/class6s/ch12.json (124 questions). Diff against orig.json: 50 changed items, all read in full. Index = 0-based position inside the concept (12.5 idx 14 = C6S-12.5, 15th item).
Figures checked on the rendered pages (fix-class6s-ch12/p3.png and p6.png): Fig 12.2 bottom of urban side is Ward Committee, then People of the Ward (confirmed). Fig 12.4: "CRM - Services on request" strip holds Water Tanker, Septic Tanker, Auditorium, Funeral Van, Mobile Toilet, Ambulance (confirmed); "Tree cutting & tree transportation" has no CRM label (confirmed); marriage certificate, fire services, various licenses, water tanker/debris clearance, grievances are CRM headings (confirmed).
Script checks on all 124: step marks sum to m everywhere; every option item has the correct option at o[0] and no duplicate options; no option named by position; no scope_out term (Mayor, 74th, reservation, Kolkata etc.) present; correct option strictly longest in 0 of 30 mcq. Arithmetic recomputed: 2026-1792=234; leaks (1+3)x450=1800, (20+3)x450=10350, saving 19x450=8550 vs 1x450=450; 9.5+7.5=17 km > 16 km (outside); 10-6.4=3.6 lakh; 15 of 2,000.

## v2 status
- v2 HIGH 1-3 (12.5 mobile toilet / funeral van / auditorium placement): FIXED. Replaced by tree cutting (idx 14, no CRM label, verified), a four-row match on printed headings (idx 18), a case study using marriage certificate + fire services (idx 8). Where the strip is used (idx 11, idx 21) the stem now says what the strip is; matches the image.
- v2 4 (Fig 12.2 order): FIXED, stems now state the figure rows; image agrees.
- v2 5 (12.5 AR): FIXED, R is now the below-1-lakh rule; A is its direct application; "R explains A" is right.
- v2 6 (12.6 row 4): partly fixed (see M1).
- v2 7-11 case-study weaknesses: mostly fixed (12.3 idx 12 (d) and idx 17 now hinge on chapter ideas; 12.2 idx 18 (d) reworked; 12.1 idx 6 two-sided motion). Residuals below.
- v2 12 (easy in disguise): mostly folded into scenarios. Remaining thin ones in M2-M3.
- v2 13 (true_false): improved, see M4.
- v2 14-16 repetition: 12.5 population-band items now 7 of 22 (was 11); 12.4 dates still heavy (L1).
- v2 18 (hard-coded 2026): FIXED, "2026" is now stated in every stem that needs it.

## HIGH (1)
H1. C6S-12.6 idx 20 (case study, table), part (b): "Which row shows a similarity rather than a difference". Key: Row 3 (elected members). But Row 2 ("A time people helped": city = dozens gathered to clear rubble; village = kids reported a low wire) is also a similarity once part (a) is filled: in both places ordinary people stepped in for the community, and Anita says "there's still some sense of community in the city". A solver who answers Row 2 is defensible, and the step rubric ("Row 3: elected members in both") would mark her wrong. Smallest fix: change (b) to "Which row shows a feature the chapter's closing summary says urban local bodies share with the rural ones, and what is it?" or change Row 2 to "Who acted first" with city = neighbours, village = kids, so it is clearly a contrast; or let the rubric accept Row 2 with community help.

## MEDIUM (5)
M1. C6S-12.6 idx 20 (a)/(c): Row 4 is labelled "How taking part seems" but Anita's "It seems more complicated in the city" is about how democracy/local government seems, not taking part; the blank city cell is not fixed by the text. Relabel "How local government seems". Also (c): Line X ("every area has elected representatives") is refuted by Row 3 in one step, so it is a mild strawman. Make X a real trade-off, e.g. "Hold ward meetings in a big hall so residents hear the committee", versus Y.
M2. C6S-12.1 idx 11 (fill_blank, labelled Apply/Hard): answer "Local" is the level name the stem all but gives ("both branches come out of the same level, called ___ Government"). One-line fact, not application. Make the scenario require choosing between "Local", "State", "Union" from a described duty (for example "a body that keeps an eye on a blocked drain in a lane").
M3. Near-recall items still labelled Hard: C6S-12.5 idx 12 (CRM expansion plus property tax), idx 13 (property tax and water charges), idx 20 (a) (both have a Municipal Corporation), C6S-12.1 idx 14 (a) (name the bottom row, readable from the stem list), C6S-12.4 idx 15 (a). Each has a thin (b) that rescues it, so keep but raise the (b) demand or accept as the bank's floor.
M4. C6S-12.6 idx 7 and C6S-12.3 idx 20 (true_false, both key "True"): they restate a book fact; 12.3 idx 20 carries a mild misconception ("not its own idea"), 12.6 idx 7 does not ("even people who hold no post" is simply what the story says). Convert 12.6 idx 7 to a plausible false claim ("only elected members could get the wire shifted") with the correction as the key.
M5. C6S-12.3 idx 12: (b) is pure arithmetic from the stem; (d) compares per-leak savings (8,550 vs 450) but the second crew applies to every leak, so with many leaks it could win; the stem fixes this only by saying "leaks like B". Add "(assume equal numbers of leaks of each kind)" or give leak counts so the decision is sound.

## LOW (5)
L1. C6S-12.4: the 1688 / 1792 / 1865 / 16 km facts still appear in 8-9 of 20 items each (1688 in idx 0,1,2,9,11,16,17,19; 1792 in 1,2,4,6,10,11,14,16,17). One cluster; swap two items for Fig 12.1 or the Fig 12.2 pyramid content.
L2. C6S-12.5 idx 13 (a) "name two headings that bring money": business/hoardings/trade licenses also brings fees, so a third answer is defensible; the rubric names property tax and water charges only. Add "any two of".
L3. C6S-12.4 idx 10 (b) accepts "water charges" as carrying "the power to levy taxes": it is a charge, not a tax. Keep property tax as the only key, drop the parenthetical.
L4. C6S-12.5 idx 11: "Water tanker" appears both in the CRM row "water tanker, debris clearance" and in the on-request strip; with the "any two" rubric this is harmless, but say so in the rubric.
L5. C6S-12.2 idx 18 (d): "the committee can send only one urgent report today" is contrived and the key admits either choice; it works as a reasoning item but the "decide" is soft. Acceptable.

## Per-concept verdicts
- C6S-12.1: load-ready after M2 (optional).
- C6S-12.2: load-ready.
- C6S-12.3: load-ready (M4, M5 optional but M5 is a one-phrase fix).
- C6S-12.4: load-ready (L1, L3 optional).
- C6S-12.5: load-ready (all v2 HIGH resolved; M3, L2 optional).
- C6S-12.6: NOT load-ready until H1 is fixed.

## Template counts (124)
Types per concept 12.1-12.6: 8 short_answer, 4-5 long_answer, 4-6 mcq, one each AR and multi_statement, plus match (12.2-12.5), fill_blank (12.1, 12.4, 12.5, 12.6); slot order differs per concept. Correct option strictly longest: 0 of 30 mcq. No Easy/Medium items. Repetition limited to L1. Not templated.

Counts read: 124 (50 changed items in full, 74 unchanged re-checked by script and against v2). HIGH 1, MEDIUM 5, LOW 5.

Verdict: NOT load-ready as it stands (one HIGH, H1, a one-line fix in 12.6 idx 20). With H1 fixed: load-ready; the MEDIUM items are optional polish.
