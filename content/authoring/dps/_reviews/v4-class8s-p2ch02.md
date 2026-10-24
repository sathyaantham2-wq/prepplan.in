# Review v4 (spot-check): Class 8 Social Science, Part II ch2 "India's Long Road to Independence" (SST8, hees202)

Pack: content/authoring/dps/class8s/p2ch02.json (184 questions, 9 concepts C8S-2.1..2.9). Pre-edit copy: scratchpad/fix-class8s-p2ch02/orig-v3.json. Diffed by index: 57 items changed; all 57 read and answered before the key, every fact opened on pages 002-050 of content/extracted/hees202/pages. Unchanged items were not re-read except where the task named them. Indices are 0-based within the concept.
Machine checks (python, all 184): `a` equals o[0] on every option item; no duplicate options; no option named by position; every step list sums to its marks; no NOT/EXCEPT stems.

## Counts
HIGH 1, MEDIUM 9, LOW 7.
Verdict: NOT load-ready, but only because of one local HIGH (2.1/6). All four v3 HIGHs are resolved, all nine numeric fill_blanks are sound, and the fix pass introduced no stem-only or two-answer item other than 2.1/6(d).

## v3 HIGH status
| v3 item | Status |
|---|---|
| 2.2/14(d) | Resolved. Now asks "how many years before 1905 was the poem composed, and in which year did the novel appear". Pages: composed 1875, novel 1882 (p 42). Unique: 30; 1882. |
| 2.4/0 | Resolved. (a) "literal meaning 'of one's own country'" is stated once, for Swadeshi (p 48). (b) "went further, targeting government schools, colleges and courts" is Boycott only (p 48). One answer each. |
| 2.5/14 | Resolved. Now "Aurobindo held two roles in 1906": took charge of the Bande Mataram daily (p 49) and first principal of the Bengal National College (pp 50-51). Two and only two roles are on the pages for 1906. Note it is still a one-line lookup (M5). |
| 2.7/8 | Resolved. No numbers in the stem; the key "Indian estimate over 1,000, official count nearly 400" matches p 65; the distractor "official over 1,200" is a real confusion (1,200 is the official wounded figure). One answer. |

## Fill-blank audit (the priority check)
All nine: each has one natural numeric answer, a stated unit, at least one input not in the stem, and no off-by-one trap.
| Item | Key | Inputs and page check |
|---|---|---|
| 2.1/16 | 20 | 1878 in stem; 1858 from the chapter (timeline p 36, p 38). 20. |
| 2.2/1 | 7 | 1882 in stem; 1875 on p 42 ("composed earlier, in 1875"). 7. |
| 2.3/6 | 25 | Kuka attacks 1872 (p 45); Chapekar shooting is "the following year" after the plague of 1896 (p 46), so 1897. 25. See L1: 1897 is derived, not printed. |
| 2.4/12 | 4 | Tagore, Banerjee, Pal, Dutt (p 47). 4. See M7: a count of names in a "such as" list, and 2.4/15(b) names the four in its own stem. |
| 2.5/6 | 12 | Calcutta "December 1906" (p 51), Surat "December 1907" (p 52). 12. |
| 2.6/7 | 1 | Khudiram "just 18", Kanhere "just 18", Kartar Singh "age of 19" (pp 54, 57, 58). 19 minus 18 = 1. |
| 2.7/0 | 4 | Tilak's death August 1920 in stem; Nagpur "December the same year" (p 62). 4 months. |
| 2.8/18 | 2 | Sultanate 1922, Caliphate 1924 (p 65). 2. |
| 2.9/5 | 5 | Quit India August 1942 (p 75), independence 15 August 1947 (p 79). 5. |
Notes: none is "about" or a range; none has an inclusive/exclusive ambiguity because each pair is a same-month or whole-year pair. Machine-match risk only: confirm the matcher accepts "twenty"/"20", "1 year", "4 months" typed with a unit (L2). None is both-inputs-in-stem. Two of the nine are still plain lookups plus a subtraction (2.8/18, 2.9/5); acceptable as Apply 1-mark items.

## HIGH

H1 C8S-2.1 / 6 (case study, part d) "Anil says: 'It changed the language of rule but not the control or the exploitation.' Bela says: 'It changed the control but left the language unchanged.' ... (d) Decide which student's summary the chapter supports, and say which of your answers (a) to (c) settles it."
Each student has one true half and one false half. The chapter (p 39) says the Crown took direct control (so Bela's "changed the control" is right and Anil's "not the control" is wrong) and the proclamation made new promises (so Anil's "changed the language" is right and Bela's "left the language unchanged" is wrong). The key itself concedes this ("the new offices changed who ruled in name") while naming Anil, which contradicts Anil's own words. Part (c) (a continuing hardship) bears on exploitation, which Bela never mentions, so no part settles the pair. That is a tie on the deciding words, not a data-settled choice; a second defensible answer.
Fix: make only one statement wrong on the point the parts settle. Anil: "The promises of 1858 were fine words, but the hardships continued." Bela: "After 1858 Indians were treated as equals, as promised." Key: Anil; parts (b) and (c) settle it.

## MEDIUM

M1 C8S-2.3 / 2 (5 marks) "Put them in the order the chapter gives them". The pages give them in a different order (Congress p 44, Kukas p 45, Poona p 46, Birsa p 47) from the date order the key uses (Kuka 1872, Congress 1885, Poona 1897, Ulgulaan 1899-1900). The listed events are indeed datable (1897 only by the "following year" after 1896), so the item is answerable, but the stem should say "in the order they happened". Fix: reword; step 1 then has one answer.

M2 C8S-2.8 / 8 (true_false, now True) "The Khilafat Movement ended because the Turkish sultanate and then the Caliphate were abolished, not because of any decision of the Congress." The book says only that it "died a natural death when Mustafa Kemal abolished the Turkish sultanate in 1922 and the Caliphate itself in 1924" (p 65). "Not because of any decision of the Congress" is an inference the book does not state (the same page names Gandhi calling off non-cooperation in 1922). A student can dispute the negation. It also repeats 2.8/18 (the same 1922/1924 fact, M8) and the misconception it refutes is weak. Fix: "The Khilafat Movement died a natural death when ...: True or False, and give the two years", or replace the clause with the book's own wording; keep one of 2.8/8 and 2.8/18.

M3 C8S-2.4 / 9 (case study) stem "the chapter names three self-reliant enterprises of the late 19th century". Bengal Chemicals was founded in 1901 (p 48), so the stem misdates one enterprise by the standard it sets; part (a) then asks the order, which the stem already lists in the same order. Fix: "three self-reliant enterprises, the first in 1886" (do not call all three 19th century) and ask "which was founded last, and in which year".

M4 C8S-2.6 / 19 (case study, part d) The key says "the arms never reached them". The book says the weapons were "due to come by ship" and "supposed to land" (p 59); it never says they failed to arrive. The same page says such attacks "rattled the colonial government", which is Ravi's premise. The part is settled by "what happened to Jatin and to those captured alive" (died, hanged), but the key's own reason is not on the page. Fix: key (d) "Sheela's: Jatin died the next day and those captured alive were soon hanged; the page says only that such attacks rattled the government but hardened its resolve." Drop "arms never reached them".

M5 C8S-2.7 / 5 (case study, part d) "How many years separated that struggle from the movement in (a), taking 1918 and 1928 as the years?" Both years are given in the stem: pure stem arithmetic, and a last part that is not a decision (the v3 M6 defect, partly left). Parts (a)-(c) are one-line lookups. Fix: (d) "Which of the three 1918 struggles does the chapter link, by its cause, to Bardoli, and what title did that later win Patel?" or any choice that needs the book. Also (c) says Kheda "also concerned excessive land revenue"; the book gives Bardoli as "for peasant rights" only; say "which concerned excessive land revenue".

M6 C8S-2.9 / 15 (case study, part d) The stem itself says "virtually the entire Congress leadership was arrested within days", so Gopal's reading (leaders directed it from the front) is refuted by the stem; (d) needs no chapter. Parts (a) to (c) are one-line lookups. Fix: drop the arrest from the stem and let part (c) or the book supply it, or ask which of two sources of strength the chapter credits for the scale of protest (it names workers, students, ordinary people and Lohia and Narayan underground).

M7 C8S-2.4 / 12 (fill_blank) "The chapter names ___ leaders, among them Tagore and Surendranath Banerjee". The book's list is "such as" four names (p 47); "such as" is not exhaustive, and the stem's "among them" invites more. Answer 4 is the natural one but not forced. The four names also appear in the stem of 2.4/15(b), so a student who has met that item can read the answer off. It is a name count, not a computed value. Fix: ask a computed value (for example the number of years from the founding of Swadeshi Mills to the partition) or "the partition followed the Calcutta ___ year", or at least say "the four leaders named".

M8 Repeated ideas (counts, 3+ per concept):
2.1 who governed (Secretary of State in London, Viceroy in India) in 6(a), 8(a) identical wording; plus unchanged items.
2.2 the poem's 1875 / 1882 dates in 1, 14(d), 18(d).
2.7 Kheda in 5(c) and 7(a); Bardoli in 5(a).
2.8 sultanate 1922 and Caliphate 1924 in 8 and 18 (identical fact).
2.6 Rash Behari Bose to Japan and the INA in 15 and 19(c).
2.9 Bose's journey in 3 and 9.
Fix: replace one of each pair.

M9 Easy-in-disguise (no change to the v3 M9 picture). Of the 57 changed items about 30 are still one-line page lookups whatever the label: 2.1/3, 2.1/20, 2.2/0, 2.2/4, 2.4/0, 2.4/4, 2.5/14, 2.6/8, 2.6/11, 2.6/15, 2.7/4, 2.7/7, 2.7/8, 2.7/9, 2.7/19, 2.8/2, 2.8/13, 2.8/19, 2.9/0, 2.9/9, 2.9/17, plus the nine fill_blanks (a lookup plus a subtraction). Their misconception frames ("A student says ...", 24 stems) are good. The two 5-mark items 2.3/2 and 2.9/3 are both "recite the sequence the stem lists" (2.9/3's stem outlines the five points the answer must make). The bank allows no easy items; decide with the owner whether this residue is acceptable.

## LOW

L1 2.3/6 and 2.3/2: the book never prints "1897" for the Chapekar shooting; it says "the following year" after the 1896 plague (p 46). Key is right by one inference. Cite "1896 plus one" in the explanation.
L2 All fill_blanks: confirm the matcher normalises "twenty", "20 years", "4 months", "1 year". Single string `a` with no alternates.
L3 2.1/8 (b) and (c) overlap: (c)'s key list contains "heavy land taxes and famines", the answer to (b). Remove that option from (c).
L4 2.4/19 key repeats a sentence ("The move was widely opposed and it produced a sharpened division..." twice). Delete one.
L5 2.5/11 (b) "who took charge of it?" reads as the programme; the book says Aurobindo took charge of the daily. Say "of the daily". (c) repeats the answer to (b) (National Education), so one part is free.
L6 2.6/4 assertion-reason: R now says the jail "was designed to break the spirit"; the book says it was "designed specifically for solitary confinement and used to break the spirit" (p 58). Reword R to "designed for solitary confinement and used to break the spirit".
L7 2.7/9 (b) "what had that man done in 1919?" The book gives O'Dwyer's conduct "during his tenure" and defending Dyer's action, not as a 1919 act. Say "what had he done as lieutenant governor".

## Verified against the pages (changed items)
1858 Crown rule and the "Secretary of State in London, Viceroy in India" and the promise (pp 38-39); Arms Act and Vernacular Press Act 1878; the unequal-treatment list (pay, juries, clubs and trains) p 40; Bankim sub-magistrate in the 1860s, Anandamath 1882, poem 1875, Tagore 1896 Calcutta session (pp 41-42); Hume resigned 1882 and "worked to bring together a group of like-minded Indians", Congress 1885, Bonnerjee first president, 72 delegates (p 44); Kuka 1872, Chapekar following the 1896 plague, Lokmanya, The Gita Rahasya (pp 45-46); Swadeshi ("of one's own country") and boycott, Boycott went further to schools, colleges and courts, Swadeshi Mills 1886, PNB 1895 (Lajpat Rai), Bengal Chemicals 1901 (Ray), the partition results and "perhaps attracted by" (pp 47-48); Bande Mataram daily 1906 with Aurobindo, National Education, Bengal National College, Calcutta December 1906, Swaraj undefined (pp 49-51); Muslim League December 1906 at Dhaka, Syed Ahmad Khan's 1886 Conference, Two-Nation Idea, Surat December 1907 (pp 52-53); Khudiram 18, Kanhere 18, Kartar Singh 19, Cellular Jail, German Plot and Balasore 75 minutes, Hardayal and Bhakna, Voice of India and The Bengalee and Yugantar (pp 54-59); Khasi Revolt (Tirot Sing), Maniram Dewan, Rani Gaidinliu (p 55); Lucknow Pact at the 1916 Lucknow session (p 60); 1918 struggles, Bardoli 1928, Sardar, Rowlatt Act, boycott of foreign goods, schools and courts, Tilak's death August 1920 and Nagpur December 1920 (pp 61-62); Jallianwala figures nearly 400 / over 1,200 wounded / over 1,000, O'Dwyer and Udham Singh (p 65); Khilafat 1922 / 1924 (p 65); Comilla 1931, Bina Das nine years (p 67); Gandhi-Irwin Pact and the younger leaders' criticism (p 71); Sarojini Naidu 1925 (p 70); Bose, INA, Cripps Mission, Quit India, Aruna Asaf Ali, famine and 87,000 (pp 73-76); mutinies, decolonisation and the "earlier view" (pp 76, 79). No scope_out line violated.

## Template check (counts)
- True/false (9): True = 2.3/16, 2.5/19, 2.8/8 (3 of 9, 33%), inside 25-75%. The six False items each hinge on a misconception (2.7/6 now correctly the Lucknow-vs-Nagpur pairing, False). 2.8/8 is the weak one (M2).
- Claim-check verdicts (10): No 5, Yes 4, Partly 1. Not skewed. 2.9/11 "only because of Gandhi ..." is an unambiguous No (the book calls it "the earlier view", p 79).
- multi_statement keys (9): "1 and 3 only" x3, "1 and 2 only" x2, "3 only", "2 and 3 only", "2 only", "1 only". Spread acceptable, no all-true item.
- Correct option longest strictly: 11 of 40 mcq (27.5%), tied 1 (30% combined); at chance (25%). No systematic tell. 2.7/19 and 2.9/17 earlier tells are gone or small.
- Slot order: mark sequences differ in every concept; not identical order.
- "A student ..." stem opener 24 of 184 (13%). Repeated ideas listed in M8.
Templated: no.

## Per-concept verdict
- C8S-2.1: HIGH H1 (6d). M8. Fix H1 and it passes.
- C8S-2.2: no HIGH. 14(d), 18 and the fill_blank are sound. M8 (poem dates).
- C8S-2.3: no HIGH. M1 (2 wording), L1.
- C8S-2.4: no HIGH. M3 (9), M7 (12), L4.
- C8S-2.5: no HIGH. L5.
- C8S-2.6: no HIGH. M4 (19d), L6.
- C8S-2.7: no HIGH. M5 (5d), L7.
- C8S-2.8: no HIGH. M2 (8), M8.
- C8S-2.9: no HIGH. M6 (15d).

## Verdict
Not load-ready: one HIGH (2.1/6 d, a tie between two half-true student summaries). It is a two-line rewrite. Fix H1, then M1-M6 are each a one-sentence edit and should go in the same pass; M7-M9 and the LOWs can follow. All v3 HIGHs are resolved and all numeric fill_blanks are safe.
