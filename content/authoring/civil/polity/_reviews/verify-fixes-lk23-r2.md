# Verify fixes round 3: lk23.json (Parliament, 240 questions)

Verdict: FAIL (1 HIGH). HIGH 1 / MEDIUM 4 / LOW 8.

Method: all 240 items re-read against `ch23.txt` and real law (stem, each option, key, explanation, w-notes, cited pages). Mechanical checks scripted (scratchpad `vf23b_mech.py`). `check-civil-pack.py` reports 0 problems.

## HIGH

### 919 (Statement-I/II, president's veto) - Statement-II "only a suspensive veto" is false in real law and contradicts 912 st.4
- Statement-I (a re-passed bill can be returned a second time) is FALSE. Ch23 p.358 and Art. 111: on re-passage the President must assent. Good.
- Statement-II says the President "enjoys only a 'suspensive veto' over an ordinary bill". The sentence is lifted from ch23 p.358 (line 1181), but two sentences earlier the same paragraph says withholding assent "ends" the bill, which is an absolute veto.
- In real law, and in Laxmikanth's President chapter, the President has absolute, suspensive and pocket vetoes over an ordinary bill. "Only" is therefore false.
- The pack itself contradicts this: 912 st.4 (key-true) says withholding assent on first presentation ends the bill, and 903 w-note 2 says "withholding assent is possible at first presentation".
- Answer set: the key "I incorrect, II correct" is the only option with I incorrect, so the key letter is reachable. But a well-read aspirant marks II incorrect, finds no "both incorrect" option, and the key asserts a statement the pack's own 912 refutes.
- This is the same absolute-veto vs 912 tension the earlier FAIL flagged. It was moved into Statement-II rather than removed.
- Fix: reword II to something true and sibling-safe, e.g. "If both Houses pass a returned ordinary bill again, the President must give assent." The key stays I incorrect / II correct. Also soften the 903 explanation "hence the President has only a 'suspensive veto'" to "on re-passage the President's veto is only suspensive".

## MEDIUM

1. 903 and 919 test the same fact (re-passed returned ordinary bill must be assented). 912 st.1/2 touches it too. Three items on one idea; recast 919 to a different angle after fixing the Statement-II wording.
2. 601 and 618 test the same fact (Chairman removable only by removal as Vice-President). 618 Statement-I is 601's key text nearly verbatim. Change 618 to a different Chairman fact.
3. 1105 and 1115 both turn on "salaries of the Prime Minister/ministers are not charged on the Consolidated Fund" (1105 key, 1115 st.4). Change one.
4. Key shape skew. Of 108 "which" items, 76 (70%) have the key "exactly one statement false" (3-statement items with 2 true: 40, 4-statement items with 3 true: 36). All-correct appears 9 times, a single-true key only 5 times, and no all-false key exists. A test-taker can score by finding the one false statement and not knowing the rest. Recast about 8 items: more all-true, 2-of-4, and 1-of-3 keys.

## LOW

1. 1103 vs 1110: policy cut (Re 1) and token cut (Rs 100) appear in both, as key and w-notes in 1103 and as st.1-3 in 1110. Acceptable but close.
2. 1001, 1017 and 1015 st.4 all test "fines/fees do not by themselves make a money bill". Three touches.
3. 1217 st.1 and 1219 st.II repeat "no special law codifies privileges". 1215 and 1218 repeat the four limits on sovereignty.
4. Ideas at 3 or more per concept (all with different angles, so only borderline):
   - 23.1: UP 31/Tripura 1 (106, 111, 119); 530+20 LS (104, 108, 120); Delhi/J&K RS seats (103, 107, 112).
   - 23.2: 84th/87th (205, 207, 209, 219, 220).
   - 23.3: lapse of bills (314, 317, 319).
   - 23.4: double membership (402, 411, 418); sixty-day absence (404, 412, 415).
   - 23.5: Table 23.7 names (505, 507, 515, 520).
   - 23.7: ministers speak but not vote (711, 717, 718); quorum (701, 706, 719); effective majority (702, 713, 720).
   - 23.8: question colours (807, 820) plus 806.
   - 23.9: public vs private bills (901, 906, 907).
   - 23.10: Financial bill (I) (1007, 1012, 1014, 1016, 1020); money-bill 14 days (1002, 1006, 1010, 1016, 1020).
   - 23.11: vote on account (1104, 1111, 1118).
   - 23.12: privilege (1204, 1205, 1214, 1217, 1219).
5. Page refs.
   - 316: the 5y 10m 6d figure is in Table 23.6 (p.384); the explanation cites p.391 for it. The footnote itself is on pp.390-391.
   - 109: the cessation on 25 Jan 2020 is on p.329; `pg` lists 328 and 330 (the explanation says pp.328-330).
6. Skill tags: recall 37 (15%), two_step 185, elimination 18. Many pure-fact items (1102, 201, 1202) are tagged two_step. The trends doc shows 42% pure recall for 2020-26. Retag.
7. 414 and 416 use the book's 2018 pay and pension figures. They are framed "as raised in 2018" and the explanation notes later revisions, so they are fair. Keep the framing. 1202 ("at present" list counts) is the book's figure, and 603 is flagged as the chapter's description.
8. 220 key A-1, B-2, C-4 shares an identity prefix (A-1, B-2). It is not the identity pairing, so it passes, but guessing the order A-1, B-2 gets two thirds right.

## Specifically requested checks

- **309**: key "1 and 3 only" is correct.
  - St.1 is true (Art. 85(1); ch23 p.343 line 631).
  - St.2 is clearly false. The chapter says "should meet at least twice a year" (p.343). "Usually three sessions" is a custom, not the "at least" requirement the statement asserts.
  - St.3 is true. Ch23 p.344 (line 658): "the President can also prorogue the House while in session". Real law: Art. 85(2)(a) puts no bar on prorogation during a session.
  - Pages [343, 344] are correct; w-notes are consistent. No problem.
- **912**: st.4 "withholds assent on the first presentation" matches p.358 and Art. 111. Key 1, 3, 4 is correct. Its consistency with 919 is the HIGH above.
- **Statement-I/II (24 items)**: all re-answered cold. Every key is right except 919's Statement-II wording above.
  - Key distribution: both-correct-and-explains 8, I-incorrect/II-correct 6, I-correct/II-incorrect 5, both-correct-no-explain 5. Balanced.
  - Per concept: 2 each.
  - "Explains" judgements (318/319, 418, 618, 918, 1018, 1118, 1218) are defensible.
- **Match (12 items)**: keys A-3 B-2 C-4 (120, 320, 420, 820), A-1 B-2 C-4 (220), A-3 B-1 C-4 (520, 720), A-4 B-2 C-1 (620), A-3 B-1 C-2 (920), A-2 B-4 C-1 (1020), A-4 B-3 C-1 (1120), A-3 B-4 C-1 (1220).
  - None is the identity pairing.
  - Each key is the first option.
  - Each of the three w-notes ("Mismatches X") names exactly the letters that differ in the corresponding option (scripted).
  - List-II meanings were checked against the chapter, including the extra fourth List-II item.
- **Pay items**: 415 and 417 are how-many items on timeless facts. 414 and 416 are "as raised in 2018" and match p.335 (salary 50,000 to 1,00,000; pension 20,000 to 25,000; additional pension after 5 years).
- **Repetition cuts, w-notes, pg changes** (1106, 1111, 414, 207 st.3, 603 note, 502/601/703/1102 notes): all verified.
  - 1106: Arts 112-114 are on p.364; Art. 117 is on p.361.
  - 1111: p.368-369.
  - 603: Minister of State for Parliamentary Affairs in the Rajya Sabha, p.343.

## Mechanical results (all 240)

- Key equals `o[0]` and is in the options; no duplicate options or ids; every item has 3 w-notes.
- For every multi-statement item, the explanation's list of correct/incorrect statements reproduces the key (108 "which" and 36 "how many"). No mismatches.
- All w-notes in "which" items name an option that exists, in order.
- Format mix: direct 60 (25%), which 108 (45%), how-many 36 (15%), Statement-I/II 24 (10%), match 12 (5%).
  - Trends doc 2020-26: direct 26%, which 48%, how-many 12%, Statement-I/II 6%.
  - Close. How-many and Statement-I/II run a little high; no case study (3%).
- Key shapes ("which"):
  - 3-statement: 2-true 40, 3-true 8, 1-true 5.
  - 4-statement: 3-true 36, 2-true 18, 4-true 1.
  - How-many: 3 of 4 (12), 2 of 3 (13), 3 of 3 (9), 1 of 3 (1), 4 of 4 (1).
- Facts checked against Tables 23.5-23.7 (LS/RS seats, durations, Speakers): all correct.

Items re-answered against the chapter: 240 of 240. The dump I read showed keys alongside stems, so "cold" means each fact was checked against chapter text and real law, not that the key was hidden. I also traced about 30 facts to specific line numbers.
