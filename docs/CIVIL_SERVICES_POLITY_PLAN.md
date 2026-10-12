# Civil Services (UPSC Prelims) - Polity: data, trends, agent design

Status: design draft, 2026-10-09. Polity only; History, Geography and Economy get their own agents later.
Scope is the owner's decision; no F-number covers this yet (ask before inventing one).
Existing hook: migration `0067_class_zero_competitive` (competitive exams live under class 0).

## 1. Source data (`content/reference/civil-services/`)

| File | Content |
|---|---|
| `upsc-prelims-indian-polity.pdf` | UnlockIAS, 403 questions 1995-2026, year + topic tag + answer |
| `polity_prelims_questions_...pdf` | 202 questions 2013-2023, answer only, **broader than polity** (schemes, IR, sports) |
| `polity-pyq-merged.json` | the two merged by `scripts/civil-services/parse-polity-pyq.py` (494 items) |

Merge rules: dedupe on year + first 50 characters of the stem; the 91 items found only in list 2 keep
`unlock_topic: null` and must be scope-checked (many are not polity). Never overwrite an answer silently:

- 2 items are **cancelled by UPSC** (2021 Q80, 2023 Q34): `answer: "cancelled"`. Not usable as keyed practice.
- 6 items have **conflicting keys** between the sources (`answer_conflict`): Due Process of Law 2023, writs 2022,
  separation of judiciary 2020, two 2021 statement questions, one 2023 statements question. Resolve against the
  official UPSC key or Laxmikanth; until then they are excluded from practice and from trend counts by answer.
- 2026 contains ethics/public-administration case-study items filed under "Political Theory"; confirm
  whether that is a real format change before counting it as polity.

## 2. Tag schema (one record per question; the owner asked for detail on every question)

```
id            UPSC-POL-2021-014
year, source_q, sources[]
scope         polity | adjacent (governance/IR/schemes) | out
laxmikanth    { chapter, topic }          -- filled once the owner supplies Laxmikanth's contents
articles[]    ["Art 356", "Sch 10"]
concepts[]    ["President's Rule", "anti-defection"]
format        direct | statements_which | statements_count | statement_I_II | match | assertion | case_study
n_statements  0..4
source_type   static_text | judgement | amendment_act | current_affairs | committee_report | convention
skill         recall | two_step | elimination | application
traps[]       ["only", "always/never", "not necessarily", "close numbers"]
answer, answer_status   confirmed | cancelled | disputed
difficulty    1-3 (1 only for trend stats; the bank itself follows the no-easy-items rule below)
```

Rule: `articles`, `concepts` and `laxmikanth` come from the question and the textbook, never from memory of
what the answer "should" involve. Where the textbook was not supplied, the field stays `null`.

## 3. Trend report (computed, not impressions)

Output `docs/CIVIL_SERVICES_POLITY_TRENDS.md` from the tagged JSON: by era (1995-2004, 2005-2012, 2013-2019,
2020-2026) - questions per year, format mix, topic mix, source_type mix, skill mix, average n_statements,
share of current-affairs questions, most repeated articles/concepts, and topics asked once in 10 years vs
every 2 years. First pass (crude tags, 403 items): direct questions fell 81% -> 64%; statement-based rose
from 11% to about 35%; Parliament peaked 2013-19 (24%); Constitutional framework 23% in 2020-26.

## 4. Agents (same pattern as `dps-author` / `dps-reviewer`)

1. `civil-polity-tagger` - tags one batch (about 40 questions) into the schema; read-only on everything else;
   writes `content/authoring/civil/polity/tags/<batch>.json`. Needs the Laxmikanth text for chapter mapping.
2. `civil-polity-author` - writes ONE topic pack: questions in the current UPSC mix (majority multi-statement,
   statement-count and Statement-I/II, few direct), each with article citations, per-option reason why
   wrong, and the textbook page. Source discipline: every fact must trace to the supplied Laxmikanth page
   or an official text; no constitutional facts from memory.
3. `civil-polity-reviewer` - independent: recomputes every key, checks that exactly one option is defensible,
   checks currency of facts (amendments, judgements), flags the "only/always" traps used fairly, and checks
   the format mix against the era 2020-26.
4. The trend report feeds the author's brief: topic weights and format mix come from section 3, not a constant.

Hard rules inherited from the repo: nothing deleted (retire only), board/class are data not code, shortfalls
are reported, no production write without the owner's explicit OK, max 8 agents at once.

## 5. Open items for the owner
- Laxmikanth text (which edition? chapters wanted first).
- Official UPSC keys for the 6 conflicts (or authority to resolve from Laxmikanth).
- Is the 2026 case-study format real? Should "adjacent" questions (governance schemes, IR) be kept?
- Do you want an F-number added to the plan spreadsheet for this section?
