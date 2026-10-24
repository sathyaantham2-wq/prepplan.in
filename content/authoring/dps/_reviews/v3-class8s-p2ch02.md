# Review v3: Class 8 Social Science, Part II ch2 "India's Long Road to Independence" (SST8, hees202)

Pack: content/authoring/dps/class8s/p2ch02.json (184 questions, 9 concepts C8S-2.1..2.9; Part II, identify by file).
Scope: content/authoring/class8s/p2ch02.json. Book: content/extracted/hees202/pages/001-050 (book pp 35-84), all read again.
Method: every one of the 184 questions read and answered before its key; matched to the pre-edit copy by question text (102 items are new).
Indices are 0-based within the concept (the fixer reordered every concept, so v2 indices no longer apply).
Machine checks (python): `a` equals o[0] on every mcq / multi_statement / assertion_reason / match; no duplicate options; no option named by position; every step list sums to its marks; no "which was NOT" item remains.

## Counts
HIGH 4, MEDIUM 11, LOW 13.
Verdict: NOT load-ready. The four HIGHs are small local edits, but two of them (2.5/14, 2.7/8) are new items the fix pass introduced with exactly the stem-only defect v2 called HIGH.

## v2 status
| v2 finding | Status now |
|---|---|
| H1 2.2/0 subtract 1875-1828 | Resolved (now 2.2/1 Shuddhi). See M1: it is a page name. |
| H2 2.3/3 Kukas 13 years | Resolved (2.3/6 "Kukas"). Same M1 caveat. |
| H3 2.5/6 Calcutta-Surat months | Fill-blank resolved (2.5/6 "Dhaka"), BUT the same stem-only content came back as a new short_answer, 2.5/14. See H3. |
| H4 2.7/1 165 rounds/min | Resolved (2.7/0 "Bardoli"), BUT 2.7/8 is a new stem-only ratio. See H4. |
| H5 2.8/1 14 months | Resolved (2.8/18 "Swaraj"). |
| H6 2.9/6 five weeks = 35 days | Resolved (2.9/5 "Radcliffe"). |
| 2.1/1, 2.4/2 date subtraction | Now 2.1/16 (answer 20) and 2.4/12 (answer 19). Each needs one chapter year not in the stem (1858; 1905) and has one numeric answer. Acceptable. |
| 2.6/6 "Black" | Now 2.6/7. One natural answer ("Black"). Acceptable. |
| H7 2.5/9 (three plus fourth programme) | Resolved. Now 2.5/15: "the two programmes the daily already supported and the one it added"; key Swadeshi, boycott, National Education; counter "denationalising effects of English education". Matches p 50 exactly. |
| H8 2.6/0(c) "killed" | Resolved. Now 2.6/16(c) says "harmed" and quotes "fell victim" (p 54: "two British ladies who fell victim to the blast") and "umbrella bearer was killed" (p 57: "while an umbrella bearer was killed"). Both phrasings are verbatim. Count recomputed: Row 1 and Row 4 only, so 2. One answer. |
| 2.4/19 (1911 mark) | Resolved. Now 2.4/19 "Show that the partition ... cannot be described as simply ... efficient"; no 1911 step. |
| "Which was NOT" items | All gone (searched). The one hit in 2.4/5 is the book's phrase "not part of the colonial calculations". |
| True/false 3 True, 6 False | Verified: True = 2.3/16, 2.5/19, 2.7/6; the other six are False. 33% True, inside 25-75%. But 2.7/6 is plain recall (M7). |
| Claim-checks 2 partly, 4 No, 4 Yes | Verified: Partly 2.1/5, 2.9/11; No 2.2/2, 2.2/8, 2.6/17, 2.8/15; Yes 2.3/0, 2.4/14, 2.5/13, 2.7/14. See M8 on 2.9/11. |
| Option length | Counted over 40 mcq: correct option strictly longest 6, tied longest 2 (total 8); strictly shortest 6, tied shortest 2 (total 8). Below the 25% chance rate, no systematic tell. The author's 9 / 7 is close. Two single items are clear tells (L1). |
| Case studies that compute | Not only 2.9/8. Recomputed all: 2.9/8 87,000/2,500,000 = 3.48% and 34.8 per 1,000 correct; 2.4/9 (19, 10, 4) correct; 2.6/15 (18+18+19)/3 = 18.33 correct; 2.6/16(d) 1912-1908 = 4; 2.6/19(c) 3:50 pm + 75 min = 5:05 pm; 2.7/5(c) 10; 2.7/8 1000/400 = 2.5 and 1650/400 = 4.1; 2.2/14 (c) 30 and 9, (d) 30; 2.3/2 13. All correct. The figures 94,000, 350, 0.5357% and 18.33-as-a-tie named in the task do not occur in this pack (the 94,000 item was removed); no tie anywhere. |

## HIGH

H1 C8S-2.2 / 14 (case study, part d) "Test the second caption: how many years before 1905 was the poem composed, and what was it written for?" Key: "1905 minus 1875 is 30 years: it was composed in 1875 and published within the novel Anandamath in 1882 ... caption wrong"; step mark: "30 years earlier, in 1875, for the novel".
The book (p 42) says only that the poem "was composed earlier, in 1875", before the novel (published 1882), and that in the novel sannyasis recite it. It never says what the poem was written for, and "written for the novel" contradicts "composed earlier" than the novel. The stem asks a question the book does not answer, and the rubric invents the answer.
Fix: ask "how many years before 1905 was it composed, and in which year did the novel containing it appear?" (30; 1882), and make the step "30 years earlier, in 1875; the novel came in 1882; so the caption is wrong".

H2 C8S-2.4 / 0 (short_answer, 2) "(a) Which of the two, Swadeshi or boycott, urged people to promote Indian-made products?" Key: Swadeshi.
Book p 48: "two programmes ... Swadeshi and boycott. These two movements encouraged people to boycott foreign-made goods and promote Indian-made products." So both did; "Both" is equally correct and is what the book says. The key's hedge "(together with boycott of foreign-made goods)" shows the problem. Second defensible answer.
Fix: (a) "Which of the two has the meaning 'of one's own country'?" (Swadeshi), or "Which of the two went on to target government schools, colleges and courts?" and drop (b) or ask what the second added.

H3 C8S-2.5 / 14 (short_answer, 2) "Three events ... the Calcutta Congress session (December 1906), the founding of the Muslim League (December 1906) and the Surat session (December 1907). (a) Which two happened in the same month? (b) How many months passed from them to Surat?"
Every fact is in the stem; no chapter knowledge is needed. This is exactly v2 H3, re-created as a new item by the fix pass.
Fix: delete the dates from the stem and ask for the two sessions' places and the months, or replace with an item that needs a chapter fact (for example, "Which of the three events did the British pressure on the Moderates lead to, and which came first after the Calcutta session?").

H4 C8S-2.7 / 8 (mcq) "A student takes the Indian estimate of the Jallianwala Bagh dead as 1,000 and the official British count as 400. The Indian estimate is how many times the official count?" Key 2.5 times.
Both numbers are in the stem; a pure ratio. No chapter needed (same defect as v2 H4). The book also says "nearly 400" and "over 1,000", so "exactly 2.5" is slightly false to the source.
Fix: drop the numbers from the stem and ask which pair of figures the chapter gives, or ask what the gap between the two counts shows (the Indian estimate is well above the official count), with the ratio left out.

## MEDIUM

M1 Fill-blanks (all nine) 2.1/16, 2.2/1, 2.3/6, 2.4/12, 2.5/6, 2.6/7, 2.7/0, 2.8/18, 2.9/5.
Meets the brief's tests (each needs a chapter term the stem does not give; each has one natural answer). But docs/QUESTION_STANDARD.md section 9 says fill_blank "must be application-level: a computed value, a reasoned term, a rule applied, never a name copied from the page." Seven of nine are names or words copied from a page: Shuddhi, Kukas, Dhaka, Black, Bardoli, Swaraj, Radcliffe. Only 2.1/16 and 2.4/12 compute, and they are the same subtract-two-years idea (2.4/12 also repeats 2.4/9(a)).
Variant risk, since the key is a single string `a` with no alternates: Shuddhi (Suddhi, Shuddi); Kukas (a student writing "Kuka" is right in sense); Dhaka (the book itself prints "Dacca" in the Bande Mataram extract on p 49); Swaraj (a student may write "Swaraj Party" into a blank that already says "Party"). Confirm the matcher is case-insensitive and tolerant of a plural or a repeated word, or reword: 2.3/6 "followers ... were called Kukas / Kuka" can be avoided by asking for the movement's second name; 2.8/18 "... created a party called the ___ Party" can be made "created the party named after the goal ___".
Fix: replace at least four with a short computed or reasoned blank (for example the number of years between two chapter dates, a count the book gives, "the ___ Line is named after its drafter" is fine only if the standard is relaxed).

M2 C8S-2.7 / 7 (short_answer) "(a) Which of the three involved farmers who were ruthlessly exploited, and in which state?" Key: indigo farmers, Bihar.
Kheda peasants (p 61: "impoverished peasants in Kheda (Gujarat), from whom British officials demanded excessive land revenue") are also farmers who were exploited. The book's phrase "ruthlessly exploited" is used only for indigo farmers, which the stem borrows but does not name as a quotation. A student answering Kheda has a defensible reading. Fix: "Which of the three involved indigo-growing farmers, and in which state?" is too easy; better "Which of the three was in Gujarat and what did officials demand of the peasants?" (Kheda; excessive land revenue) and keep (b).

M3 C8S-2.3 / 3 (case study) Part (c) "Suggest why a critic of colonial policy would still help found a loyal forum." The key ("he believed in reform through dialogue") is the author's inference; the book gives Hume's criticism and his resignation but no reason. Rubric step awards a mark to an unsourced claim ("accept any answer"). Part (d) key cites the Kuka resistance of 1872 as evidence for "by the 1890s". Fix: replace (c) with a chapter fact (what Hume did after resigning: worked to bring together like-minded Indians), and cite 1897 or 1899-1900 in the key for (d).

M4 C8S-2.3 / 2 (long, 5) The stem already lists the four events in chronological order ("the Kuka attacks of 1872, the Congress of 1885, the Poona events of 1897 and the Ulgulaan of 1899-1900") and gives all four dates. Step 1 ("correct order") is free, the 13-year gap is stem arithmetic, and the verdict is foregone. 2 of 5 marks need nothing from the book. Fix: list the events out of order, drop the dates for two of them, or ask which two of the four came before the Congress existed and what each shows.

M5 C8S-2.2 / 0 (short_answer, 2) "What two things did Indian reformers do with European models and social practices, and which two practices did they challenge? Give two practices from the chapter." Garbled and redundant (asks for two practices twice); the book states one action ("took note of European models while challenging ...", p 40), not "two things". Step 1 awards a mark for a phrase, not two things. Fix: "What did the reformers do with European models, and which two social practices did they challenge?"

M6 Case studies: parts that need nothing from the chapter, lookups in a row, or a strawman last part (standard: nothing in (a)-(c) answered in its own stem, last part a real decision).
- 2.1/6 (c) one-line fact; (d) "does the chapter support 'only a little tribal restlessness'?" is a strawman (the stem sets up the officer to be wrong).
- 2.2/18 all four parts are one-line lookups (title meaning, motherland image, who set it to music, the ban); (d) "predict" is the book's sentence.
- 2.4/9 (a) arithmetic from three stem dates; (d) "Swadeshi began with the partition?" is foregone once (a) is done; duplicates 2.4/12 and 2.4/14.
- 2.5/10 and 2.5/11 four lookups each; (d) of each is a strawman (League spoke for the whole community; absolute autonomy equals gradual self-government).
- 2.6/19 (b) and (d) are in the stem (weapons due to land, "surrounded") and (c) is 3:50 pm + 75 minutes, a clock sum with no history; one real part of four.
- 2.7/5 (a) and (d) are the same fact (Bardoli); (b) one line; (c) is subtraction of 1918 from 1928 with 1918 given in the stem.
- 2.7/9 (a) "about 1939" is stem arithmetic ("two decades after ... 1919"); real history is 1940, so "about" hides a mismatch.
- 2.9/8 (a) and (b) are stem arithmetic (2 of 4 marks); (d) strawman.
- 2.9/15 all four parts one-line lookups, and (d) restates the final sentence of the stem's paragraph of the book.
Fix: in each, make (a)-(c) need a chapter fact not in the stem and make (d) a choice with two defensible sides (for example, which of two readings of the Surat split the book supports, as 2.5/16 already does well).

M7 C8S-2.7 / 6 (true_false) "True or False: The Lucknow Pact of 1916 ... was reached at the same session at which Tilak's first task ... was achieved." Key True. A True item is meant to refute a misconception; this restates a sentence of pp 59-60 and asks for the detail. Fix: make it a misconception ("The Lucknow Pact was signed at Nagpur in 1920 with the Khilafat leaders": False) or ask the student to correct a swapped pairing of session and pact.

M8 C8S-2.9 / 11 (claim_check) "Britain left India mainly because of Gandhi's nonviolence and the Congress's policies." Key: Partly right. The book (p 79) says that earlier view "has given way to a recognition that multiple other factors were also at work", so "No, the chapter calls this the earlier view" is equally defensible; the only way to pick "partly" is to read the book as keeping Gandhi in the picture, which it does not state. Same idea is tested again in 2.9/3. Fix: reword the claim so the verdict is unambiguous ("Britain left only because of ...": No) and keep one of the two items.

M9 Easy in disguise. By hand count about 89 of 184 items are a one-line page lookup whatever their label, practically unchanged from v2 (about 90): 
2.1: 0, 3, 4, 9, 11, 12, 15, 17, 19, 20. 2.2: 1, 4, 6, 10, 11, 12, 15, 16. 2.3: 0, 1, 5, 6, 7, 8, 10, 11, 13, 15, 18, 19. 2.4: 0, 2, 3, 7, 10, 12, 14, 16. 2.5: 0, 2, 4, 6, 7, 9, 12, 13, 15, 17. 2.6: 0, 2, 5, 7, 9, 11, 13, 14, 17. 2.7: 0, 2, 3, 4, 7, 10, 14, 16, 19, 20. 2.8: 0, 2, 3, 5, 6, 9, 11, 15, 18, 19, 20. 2.9: 0, 1, 2, 5, 6, 9, 10, 13, 16, 17, 18.
Plus about ten 5-mark "recite a page" items labelled Analyse or Evaluate (2.1/18, 2.3/17, 2.5/8, 2.6/6, 2.7/15, 2.7/18, 2.8/10, 2.8/12, 2.9/3, 2.9/7). The fixer's rewrites mostly added a misconception frame ("A student says ...", 25 stems start "A student") to a lookup. The frame is good; the fact underneath is still one line. All 184 are Hard or Hardest, so the Bloom labels do not tell a user which items are heavier. Fix: for at least 30 of these, ask for a decision, a ranking, a choice between two readings, or a "which fact would change the verdict", as 2.5/16, 2.4/15 (d), 2.2/7 and 2.9/17 already do.

M10 Repeated ideas (standard: one idea tested at most about twice per concept). Counted from the pack:
2.1 Resident / Political Agent in 8b, 12, 13, 14, 18, 20 (6); Secretary of State in London + Viceroy in India in 8a, 9, 15 (3); missionary support in 1, 11, 13, 18 (4).
2.2 Vivekananda in 3, 4, 9, 12, 14, 17, 19, 20 (8); the reform-movement table in 2, 5, 7, 10, 11, 13, 16, 20 (8).
2.3 Kukas in 4, 6, 9, 10, 16, 17 and part of 2 and 3 (8); Birsa in 5, 14, 15, 17; Birsa's opponents in 5(b) and 15(a) are the same fact.
2.4 official motive versus real purpose in 3(b), 4, 13, 19 (4); boycott's targets in 0, 1, 16, 18 (4); Swadeshi predates the partition in 9, 12, 14 (3).
2.5 Muslim League in 6, 9, 10, 12, 14 (5); Surat split in 0, 13, 16, 17 (4).
2.6 Cellular Jail in 4, 6, 7, 11 (4); Ghadar in 0, 8, 9, 12 (4).
2.7 Bardoli in 0, 5, 16 (3); Home Rule versus independence in 2, 3, 17 (3); where satyagraha began in 11, 14, 15 (3).
2.8 Swaraj Party in 1, 9, 18 (3); Khilafat in 2, 5, 8, 10 (4); Dominion to Purna Swaraj in 0, 7, 12 (3).
2.9 Quit India in 14, 15, 17, 18 (4); "Britain did not leave because of Gandhi alone" in 3, 11 (2); war strain in 8, 13, 19 (3).
Fix: merge or replace one in each group above; keep the best.

M11 Wrong options that are still invented absurdities rather than chapter confusions (the fixer said the look-alikes were replaced; many remain), each eliminable without the chapter: 2.4/4 (o3 "ending famine in Bihar ... raising a new tax in Assam and Odisha"); 2.4/8 (o2 "Importing British cloth to resell", o3 "bonfire of his own stock of Indian cloth"); 2.5/18 (o2 "named Dadabhai Naoroji as the future ruler", o3 "Swaraj only for the Muslim-majority provinces"); 2.6/11 (o1 "close to the Viceroy's court", o2 "textile mills of Bombay", o3 "train to join the British Indian Army"); 2.7/4 (o1 swapped cause and effect, o2 "banned Indian-language newspapers ... raised the land tax", o3 "Exports of food caused the Rowlatt Act"); 2.9/0 (o2, o3: "Churchill would personally decide the future of the princely states"); 2.9/9 (o1 to o3 jumbled routes ending "after the Cripps Mission"). Use real confusions: in 2.7/4 the Rowlatt Act versus the 1878 acts; in 2.9/9 the Germany-versus-Japan order; in 2.6/11 the Cellular Jail versus the Mandalay jail where Tilak was held.

(M numbering ends at M11. The v2 items M1, M2, M3, M4, M5, M6, M12, M13, M15, M16, M17 were each addressed or are folded into M6, M9, M10 above.)

## LOW

L1 Option length, two clear tells: 2.7/19 correct option 87 characters against 49, 69, 66; 2.9/17 correct option 127 against 75, 72, 68. Mild: 2.3/11 (103 vs 94-102), 2.6/2 (92 vs 72-85). Shorten the key or lengthen the others.
L2 2.8/19 stem "In 1931 two acts by young women are described." The book dates only the Comilla act (1931); Bina Das's attempt is "a few months later" (history: February 1932). Say "in 1931-32" or "two acts".
L3 2.6/15 stem "Khudiram Bose was 18 when hanged, Anant Kanhere was 18 when hanged": the book says Khudiram was "just 18" when captured (hanged "a few months later") and Kanhere "just 18"; "when hanged" is not in the book. The average 18.33 is arithmetically right, and the item is two-thirds a clock-style sum with no history value. Reword "were 18, 18 and 19".
L4 2.6/9 (b) "Name two Indians who tried to get the army infiltrated": the book says "Rash Behari Bose, Sachindra Nath Sanyal, Kartar Singh Sarabha, among others", and Vishnu Ganesh Pingle is named as a leader in the next sentence. Key lists three; a student writing Pingle is marked wrong. Say "Name two of the three people the chapter names as trying to infiltrate the army".
L5 2.1/7 (b) "Name the two others the chapter gives": the chapter's "for example" list has three examples (pay, juries, public spaces), but the Arms Act and Vernacular Press Act are also unequal-treatment facts nearby; say "the other two examples in the same list".
L6 2.3/13 multi_statement is all three true (key "1, 2 and 3"): no false statement to catch. Make one false (for example Naoroji "was elected as the first president").
L7 2.4/15 Speaker A ("most Muslim leaders were right to defend it") is never used by (a)-(d); remove or ask the student to evaluate it.
L8 2.4/19 key's final sentence is circular ("a purely administrative measure would not have been described by the chapter as dividing the two communities"). Replace with the opposition and the sharpened division.
L9 2.6/4 assertion-reason key "R explains A". The book narrates the conditions and then says the jail "became a symbol", so the link is natural, but "R true, not the explanation" can be argued; add a clause to R so the causal word is in the text (for example "because prisoners ...").
L10 2.6/17 key calls Kesari and Bande Mataram "Nationalist papers"; p 54 only says "We have mentioned Kesari and Bande Mataram" and contrasts them with the "more moderate" papers and "far more radical" Yugantar. Say "the other papers named", or add the p 55 "Nationalist press (Bande Mataram)".
L11 2.9/3 asks for "five factors" and the rubric merges "popular uprisings and revolutionaries" into one mark and "exhaustion and decolonisation" into another; the five-mark split does not match five factors. Re-split the steps.
L12 2.8/13 counterfactual ("Suppose the Pact had guaranteed Purna Swaraj ... what would the Congress still have had to do in return") assumes the other terms stay; accept either "the same conditions" or the statement that the question is hypothetical.
L13 2.8/7(c)/2.9/8 and similar: "the chapter calls ... " premises are correct; no action. 2.2/18 tag "scenario" is on a non-mcq; harmless.

## Facts, names, dates and numbers checked against the pages (changed items included)
All matched pp 38-81: 1858 proclamation (560 princes, no imposition of Christianity, Resident or Political Agent, missionary land concessions); Arms Act and Vernacular Press Act 1878; pay, juries, clubs and trains; reform table (Roy 1828 Calcutta, Dayananda 1875 Bombay, Shuddhi); Bande Mataram 1875 / 1882 / 1896 / 1950 and the 1905 ban on public singing; Vivekananda 1863, 1893, 39 years, Ramakrishna Mission, Tata; Congress 1885 with 72 delegates, Hume 1882, Naoroji, Bonnerjee; Kukas (65 executed, Ram Singh exiled to Burma, Namdhari, kuks); Chapekar 1897; Tilak 18 months and six years in Mandalay, Kesari, Lokmanya; Anushilan Samiti 1902, Abhinav Bharat; Birsa (1899-1900, 24 years); Curzon's partition 1905 and divide and rule; rakhis; Swadeshi Mills 1886, PNB 1895, Bengal Chemicals 1901; Bande Mataram daily 1906 with National Education; Calcutta December 1906 and Surat December 1907; League at Dhaka December 1906; Khudiram 18, Prafulla Chaki, Kingsford; Alipore verdicts; Minto 1909, Nashik 1909, Tirunelveli 1911, Hardinge 1912 with the umbrella bearer; Ghadar 1914-15, Kartar Singh 19; Bagha Jatin 9 September 1915 and 75 minutes; Lucknow Pact and Home Rule 1916; Gandhi's 1915, 1918, Bardoli 1928; Rowlatt Act and the war hardships; Nagpur December 1920; Jallianwala (1,650 rounds, about ten minutes, nearly 400, over 1,200, over 1,000); Khilafat 1919/1920, Jinnah leaves 1920, Chauri Chaura February 1922, Swaraj Party; Simon Commission 1927, Lajpat Rai (lathi charge October 1928, died two weeks later); Kakori, HSRA, Bhagat Singh, Suniti Chowdhury, Shanti Ghosh, Bina Das; Purna Swaraj December 1929, Salt March 380 km; Qissa Khwani Bazaar and Garhwal Rifles; Gandhi-Irwin 1931; Poona Pact; Iqbal 1930; 2.5 million and 87,000; Bose's journey; Cripps 1942; Quit India, Aruna Asaf Ali (nearly four years), Kanaklata Barua (17); 1946 mutinies; Cabinet Mission; Direct Action Day; Radcliffe, five weeks; 1947.
No scope_out line is violated (no Round Table numbering, no Champaran, no Hunter Committee, no Mountbatten Plan, no think-about-it casualty figures, no names from the page-80 list, no 1940 Lahore Resolution; the Constituent Assembly appears only for the 1950 song adoption).
Multi-statement keys: 1 and 3 only (2), 1 and 2 only (2), all three, 3 only, 2 and 3 only, 2 only, 1 only: well spread. Every false statement is plainly false by the book (2.2/15 st 3, 2.4/6 st 1 and 2, 2.5/17 st 1, 2.6/10 st 1 and 3, 2.7/2 st 2 and 3, 2.8/3 st 2, 2.9/6 st 3). Assertion-reason keys: R-not-explanation 3, R-explains 3, A true R false 2, A false R true 1; all arguable-free except L9. True/false: six False items (2.1/11, 2.2/17, 2.4/16, 2.6/12, 2.8/8, 2.9/10) all hinge on a real misconception and are good; 2.3/16 and 2.5/19 True items refute a misconception; 2.7/6 does not (M7).

## Template check
Slot order differs by concept (mark sequences all different; for example 2.2 opens 2,1,3,1,1,3 and 2.7 opens with a fill-blank and a case study), type letters per concept differ, there are no NOT-items, and the verdict mix is as asked. This is not templated. The residue is: two almost-identical fill-blank frames (subtract two years), one stem frame "A student says ..." on 25 items, and 5-mark recitations in every concept (M9).

## Per-concept verdict
- C8S-2.1: no HIGH. M6 (6(d), strawman), M9, M10 (Resident x6, missionary x4). Fix and it passes.
- C8S-2.2: HIGH H1 (14(d)). M5, M9, M10 (Vivekananda x8, table x8).
- C8S-2.3: no HIGH. M3, M4, M9, M10 (Kuka x8).
- C8S-2.4: HIGH H2 (0(a)). M6 (9), M10, M11, L7, L8.
- C8S-2.5: HIGH H3 (14). M6 (10, 11), M10, M11 (18).
- C8S-2.6: no HIGH. M6 (19), M9, M10, M11, L3, L4, L9, L10.
- C8S-2.7: HIGH H4 (8). M2 (7), M6 (5, 9), M7 (6), M10, M11 (4), L1 (19).
- C8S-2.8: no HIGH. M9, M10, M11 none, L2, L12. Closest to ready.
- C8S-2.9: no HIGH. M6 (8, 15), M8 (11), M11 (0, 9), L1 (17), L11.

## Verdict
NOT load-ready. Every v2 HIGH is fixed, and all keys and arithmetic are correct. But the fix pass added four new HIGHs: one unsupported "written for" question (2.2/14 d), one two-answer item (2.4/0 a) and two stem-only items (2.5/14, 2.7/8). Fix H1-H4 (small local edits, about 15 minutes), then address M1, M2, M3, M4, M5, M7, M8 (item-level) before loading. M6, M9, M10 and M11 are bank-quality issues the loader cannot see; they do not make a key wrong but leave about half the chapter as one-line lookups, so decide with the owner whether to load now and rework them later or rework first.
