# v4 final verification: class6sc/ch06 (SCI6, Curiosity Grade 6 ch6, fecu106)

Method: diffed against orig.json by content (60 changed or new items; 120 questions now, concept 6.6 down from 21 to 20). Every key recomputed in python or checked on the pages. `--check` run: "6 concepts, 120 questions, valid". Loader-side checks I also ran on the 60: o[0] equals the key on all option items, no duplicate options, no "option (b)" position references, step marks equal item marks on all.

## Both v3 HIGH fixed
- H1 (was 2.4, now [2.5]): now asks "which piece is shiny but brown, and which dull but not brown". Only copper wire (shiny, reddish-brown) and chalk (dull, white) fit; brass key is yellow, cardboard is brown. One answer. FIXED.
- H2 (was 3.8, now [3.9]): now "softest of the four listed materials still harder than the new sample (5 strokes)": candidates aluminium (7) and iron (not scratched); softest is aluminium. One machine-matchable answer. FIXED.
- v3 M1 (Amma's kitchen) and M2 (eco-club "for your assignment in (a)") are also fixed in [1.2] and [1.8].

## Per changed item (OK unless stated)
Concept 6.1: [1.2] OK (18 = 6+3+4+5; 9 cooking containers; 4 vs 2 shelves, then 4 vs 3). [1.4] OK (55 above 50; 25 and 10 below 30; none fits). [1.7] OK (4 materials; spoon and tumbler groups both mix 3, answer 3 either way). [1.8] OK, see L1. [1.11] OK (only W). [1.14] OK (1-b, 2-a, 3-d, 4-c). [1.15] OK (1000/30 = 33.3, plastic Rs 30 passes, steel Rs 60 does not; paper 30 x 200 x 2 = Rs 12,000; plastic Rs 900). [1.16] OK (rev; only the cloth rejection is sound). [1.20] OK (copper wire and iron nail; glass jar and plastic bottle; cloth bag and paper sheet; empty box metal-and-holds-water).
Concept 6.2: [2.3] OK. [2.4] OK (750 + 65b <= 1500 gives b = 11; 990 + 475 = Rs 1,465; marks 1+1+2). [2.5] OK (H1 fix). [2.10] OK (1-b, 2-d, 3-a, 4-c). [2.11] OK (planed wood is dull). [2.13] OK (plate and coin both misplaced, so "at most one" fails). [2.15] OK (open, saying and example accepted). [2.17] OK (wax the toy, scrape the pot). [2.20] OK (scrubbing shines only the metal; coating shines both).
Concept 6.3: [3.2] OK (clay sinks 6 mm: harder than sponge 15, softer than rubber 3). [3.3] OK (salt crystal, stone, sponge). [3.6] OK (A true relative to sponge; R false). [3.9] OK (H2 fix). [3.13] OK (limits 15 to 25 mm; R 25 and S 18 pass; Q 12 too hard, P 40 too soft; hardest-to-softest Q, S, R, P; buy R). [3.14] OK. [3.15] OK. [3.18] OK. [3.19] OK (stone > wood > candle, claim correct).
Concept 6.4: [4.2] OK (1-c, 2-d, 3-a, 4-b, each need has one fit). [4.3] OK (blurred at 6, unseen at 10). [4.4] OK. [4.8] OK. [4.9] OK (45%, 15%, 5%; only frosted glass meets both). [4.11] OK. [4.12] OK. [4.13] OK. [4.14] see M1.
Concept 6.5: [5.1] OK (salt). [5.2] OK (tumblers 1 and 3 show material, answer 2). [5.4] OK. [5.5] OK, see L2. [5.6] OK. [5.7] OK. [5.8] OK, see L3 (B and C safe arithmetic: A 8 and B 5 safe, C short by 2, then 5). [5.10] OK. [5.12] OK. [5.14] OK, see L4 (wheat flour and vinegar are the two wrong entries; 3 mix: glucose, vinegar, honey). [5.16] OK. [5.18] OK. [5.20] OK.
Concept 6.6: [6.1] OK (air in a football is matter; the other three contradict the definition). [6.2] OK (A true, R true, R does not explain A; mass is the reason). [6.4] OK (1500 mL against 5 x 250 + 3 x 125 = 1625 mL). [6.5] OK. [6.8] OK (1500, 2250, 1150 mL; 11.25 L; 5 pots). [6.9] OK (1800 - 7 x 250 = 50). [6.12] OK (brute force: cheapest exact 2.4 L is Rs 440 without the 2 L pack, Rs 430 with it; 1 L pack Rs 180 is cheapest per litre). [6.13] OK (1500 L / 20 = 75). [6.14] OK. [6.16] OK. [6.19] OK (kgs, ml, 2m³ break the rules: 3).

## MEDIUM (1)
M1. [4.14] part (e) "lampshade that hides the shape of the bulb but still lets light through: 1 sheet or 6 sheets?" The stem only says 6 sheets hide the print, not that they block light, and 1 sheet still lets "the shape of each word be made out", which sits oddly with "hides the shape of the bulb". The key's "6 sheets would let little or no light through" is not given by the stem or the book, so a student who argues for 6 sheets (opaque, hides the shape, some light still passes) has a defensible second answer. Smallest fix: ask "translucent or opaque sheets for a lamp-shade that only softens the bulb's outline" and mark "translucent"; or drop the light claim and ask only which stack hides the view completely.

## LOW (4)
L1. [1.8] parts (a) and (b) mark against the student's own assignment; fine for a human or AI marker with the key's marking note, but the key is long and open. No change needed.
L2. [5.5] A and R are nearly the same fact (honey mixes, so no layer), so the item tests only the honey fact. Honey's behaviour is not stated in the book (exercise 10 lists it), so the key rests on everyday knowledge. Replace honey with oil-and-water or give R a real explanatory gap.
L3. [5.8] part (c) asks if the table supports "both parts" of the claim; the table shows the rise and the controls, while the mechanism comes from part (a) and the book. Say "Using the table and (a), is the claim supported?"
L4. [5.14] facts about wheat flour, vinegar and glucose are not stated in the book (exercise 10 only lists them as materials to test); they are standard school knowledge and the answer is unique, so acceptable.

## Template read
Question types: short_answer 48, mcq 26, long_answer 24, fill_blank 6, assertion_reason 6, multi_statement 6, match 4. Slot order differs in every concept. Correct option is longest in 4 of 26 mcq (15%). Claim-check verdicts: 3 partly right, 3 no, 2 yes. Marks: 48 x 1, 30 x 2, 18 x 3, 12 x 4, 12 x 5. Case studies now end in a reasoned decision or a table-based accept/reject; the rupee-arithmetic frame is less dominant than in v3. Not templated.

## Counts
HIGH 0. MEDIUM 1. LOW 4.

Verdict: load-ready after the optional M1 fix (the item is answerable as written; the ambiguity is narrow). If the caller wants zero known ambiguity, fix [4.14] (e) first; nothing else blocks loading.
