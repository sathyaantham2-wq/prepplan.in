---
name: dps-question-style
description: The standard rule for writing or judging any question in the PrepPlan bank in Delhi Public School (DPS) exam style. Use this skill whenever the user asks to write, rewrite, fix, review or sample DPS-style questions, to "make it like DPS", to author a chapter into content/authoring/dps/, or asks what the question standard is. Read it before spawning dps-author or dps-reviewer agents, and before judging whether an item "reaches the DPS standard".
---

# DPS question style: the standard rule

This is the short working form of `docs/QUESTION_STANDARD.md` (sections 9-11 and the anti-template
rules) and `docs/DPS_AUTHORING_BRIEF.md`. If they disagree with this file, they win, and
`scripts/load-dps-pack.ts --check` is the final word on format.

Reference papers: `content/reference/dps/*.txt` (text of the 36 PDFs in `question papers dps/`).
They teach the *level and shape*. Never copy an item, a number or a story.

## The one test every item must pass

1. **Right slot.** It is a type DPS actually sets, at the marks DPS gives that type.
2. **Right thinking for the slot.** There are no easy questions (owner decision 2026-10-08): no
   `Remember` item, no `Easy` label. Every item, even a 1-mark one, makes the student apply, compare,
   catch a misconception or work something out. The marks climb with the thinking.
3. **Checkable.** Exactly one defensible answer, inside this chapter's IN scope, and the answer
   recomputed in code or read off the extracted textbook page, never from memory.

An item that fails any one is rewritten, not loaded.

## What DPS really sets (observed in the 36 papers)

DPS sets about twelve item types. The real DPS papers do include plain one-line MCQs; **our bank
deliberately does not** (owner decision 2026-10-08). We keep the DPS shapes and raise the floor.

- **MCQ:** in our bank always application-level: a situation, a one-step calculation in context, a
  misconception to catch. Wrong options are the chapter's own slips (face value for place value, a
  misplaced bracket, a look-alike term from the same chapter).
- **Assertion-reason:** A and R both real. In Social Science the R is often true but does not
  explain A. Use all four outcomes over a chapter.
- **Statements ("1, 2, 3 - which is/are correct"):** the false statement hinges on a word, not a
  trick. Spread the false one across 1, 2 and 3.
- **Match the columns:** four to four, options are pairings.
- **Fill in the blank:** 1 mark, `___` in the text, the answer a word or number (at most four
  words) so the app can mark it. Application-level: a computed value, a reasoned term, never a name
  copied from the page.
- **True / False:** 2 marks, tag `true_false`: the verdict, then the reason or the corrected
  statement. The false ones rest on a real chapter misconception, and a chapter's verdicts are mixed (25% to 75% True).
- **Figure-based:** allowed when the figure is described completely in words in the stem; tag
  `figure`. Maps to point at and compass-and-ruler constructions stay out until the app can draw an
  original figure; report them as gaps.
- **2 marks:** define / state two / differentiate; or **(a)+(b)** where (b) uses (a).
- **3 marks:** describe / give reasons / interpret why; or a **claim to test**, a **show it
  cannot be**, a **reverse** ("write a situation for this expression").
- **5 marks:** "Justify", "compare and analyse", a multi-step story with data.
- **Case study (4 marks):** a real setting with data, then parts (a)-(d) that climb; the last part
  is a decision or a justified judgement that uses the earlier answers. DPS often frames them in a
  current or local setting (a bridge, a paper-leak inquiry, a fair).
- **Class 9** adds proof and method items ("prove by contradiction", "without dividing, predict,
  justify by factorising") and history-of-idea hooks (the Ishango bone).

Intensity is *thinking per item* (two parts, a chain, a claim, a pattern to predict, a decision),
not rarer facts or uglier numbers. Numbers are awkward only so the arithmetic is real.

## Per concept (the loader enforces; see the brief for the exact table)

20-24 questions: 3+ scenario MCQ, 1+ three-statement `multi_statement`, 1+ `assertion_reason`, 8+
one-mark items in all, 5+ two-mark (2+ with (a)/(b)), 3+ three-mark (1+ claim_check / show_impossible
/ reverse), 2+ five-mark, 2+ four-mark case studies. Per chapter, each at least one per two concepts:
`match`, `fill_blank`, `true_false`. No `Remember`, no `Easy`, at most 30% `Understand`, at least 30%
Analyse/Evaluate/Create. The loader (`--check`) enforces all of this.

## Rules that stop a bank going bad (each one came from a real review failure)

- **No templated chapter.** Do not give each concept the same slot order with swapped nouns. Vary
  stem frames, settings and the order of ideas concept to concept.
- **Claim-checks are a mix**, about half "No", a quarter "Yes", a quarter "partly right". A
  chapter where every verdict is "No" teaches "claim means disagree"; all "Yes" is the same flaw.
- **Case-study parts need the chapter.** Nothing in (a)-(c) is answered in its own stem; the decision
  is a real trade-off the data supports both ways, not a strawman ("Dev says something absurd").
- **Wrong options are real confusions from this chapter**, similar length, and the correct option
  is not systematically the longest.
- **`multi_statement` keys vary** ("1 only", "2 and 3 only", "all three"), not mostly "1 and 2 only".
- **Do not claim more than THIS book says.** Facts, dates and causes come from the extracted pages.
- **State what the item needs** (a table's values, a scale, a rule). Never "as in the book".
- **Never name an option by position** in an answer or step ("option (b)", "the third option"). The
  loader shuffles options; write what the correct option says.
- **Realistic settings** (no 80-year careers); Indian settings with Rs, lakh, crore, local places.
- **Repetition:** one idea tested at most about twice in a concept.
- **No figures you cannot make.** Maps, constructions and diagrams are tagged and left out unless an
  original figure exists. Report the gap; never fake it.
- **Original artwork and wording only.** No named franchises (see CLAUDE.md).

## Who does what

| Job | Agent | Notes |
|---|---|---|
| Author one chapter, or fix it from a review file | `dps-author` | Writes only its chapter file; never loads, never commits |
| Independent review of one chapter | `dps-reviewer` | Reads every question, recomputes, writes one findings file |
| Load locally, then production, then retire the old grid | the user's explicit go | Production needs an explicit OK; old questions are retired, never deleted |

Run **at most 8 agents at once** (owner instruction 2026-10-08, raised from 5). The author and the reviewer must
be different agents: the person who wrote a key does not check it. After a fix pass, a second
review is what proves it; the fixer's own report is not proof.

## Quick self-check before an item leaves your hands

1. Which DPS slot is this? 2. Is it easy (a fact the book states in one line)? If so, rewrite it.
3. Does the thinking match the marks? 4. Did I recompute it? 5. Is every wrong option a chapter
confusion? 6. Does it repeat another item in this concept or copy a DPS one?
