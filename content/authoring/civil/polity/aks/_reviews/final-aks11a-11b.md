# Final verification aks11a + aks11b (round 2, fresh pass; appended pack by pack)

Tools run: check-civil-pack.py (aks11a 0 problems, aks11b 0 problems); dup-check.py (see below); aks-coverage.py --chapter 11 (394 facts, 381 covered, 13 skipped, 0 uncovered).

## aks11a progress log
- Items 001-060 answered cold: my answer equals the key on all 60. No second defensible answer except the notes below.
- 036 (candidate oath): key (no "discharge duties" pledge) is right in law and Laxmikanth ch23 p.332; the study notes (ch11.txt l.397-400) say the opposite. Not an error; MEDIUM only if the owner wants notes-consistent items (explanation correctly says so; cited page 334 for the member's oath is p.335 in the text dump).
- 047 stmt 3 ("after 2019 delimitation of both Lok Sabha and Assembly seats in J&K follows the Indian Constitution"): sourced only from the notes (ch11.txt l.449-451); strictly the UT Assembly is delimited under the J&K Reorganisation Act 2019 / Delimitation Act 2002. Key (1,3,4) only works if 3 is true. MEDIUM (loose fact, no better key available).
- 058 (S-II explains S-I): key c "explains". Defensible but d ("does not explain") is arguable too; MEDIUM at most.
- Items 061-090 answered cold: all agree with keys. 075 (rebuilt) verified: exactly 1 correct (stmt 1, quorum, Laxmikanth ch23 l.380); stmts 2-4 false. LOW: 075 pg lists [88] but its explanation cites p.90 for stmt 4 (pg should be [88, 90]).
- Items 091-120 answered cold: all agree with keys. Whole-pack mechanical script (key = o[0] = a, truth set implied by explanation = key numbers or count, 3 w lines, unique ids, 4 distinct options, match rows A-D and 1-4 present, fi ids all exist in inventories ch11a/ch11b, no stem/option names the notes): clean; only 073 has no `fi` (Laxmikanth-only item, pg 338/339), which is acceptable.
- Rebuilt items: 075 OK (see above); 007/017 ratification: 007 key "at least half of the State legislatures" is right (Art 368(2)); 017 fine.
- Skipped facts (aks-coverage.py --chapter 11: 394 facts, 381 covered, 13 skipped, 0 uncovered): the 11 skips in aks11a (A11-027, 048, 062, 117, 118, 142, 143, 150, 156, 161, 195, 543) all have a real reason (notes contradict themselves or Laxmikanth, unsupported case names, time-bound). Legit.

### aks11a findings
HIGH: none.
MEDIUM:
- 047 stmt 3 rests on the notes alone (J&K delimitation "governed entirely by the Indian Constitution"); in law the UT Assembly is delimited under the J&K Reorganisation Act 2019 / Delimitation Act 2002. The same area (A11-027) was skipped as unsupported. Key (1,3,4) needs stmt 3 true. Suggest rewording stmt 3 to the Lok Sabha seats only, or dropping the clause.
- 058 (Statement-II "explains" Statement-I) is a judgement call: one can argue d ("does not explain"). Prefer a pair with an unambiguous causal link or an unrelated true pair.
- Repetition above the cap of 2 per idea per concept: A11-061 (UT Lok Sabha members directly elected, 1965 Act) in 025, 033, 037, 040 (4x, concept 11.2); A11-029 (only three UTs in Rajya Sabha) in 004, 012, 015 (3x); VP-acting-as-President / Deputy Chairman performs Chairman's duties in 085, 088, 093, 098, 100 (concept 11.5, and again 026, 028 in 11.2); Secretary-General appointed by presiding officer in 084, 094, 096 (3x); budget laid before RS, which cannot vote, in 114, 116, 117 (3x).
LOW:
- 036 contradicts the study notes (which say the candidate's oath includes the duty pledge) but the key follows Laxmikanth ch23 p.332 and the Third Schedule, which is right; explanation cites p.334 for the member's oath, text dump shows it on p.335.
- 075 pg [88] but its explanation also cites p.90 (and Laxmikanth p.359): add 90.
- 081, 086 Lok Sabha panel "ten" and "named at the start of a new Lok Sabha" (notes p.90) is slightly looser than LS Rule 9 ("from time to time"), harmless.
- 040/104-type options: no problem found.
Format mix: 30 direct / 54 which / 18 howmany / 12 stmt12 / 6 match (25/45/15/10/5 percent); check-civil-pack 0 problems; dup-check: no near-duplicate over 0.61 of any tagged PYQ (checked items listed by the script are Laxmikanth-pack paraphrases of the same fact, not PYQ duplicates), 011-type cross-pack overlap aks11a-007 vs aks11b-034 is a deliberate true/false pair (verify in b).

VERDICT aks11a: PASS (zero HIGH).

## aks11b progress log
- Mechanical script on aks11b: clean (ids unique, key=o[0], truth sets match, 3 w lines, match rows complete, fi ids valid); only 075, 078, 079, 080 carry no `fi` (to confirm they are Laxmikanth-only).
- Items 001-027 answered cold: all agree with keys (017 verified against Laxmikanth ch23 p.368-369: VoA after general discussion, 2 months/one-sixth, 3-5 months in election year; 021 Union List 98 per Laxmikanth ch23/ch14).
- Items 028-054 answered cold: all agree (036 Only two verified: rejecting a Money Bill is lack of confidence, Laxmikanth ch23 p.372). 038 'II explains I' is a soft causal link (LOW).
- Items 055-080 answered cold: all agree with keys (076 Only three confirmed: Laxmikanth ch23 "Equal status" list items 1 and 3, Rajya Sabha cannot vote on grants, Speaker presides the joint sitting; 075 verified against Laxmikanth ch24: PAC 22 = 15+7, Estimates 30 all Lok Sabha, chairman from Opposition since 1967, Public Undertakings has Rajya Sabha members; 034 true/false mix right: half of States, FR amendment needs no ratification; 079/080 consistent with Laxmikanth ch23 l.1842 and the Rajya Sabha special-powers list).
- Specials re-checked: aks11b-037 (only the Art 169 Council resolution is true -> Only one), 034, 079, 072 (104th Amendment ended Anglo-Indian seats, not the 95th), 026, 033 (simple majority = present and voting, so stmt 2 false), 080, and aks11b-036/038.

### aks11b findings
HIGH: none.
MEDIUM:
- Repetition above the cap of 2 per idea per concept: Ordinance lapses six weeks after reassembly (A11-610) in 023, 028, 038 (3x); Concurrent List 52/47 and Parliament prevails (A11-604) in 022, 026, 035 (3x); "only Parliament initiates an amendment / State Council resolution" (A11-640/641) in 025, 037, 039 (3x) and again in aks11a-008 and aks11a-017; no-confidence only in Lok Sabha (A11-693) in 070, 073 (stmt 4 differs), 076; Rajya Sabha Money Bill 14-day return (A11-692) in 062, 068, 076.
- The statement "Parliament can impeach the President for violation of the Constitution under Article 61" is reused in aks11a-008, aks11a-016 and aks11b-046 (dup-check 0.80): same wording in three items.
LOW:
- 038 and 058/078 Statement-II "explains" calls are soft causal links (defensible; 078 key reasoning is correct per Laxmikanth ch24 p.394).
- 075, 078, 079, 080 carry no `fi` (Laxmikanth-only items; acceptable) and 075/078 use Laxmikanth page numbers (396-399, 394) in `pg`, whereas other items use the notes' pdf pages; 076 pg [101] with a Laxmikanth-only explanation.
- 021 depends on Laxmikanth's count of 98 Union List entries (ch14 and ch23 agree); fine but count-based facts date quickly.
- 003 stmt 1 ("earlier accompanied the Budget") rests on the notes only (ch11.txt l.1441); correct historically.
- aks11b-034 uses "two-thirds" for ratification as a deliberate false statement, which mirrors aks11a-007's true "at least half": a deliberate pair, not a conflict. The only dup-check hits over 0.75 are match-boilerplate lines.
Format mix: 20 direct / 36 which / 12 howmany / 8 stmt12 / 4 match (25/45/15/10/5 percent), inside the 2020-26 column bands; check-civil-pack 0 problems. No option-shape tell (key uniquely longest in 1 of 20 mcq).
Skipped (aks-coverage): only A11-612 in this pack (demonetisation-by-ordinance example is wrong: demonetisation was by notification under the RBI Act; the inventory note explains it) -> legitimate; the skip reason text in the pack is only "verify-conflict" and could be made explicit (LOW).

VERDICT aks11b: PASS (zero HIGH).

## Overall: aks11a PASS, aks11b PASS. Rebuilt items aks11a-075, aks11b-037, aks11b-034, aks11a-017/007, aks11b-079, 072, 026, 033, 080 all have exactly one defensible answer and agree with their keys. Coverage: 394 facts, 381 covered, 13 skipped, 0 uncovered; every skip has a legitimate reason.
