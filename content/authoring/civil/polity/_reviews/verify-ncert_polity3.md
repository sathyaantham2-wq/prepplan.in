# verify-ncert_polity3 (Mode C conversion of content/authoring/civils/polity3.json)

Chapter I3 "The State, the Government, and You" (source_code gees206, Class 7 Social Science Part 2 ch.6, printed pp.143-168).
New pack: content/authoring/civil/polity/packs/ncert_polity3.json, 7 concepts CVP-3.1 .. CVP-3.7, 20 questions each (140),
same subject, source and chapter block as the old file. Concept metadata kept from the old file, difficulty_base set to 'Hard'.

## Sources used
- Extracted chapter text content/extracted/gees206/pages (printed pp.143-168), cited as 'Class 7 Social Science chapter p.N'.
- Laxmikanth (pdf pages), cited as 'Laxmikanth Ch.N ... p.N': Ch.5 85-88; Ch.6 93-95; Ch.8 131-133, 147-157; Ch.13 206-212;
  Ch.15 222-223, 229; Ch.18 276-280; Ch.21 315-317; Ch.26 414-420; Ch.27 431-434; Ch.29 446-447; Ch.30 452; Ch.39 548-562;
  Ch.40 569-578; Ch.41 587; Ch.44 604-607; Ch.60 693; Ch.62 704-706; Ch.63 709; Ch.64 711; Ch.65 716; Ch.66 722-726;
  Ch.67 729; Ch.75 777-783; Ch.87 849-851.
- The AKS inventory was not needed (every fact came from the two sources above). No fact from memory.

## UNSUPPORTED - owner to decide
None. All seven concepts are supported by the NCERT chapter text, and each also by Laxmikanth for the UPSC-depth angle.
Chapter items with no Laxmikanth counterpart were kept only where the NCERT text itself is the source (Dongria Kondh hills,
RWA rule, Washington 1782, Kautilya's big fish, C.B. Muthamma, Bagepalli RTI, Silent Valley, school-education diagram);
nothing was written on the media's role (summary bullet only) or on the class-discussion and project activities.

## Old questions: wrong or doubtful (positions in the old file, 1-20 per concept)
Wrong key
- CVP-3.4 #9 'Which are all-India services? IAS, IPS and IFS': WRONG. Per Laxmikanth Ch.75 p.777 the all-India services are the
  IAS, IPS and Indian Forest Service (IFoS); the Indian Foreign Service is a Central Group A service (p.779-780). None of the
  old options is correct.
Doubtful (outdated, imprecise or unsupported by the chapter)
- CVP-3.4 #16 'President and governors ... are elected': the Governor is appointed by the President (Laxmikanth Ch.30 p.452) and
  the President is indirectly elected; the chapter's wording is loose. New items state the position exactly.
- CVP-3.1 #19 'criticising a government is not attacking the state' and #20 (pairing with Indian examples): inference, not in the chapter.
- CVP-3.2 #12 (department and function pairing, e.g. 'transport - issues licences'), #19 (how citizens control the police)
  and #20 (road-safety poster): not in the chapter text.
- CVP-3.3 #20 (school council rule) and #15 (partial reading of 'not blindly adopt'): activity based or loosely supported.
- CVP-3.5 #15 'regulator - food safety': the chapter lists food-safety initiatives but does not assign them to a role;
  #17 (media vs NGOs distinction), #19 ('voting or RTI' as the effective action) and #20 (contents of an RTI request): not in the chapter.
- CVP-3.6 #20 (court scene): trivial, no source.
- CVP-3.7 #4 (28 states, 8 union territories): time-sensitive; new items say 'at the time of writing' or 'according to Laxmikanth'.
- Across all 140: 95 per cent are one-line recall items labelled Remember/Easy; the converted set is graded Hard.

## Conversion notes
- Format per concept: 5 direct, 9 which-statements, 3 how-many, 2 Statement-I/II, 1 match; recall items 2-5 per concept (max 8).
- The Falsifier rule was applied: every false statement is false in real law and per the cited page (for instance the swapped
  all-India/Central service lists, Fifth/Sixth versus Seventh/Eighth Schedule, Tamil Nadu/West Bengal tiers, CEC not CJI).
- Time-sensitive facts (Supreme Court strength, CIC terms after the 2019 amendment, state and UT counts) carry
  'according to Laxmikanth' or 'at the time of writing'.
- dup-check.py (threshold 0.7) reports 0 near-duplicates against the 60 other packs after re-angling about 45 statements that
  first overlapped lk packs; check-civil-pack.py reports 0 problems; reshape-options.py and permute-match.py were run last.
- Read-back: the saved file was re-read in full and 25 items re-answered cold from the sources; every truth flag, key and
  explanation recomputed consistently (programmatic check: 140 items, 0 key/explanation mismatches).
- One NCERT wording caution recorded in the new items: the chapter counts governors in the political executive 'mostly with a
  formal role'; Laxmikanth p.452 says they are appointed, not elected. No new item contradicts either source.
