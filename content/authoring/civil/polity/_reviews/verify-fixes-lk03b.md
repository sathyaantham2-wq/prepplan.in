# Verification of fixes - lk03b.json (Laxmikanth ch03)

Method: file re-read fresh from disk (mtime 12:37:50 IST) after the coordinator's corruption warning. All 52 changed items answered cold from ch03.txt (pdf pp.56-61 incl. footnotes) before reading keys. Script over all 120: key = o[0] (OK), 3 w each (OK), 4 distinct options (OK), 120 unique ids, statement numbering sequential, no duplicated statements, truth set from `e` equals key for every which/howmany item, no other option equals the truth set, and every w for a wrong set option names the right included/omitted statement (0 mismatches). The fresh dump of the changed items is byte-identical to the one I reviewed first: no double-patch or corruption found in 802-820, 703, 804, 1210, 1218.

## HIGH
None.

## MEDIUM
None.

## LOW
- L1. 803: the w for "function 7" says it "comes two places after the rights and duties of citizens"; function 7 is three places after function 4 (4 -> 7). Fix to "three places".
- L2. 808 S3 ("presented as the minimum that a document must contain") is false by the page's silence plus the word "can"; page says "comprehensive". Defensible (comprehensive contradicts minimum) but the nearest Falsifier-style item. Consider replacing with a plain wrong fact.
- L3. 815 S2/S3 (annual budget, control over armed forces) are false because the closed list of eight omits them; "establish and regulate political institutions" could be stretched to the armed forces by a loose reader. Acceptable; explanation already points to Henkin's element 6.
- L4. 812 and 814 tag pg [56,57]/[56,...] but S1 relies on pp.57-58 ordering; harmless.
- L5. 1204 and 1218 keys fine; 1218 stays as flagged earlier (II is the premise to the page's "Therefore").

## Falsifier checks
- 703: key "Rules of the state" is on p.56 verbatim; the key is now true text, distractors (statute of legislature, code of the executive, digest of ordinary laws) are not descriptions anyone uses. Fixed.
- 1210: footnotes verified on p.61: fn12 Friedrich = Constitutional Government and Democracy; fn13 Roucek = Introduction to Political Science; fn14 Wheare = Modern Constitutions; fn15 Ybema = Constitutionalism and Civil Liberties. Key 1,3,4 correct, S2 false by a stated fact. Works.
- 1218: page says "Unlimited power jeopardise freedom ... absolute power corrupts absolutely. Therefore, a constitution should be permeated with constitutionalism." The "Therefore" supports II explains I. Single answer; w aligned.
- Also checked footnote claims 704, 709, 811 (fn5 IDEA, 2017, Second Edition; Duke is fn16) and 1113 (fn6 Bryce): correct on p.60.

## Other item results
All changed items 706-719, 802, 804-807, 809-814, 816, 818-820, 901-917, 1002, 1007, 1020 (UK unwritten+unitary, Canada written+federal, France written+unitary; item 1 unmatched, now stated in e), 1101-1119, 1202, 1206, 1212, 1216 give one defensible answer matching the key; w-notes follow the option order after reshape (checked by script and by hand for match items 820, 1020 and the AR items).

## Idea cap
LK-3.8 still reuses a few of the eight functions 3-4 times (boundaries, religious identity, identity and values, power-sharing); judged acceptable given only eight functions exist. LK-3.7 still leans on the four definitions, same reason. No concept exceeds ~4 uses of one fact outside this.

## Format mix
Every concept: 5 mcq, 9 which, 3 how-many, 2 Statement-I/II, 1 match = 75% statement-based formats, consistent with the 2020-26 trend column; identical counts per concept remain a mild uniformity point (not a defect).

## Near-duplicates of lk03.json
Stem similarity > 0.7 only for 702 (lk03 105), 703 (502), 1001 (304), 1003 (502), 1005 (402), 1105 (304); each has a different key or angle, so not duplicates. No tagged PYQ restated.

Verdict: pass (0 HIGH, 0 MEDIUM, 5 LOW).
