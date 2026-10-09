# Review v2: class9sc ch10 (Sound Waves: Characteristics and Applications), SCI9, iesc110

First independent review of this file (no earlier class9sc-ch10 review existed). Chapter file not edited.
Source: content/extracted/iesc110/pages (all 24 pages read). No chapter structure/scope file for class9sc was found under content/structure, so scope was judged against the extracted text.

Read: 131 questions in 6 concepts (21, 21, 21, 23, 22, 23). Types: 29 mcq, 3 match, 6 multi_statement, 6 assertion_reason, 6 fill_blank, 51 short_answer (2 and 3 mark), 24 long_answer (per concept: 2 five-mark, 2 four-mark case studies). Marks per step sum to m on every item (checked in code).

Verdict: PASS (no HIGH; MEDIUM items are small, fixable in one pass).

## What was recomputed in code or by hand
Every numeric key was recomputed: 10.4 (8 Hz/0.125 s, 6 cm, 500 vs 200 Hz, 1800, match 0.004/2/3/50, 3 Hz and 1/3 s, 250 Hz and 0.01 s, 1.5 and 0.0028 s, 50 Hz/0.02 s/6000/1.5 m/troughs 1.25 and 2.75, 1.2 m/5 Hz/0.2 s, ratios 1.125/1.25/1.5). 10.5 (0.8 m, 2.38 km, 1.864 s, 20 times, 200 Hz/0.005 s, 3.0/0.68/0.204/0.476 s, fence 0.147/0.01/0.137 s, 36.5 m, 30 m gives 0.082 s, 200 m gives 0.548 s, 2040/1360 m, 7.56 m/s, 180 s). 10.6 (136 m, 459 m, match 85/459/17/34.3, 150 m, 0.0023 s, 0.059 s, 102 m, 0.0706 s, 0.2 s, 183.6/612/428.4/229.5/45.9 m). All correct.
All six multi_statement and six assertion_reason keys recomputed against the source text: all correct. The MS false statements are spread (S3, S3, S2, S1+S2, S2+S3, none) and the keys vary. AR outcomes vary across the chapter.
All mcq: stored key text equals one of the options (24 of 24 text/numeric mcq; no duplicate options). No positional option references anywhere.

## HIGH
None.

## MEDIUM
1. match key is not an option (C9SC-10.2#4, 10.4#5, 10.6#5). Stored `a` is a prose explanation, not one of the four pairing strings, so a loader that matches the key by text will find no key. Correct options are the first in each (1-b 2-d 3-a 4-c; 1-a 2-b 3-c 4-d; 1-c 2-d 3-a 4-b). Note: all 40-odd match items in class9sc ch01-09 do the same, so this is a bank-wide convention to confirm with the loader, not a ch10 slip. Fix: set `a` to the exact pairing string if the loader needs it.
2. C9SC-10.5#20 (case study, lightning): "After 90 s there is another flash" is ambiguous. Read as 90 s after the first flash (the key), the storm moves 680 m in 90 s, arrives 180 s after flash 2, margin 30 s, and the 30 s ball uses all of it. Read as 90 s after the first thunder is heard (t = 96 s), speed is 7.08 m/s, arrival 192 s, margin 42 s, and the decision flips to "finish the ball". Fix: say "90 s after the first flash". Also the margin equals the ball time exactly, which makes (d) a rigged tie.
3. C9SC-10.6#22 (case study, sonar): (d) is a strawman. Only the 250 m cable reaches 229.5 m; the 200 m cable plainly misses. "The longer cable is heavier" is an invented cost. Make a real trade-off (e.g. two usable cable lengths, or a shoal reading with margin) or turn (d) into a justified statement.
4. C9SC-10.3#2 (mcq, "which sketch represents a sound wave"): the distractor "particle arrow points opposite to the wave arrow with no motion along it" also has both arrows on one straight line, so it overlaps the key "both arrows lie along the same straight line". The phrase "no motion along it" is contradictory. Reword distractors (e.g. perpendicular, circular, and "particle arrow fixed in the direction of the wave") and key as "particles vibrate to and fro along the line of travel".
5. C9SC-10.2#12 (planet with no atmosphere, rock-fall) and #1 (astronauts, "cannot hear the clank directly"): the chapter itself teaches that solids carry sound (desk activity), so a listener standing on the ground or touching the metal arm gives a defensible "yes, through the solid". State "through the air" or "with no contact with the arm/ground", or make the question about air-borne sound.
6. Repeated ideas. C9SC-10.2: astronauts/space is tested in #1, #4 (item 4), #5 (S3), #8, #15, #18, #20, and the bell jar in #0, #4, #5, #6, #7, #10, #13, #16, #19; the limit is about two per idea. C9SC-10.1: "ripples show the prong vibrates" in #0, #6, #11, #12, #13, #20(b). C9SC-10.6: the 17 m / 0.1 s echo rule in #0, #5, #9, #10, #18, #19, #21. Swap about a third of these for untested ideas in the same concept (e.g. 10.2: gas/liquid/solid propagation in a new setting; 10.1: sonority/Taal, the activity step of changing tension, thick vs thin band pitch).
7. Key-is-longest skew in the 10.3 mcq set (#0, #1, #3, #4 all have the longest option as the key; also 10.2#0, #3, 10.6#4, 10.5#4). Several distractors are visibly absurd ("sound is not a form of energy at all", "grasshoppers use vocal cords which the pins damaged"). Trim the keys and make distractors real chapter confusions (particle travels with wave, transverse, compression vs rarefaction swap).

## LOW
- Easy in disguise (one-line book facts labelled Hard): 10.1#2 and #4, 10.1#3, 10.6#3 (audible-range filter), 10.6#6 (MS with all three statements verbatim from the book), 10.4#14 (3-mark graph description), 10.2#17 and #18 (restate the three activities).
- Textbook-example reskins: 10.6#0 and #19 (Example 10.5 clap in corridor), 10.6#2 (Example 10.6 sonar, 0.60 s vs 0.90 s), 10.5#2 (Example 10.3 thunder), 10.2#6 AR (near copy of the book's Pause and Ponder Q3 in 10.2). Change the context or numbers more.
- 10.3#3: "firecracker 30 m from the sheet makes rice grains jump" is not what Activity 10.6 did (metal plate and beater, near the bowl) and is physically doubtful at 30 m. Use a loud plate or speaker near the bowl.
- 10.1#1: pinning a live grasshopper in a jar is an uncomfortable scenario; use "a cricket whose wings are held still by tape on a dead specimen" or ask it as a thought experiment.
- 10.2#19 (d): "needs air" vs "needs a medium" has one clearly better answer, so it is a correctness check, not a trade-off.
- 10.5#21 (d) and 10.3#19 (d), 10.3#20 (d): padded considerations ("teacher must supervise a larger area", speaker "converts electrical energy"). The decisions are acceptable but the stated costs are thin.
- 10.6#21: stem says side panels arrive 0.03 s after the clap, key says "within 0.05 s". Both true; say "0.03 s, which is under 0.05 s".
- 10.1#17 and 10.2#18 say "for a Class 6 class/students": Class 6 content is out of this chapter's book; harmless but unneeded.
- 10.5#4 and #19 and #11 and #12 test amplitude/energy/intensity four times; fold one into another concept idea.
- Facts beyond this book: none found. Claims on bats, dolphins, elephants, kidney stones, ultrasonography, syaahi-free content, decibels, 0.05 s reverberation and 0.1 s echo gap are all on the pages. Light speed 300000 km/s is given in Example 10.3.

## Counts
HIGH 0, MEDIUM 7, LOW 11 groups. Questions with at least one finding about 40 of 131.
