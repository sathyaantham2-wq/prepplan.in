# Review v2: class9sc ch08 (Journey Inside the Atom, iesc108)

File: content/authoring/dps/class9sc/ch08.json. First independent review (no earlier class9sc-ch08 review in _reviews/).
Source: content/extracted/iesc108/pages (22 pages) plus scope_in / scope_out in content/authoring/class9sc/ch08.json.

Read: 150 questions (7 concepts: 8.1-8.4 have 21 each, 8.5-8.7 have 22 each). Types: 63 short_answer, 33 mcq, 28 long_answer, 7 each of multi_statement / assertion_reason / fill_blank, 5 match.

Method: every numeric key, every multi_statement truth-set, every assertion_reason pair and every match pairing was recomputed from the chapter text before reading the stored key. Result: 0 wrong keys, 0 second defensible answers on mcq / AR / MS / match.
Key-text check: no `key` field exists; the stored key is the first entry of `o` for all 33 mcq, 7 AR, 7 MS and 5 match (the correct answer I derived is always `o[0]`, and all four options are distinct in every item). So the loader's text match cannot fail. No positional option references ("option (ii)", "all of the above") found. Part marks sum to `m` on every short/long answer.
Scope: no violations of scope_out (no quantum model, decay types, binding energy, configurations past Z=18, mole, extra isotope uses, biography, STM/TEM). Z = 19/20/27/53/92 appear only as atomic numbers in isotope/isobar items, as the chapter itself does.

## HIGH
None.

## MEDIUM
1. Difficulty inflation (easy in disguise). Every item is tagged Hard/Hardest, but many are one-step recall or one-line arithmetic: 8.5 Q4, Q7 (13+14), Q8; 8.6 Q7, Q1; 8.3 Q4; 8.7 Q7 (40-18); 8.1 Q6. 8.3 Q20 is tagged Evaluate/Hardest but parts (a)-(c) are copy-the-chapter (15 electrons, protons in nucleus, 10^5) and (d) is a strawman. Suggest retagging these Apply/Medium or adding a second step.
2. Strawman choice parts. 8.3 Q19(d): one option ("the walking shows how a real atom stays stable") is plainly wrong, so "choose one and justify" has a single answer. 8.3 Q20 claim "nucleus as wide as the atom" and 8.1 Q20(d) headline "Dalton discovered the atom" are similarly one-sided. Rebuild the options so both are defensible.
3. Repeated ideas inside one concept.
   - 8.3: "circular path means acceleration, so energy loss and spiral in" appears in AR Q6, Q8, Q12, Q15 (four times). Atom-to-nucleus scale arithmetic appears in Q0, Q7, Q10, Q19(a). Q14 here duplicates 8.2 Q13 (single bounce-back rules out plum pudding).
   - 8.5: A = p + n appears in Q2, Q4, Q7, Q8, Q11, Q17, Q18, Q20, Q21 (nine times).
   - 8.6: Q1 and Q11 are the same item (16 electrons, 2 hydrogen atoms).
   - 8.7: weighted-average arithmetic in Q0, Q6, Q11, Q12, Q17, Q19 (six); "35.5 u is not a real atom" in Q9 and Q19(v).
   Swap at least three of each cluster for a different idea (for example Bohr's shell-letter naming, goitre/isotope uses, why electrons do not fall in: only one question touches these).
4. 8.7 Q20(d) rests on claims the book does not make: that cobalt-60 "does not treat the thyroid specifically" and iodine-131 "does not treat other cancers". The book only lists the uses. Reword the loss as "the book lists cobalt-60 for cancer radiation treatment and iodine-131 for goitre and thyroid cancer" or accept either with the book's use named.

## LOW
1. 8.5 Q17(ii): "mass number 32 with 16 electrons: protons and neutrons" does not say the atom is neutral; an ion has other protons. Add "neutral atom".
2. 8.7 Q1: atom labels N (6 protons) and O (7 protons) collide with the element symbols nitrogen and oxygen and mislead a student who knows N = 7. Use labels W, X, Y, Z.
3. 8.4 Q5 statement 3 / explanation says hydrogen "has no neutron"; the chapter's own isotope section gives deuterium and tritium neutrons. The key is still right (false for "every atom"), but the explanation should say "ordinary hydrogen". 8.4 Q8 already words this correctly.
4. 8.1 Q3 and 8.5 Q1 have a joke distractor each ("same colour", "IUPAC bans S and P"). Replace with plausible misconceptions.
5. 8.4 Q0, Q1, Q17, Q19 use invented shell energies (K=2, L=5...). Internally consistent and acceptable as hypothetical data, but the book gives no values; keep the "model atom" wording.
6. 8.4 Q13 (is a postulate acceptable) and 8.1 Q18 are opinion-based; the rubrics accept either side, which is fine, but mark allocation depends on reasoning only.
7. Multi_statement items use three statements (I, II, III). Check the Science house style; Maths uses two. Not a defect if Science allows three.
8. Concept 8.4 combines Bohr's model with the neutron; fine, but the items are split roughly half-half, so the neutron half repeats the 8.4 Q16 / Q18 puzzle three times.

## Verified correct (spot list of recomputed keys)
8.1: 22 beads; 12; 39; 2+2+3=7; MS 2 and 3; AR both true, no explanation. 8.2: -1 net; +2 alpha; MS 1 and 3; AR A true R false; 0.5%. 8.3: 1.5 mm; 3x10^6; MS 1 only; AR both true R explains; 0.5 mm; 1.2 mm; 5x10^5. 8.4: +7 absorbed; start from L; 14x; MS 2 only; AR A false R true; ratios 1.15 and 1.59; 9, 6, M, no, 15. 8.5: Co,Al,Cl,Ca; 19/39; 15p 16n 15e; MS all three; match 19/23/35/28. 8.6: 2,8,3 val 3; 2 H atoms; 2 and 10 unreactive; 2,7,2 illegal; MS 1 and 2; AR A true R false; 45 MgCl2, 5 Mg left. 8.7: 10.8 u; isobars N and O; MS 3 only; AR both true R explains; 22 neutrons; 24.4, 24.32, 63.6 u; 33/78/8/143 neutrons.

## Verdict
PASS. No HIGH items; MEDIUM items are tagging, repetition and two strawman choice parts, fixable without changing any key. Recommend a light fix pass (MEDIUM 1-4, LOW 1-3) but the chapter is loadable as is.
