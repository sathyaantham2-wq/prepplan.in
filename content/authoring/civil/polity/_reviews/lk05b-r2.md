# Re-review of lk05b.json (Laxmikanth ch5, LK-5.7 to 5.12) after the fix pass

Verdict: **needs-fix**. Counts: HIGH 2, MEDIUM 6, LOW 4.
HIGH ids: CS-POL-ch05-1211, CS-POL-ch05-1111.

Method: all 120 items re-answered cold, one concept at a time, from ch05.txt (pdf pp.85-92) before the keys and explanations
were read. My answer matched the key on 120 of 120 (so the two HIGHs below are not wrong keys by the chapter's wording; they
are items where a second answer is defensible). Every distractor and false statement was then tested with "is this also
supported by the chapter?". Mechanical checks: check-civil-pack.py reports 0 problems; for all 54 "which" items the explanation's
list of correct statements equals the key, for all 18 "how many" items the explanation count equals the key, and each
"leaves out / includes statement n" wrong-option reason is true. Ids unique, `a` equals `o[0]` in all 120 (loader must shuffle, as for lk05).
The earlier HIGH (1118) is fixed: II is now the fn 14 reason ("all the more moved to quote it because I am proud..."), which
the chapter itself gives as Barker's reason, so "II explains I" is textual.

New or high-risk detail checked against the page and found sound: Nehru "lurking fears" (fn 3, p.91, 1949); Avadi 1955 text and
quote (fn 5); Pande, Constitutional Law of India (fn 9 tail, p.92); Alladi Iyer's quote and "significant role" (p.89); Bhargava's
"soul / key / jewel / yardstick" (p.89); Hidayatullah book "Democracy in India and the Judicial Process" p.51 (fn 15, p.92);
Barker 1951 and fn 13/14; UN 1945 (fn 4); atheistic/theocratic/secular examples (Bangladesh, Burma, Sri Lanka, Pakistan; USA, India).
No invented year, name or number found. Page citations hold.

## HIGH

**CS-POL-ch05-1211 (LK-5.12 Q11).** Statement 3 "A court may rely on the Preamble to interpret an article even where the
article is clear" is keyed incorrect, and the explanation says "assistance is taken where the terms are ambiguous". That does
not make 3 wrong by the chapter. The same page (p.90) records Kesavananda: "the Constitution should be read and interpreted in
the light of the grand and noble vision expressed in the Preamble", with no ambiguity condition. A candidate can defend "2 and 3 only"
from the chapter. The chapter never says clear articles are outside the Preamble's interpretive use. Two defensible answers.
Fix: replace 3 with a statement the chapter actually contradicts (for example "the Preamble is enforceable in a court of law" or
"the Preamble is a source of power to the legislature"), or drop the "even where clear" idea.

**CS-POL-ch05-1111 (LK-5.11 Q11).** Statement 2 "Iyer is described as a member of the Drafting Committee of the Constituent
Assembly" is keyed false because the chapter describes him only as "a member of the Constituent Assembly who played a
significant role". But Alladi Krishnaswami Iyer was in fact a member of the Drafting Committee. The stem does not say
"according to the chapter", and "is described as" is a reading trick, not knowledge. A knowledgeable aspirant marks 2 true and
chooses "1, 2 and 3 only". The explanation ("the Drafting Committee member is Munshi") teaches something historically false
by implication. Fix: swap 2 for a clearly false attribution (for example "Iyer is described as a former Chief Justice of India"),
or add "according to the chapter" and use a person who truly was not on the Committee.

## MEDIUM

**M1 - Statement-I/II "explains" calls rest on the builder's inference (719, 1018).** 719: I "Commonwealth membership does not
compromise sovereignty", II "association rests on free will and any member may go out" keyed "II explains I". Nehru's own reason
(fn 3) is "does not involve such commitments... flexibility", with free will as a second point; II omits the commitments reason, so "does
not explain" is also arguable. 1018: II is Ambedkar's definition of social democracy; he does not say it is the reason political
democracy cannot last without it. Not as bad as old 1118 (no competing textual reason), but convert one of the two to a
clean case (for instance 719 with II = "India accepted the Crown as head of the Commonwealth" keyed "does not explain", or put the
"no commitments" reason in II). 819, 918, 1118, 1219 are sound.

**M2 - Attribution of the two Supreme Court quotes rests on footnote-marker position (801, 808, 820, 815).** The chapter prints one
continuous quotation with fn 7 mid-quote and fn 8 at the end. Keys (Pant = aims, Nakara = blend) follow the markers and are
defensible, but 801, 808 and 820 all test the same placement, and 808 statement 1 ("Pant case described Indian socialism as a
blend") would look true to anyone reading the quote as one passage. Keep one item on this attribution (820 or 801) and
convert 808 to another idea.

**M3 - Near-duplicates of lk05.json items.** 811 is the same four facts as lk05 209 (that item had one flipped; 811 makes all four true).
1210 repeats lk05 615 (Berubari / Kesavananda / LIC holdings, now as a "which" with the 1976 amendment). Replace with untested
angles (Pande source, Hidayatullah's Declaration-of-Independence contrast, Article 143 reference).

**M4 - Repetition still above two per idea.** Counts by stem/options: 5.7 Pakistan-to-1956 in five items (702 is fixed, but 704, 708,
715, 718, 720 remain); 5.8 Avadi 1955 in eleven items and Nakara/1982 in seven; 5.9 Gokhale in nine and Gajendragadkar in seven
(901, 904, 907, 913, 917, 920 plus 911, 914, 916); 5.11 horoscope/Munshi in five, Drafting Committee in five, "key" swaps in four; 5.12
Berubari "not a part" and 1976 "held valid" in four or five each. Cut about eight of these into new angles.

**M5 - Statement-level reuse of lk05.json.** Several statements are verbatim facts with the same truth value as the first half
(for example 811 s1-s4, 1012 s1, 1217 s1-s2, 1213 s3). A student sitting both packs sees the same sentence twice. Re-angle.

**M6 - Weak or reading-order statements (914 s1, 806 s3, 1011).** 914 s1 "the classification is followed by a citation of G.S. Pande" is
true only as a layout fact (fn 9 tail) and tests nothing about polity; a student cannot know it from understanding. 806 s3
("provides for the nationalisation of all the principal means of production") is keyed false because the text says "social
ownership or control", but "social ownership" is close to nationalisation, and a sharp reader may hesitate; use "private ownership
of all principal means of production" or similar. 1011 s2/s3 ("only universal adult franchise", "only two manifestations") are
still absolutist swaps that fall without knowledge; vary with a date or body swap. (The old 709, 716, 808, 809, 910, 1213 are improved
but 910 s1 and 809 s4 remain flag-shaped.)

## LOW
- L1 "which" key mode is "1 and 3 only" 15 of 54 (28%); next is "2 and 3 only" 7. Rebalance a few.
- L2 "How many" keys: Only two 6, Only one 5, None 3, All three 2, Only three 2. Fine.
- L3 Format mix: direct 30 (25%), which 54 (45%), how-many 18 (15%), Statement-I/II 12 (10%), match 6 (5%). Close to the 2020-26
  column (direct 26, which 48, how-many 12, S-I/II 6). Statement-I/II is a little heavy for a polity chapter; no case-study items (3% in the trend).
- L4 1004 distractor "Sovereign Dominion" and 1202 option 3 ("None; the Court has never decided") are weak but not misleading.
- L5 Nothing here changes after the exam year: the Preamble has been amended once (1976); court and chapter facts are stable.

## Checks asked for
- Second defensible answers: 1211 (stmt 3) and 1111 (stmt 2) only; 719 and 1018 relation calls are borderline (M1).
- Statement numbers in explanations match the keys and options in all 72 multi-statement items (script-verified).
- Overlap with packs/lk05.json: two near-duplicates (811, 1210), many reused statements (M3, M5).
- Facts outside the chapter that clash: Iyer on the Drafting Committee (1111); nothing else found.
