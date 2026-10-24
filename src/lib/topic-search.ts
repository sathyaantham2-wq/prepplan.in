// Smart "What do you want to practise?" search for the student's paper builder.
// Pure and framework-free: the page only renders the suggestions and wires the tap.
//
// Chapter identity is (book, part, chapter_number), never the number alone (CLAUDE.md invariant
// 1), so "chapter 3" can return two chapters of one subject, each carrying its own part.

export interface TopicConcept {
  id: string
  name: string
}

export interface TopicChapter {
  id: string
  name: string
  part: string
  chapterNo: number
  concepts: Array<TopicConcept>
}

export interface TopicSubject {
  id: string
  name: string
  chapters: Array<TopicChapter>
}

export interface TopicSuggestion {
  subjectId: string
  subjectName: string
  chapterId: string
  chapterName: string
  part: string
  chapterNo: number
  // True when the subject has more than one part, so the row must say which part it is in.
  showPart: boolean
  // Set only when the match needed the concept name (the chapter name alone did not match).
  conceptId?: string
  conceptName?: string
}

export const MAX_SUGGESTIONS = 8

/** Lower-case, strip accents, turn punctuation into spaces, collapse spaces. */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function tokenize(input: string): Array<string> {
  const n = normalizeText(input)
  return n === '' ? [] : n.split(' ')
}

/** True when a and b differ by at most one insertion, deletion, substitution or swap. */
export function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true
  if (Math.abs(a.length - b.length) > 1) return false
  if (a.length === b.length) {
    let first = -1
    let diffs = 0
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        if (first === -1) first = i
        diffs++
        if (diffs > 2) return false
      }
    }
    if (diffs === 1) return true
    // One adjacent swap counts as a single typo.
    return (
      diffs === 2 &&
      a[first] === b[first + 1] &&
      a[first + 1] === b[first]
    )
  }
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a]
  let i = 0
  while (i < shorter.length && shorter[i] === longer[i]) i++
  return shorter.slice(i) === longer.slice(i + 1)
}

// Match quality of one query word against one name token. 0 = no match.
const EXACT = 3
const PREFIX = 2
const TYPO = 1

function wordQuality(word: string, token: string): number {
  if (word === token) return EXACT
  if (/^\d+$/.test(word) || /^\d+$/.test(token)) return 0
  if (token.startsWith(word)) return PREFIX
  if (word.length >= 5 && token.length >= 4 && withinOneEdit(word, token))
    return TYPO
  // A typo inside what she has typed so far of a longer word ("fractoin" vs "fractions").
  if (word.length >= 5 && token.length > word.length) {
    if (withinOneEdit(word, token.slice(0, word.length))) return TYPO
  }
  return 0
}

function bestQuality(word: string, tokens: Array<string>): number {
  let best = 0
  for (const t of tokens) {
    const q = wordQuality(word, t)
    if (q > best) best = q
  }
  return best
}

const CHAPTER_WORDS = new Set(['chapter', 'chapters', 'chap', 'ch', 'no', 'number'])

interface ParsedQuery {
  numbers: Array<number>
  words: Array<string>
}

function parseQuery(query: string): ParsedQuery {
  const tokens = tokenize(query)
  const numbers: Array<number> = []
  const rest: Array<string> = []
  for (const t of tokens) {
    if (/^\d+$/.test(t)) numbers.push(Number(t))
    else rest.push(t)
  }
  // "chapter" and friends are filler. "ch" alone could be the start of "chemistry", so it is
  // only filler when a number is present ("ch 3").
  const words = rest.filter((w) => {
    if (w === 'chapter' || w === 'chapters' || w === 'chap') return false
    if (numbers.length > 0 && CHAPTER_WORDS.has(w)) return false
    return true
  })
  return { numbers, words }
}

// Lower tier is better: 0 exact chapter name, 1 chapter-name prefix or chapter number,
// 2 other chapter-name matches, 3 concept matches.
interface Scored {
  tier: number
  quality: number
  order: number
  suggestion: TopicSuggestion
}

/**
 * Up to `limit` suggestions for what she typed. One suggestion per chapter; a chapter that only
 * matched through a concept names that concept.
 */
export function searchTopics(
  subjects: Array<TopicSubject>,
  query: string,
  limit: number = MAX_SUGGESTIONS,
): Array<TopicSuggestion> {
  const { numbers, words } = parseQuery(query)
  if (numbers.length === 0 && words.length === 0) return []
  const joined = words.join(' ')

  const scored: Array<Scored> = []
  let order = 0

  for (const subject of subjects) {
    const subjectTokens = tokenize(subject.name)
    const showPart = new Set(subject.chapters.map((c) => c.part)).size > 1

    for (const chapter of subject.chapters) {
      order++
      if (numbers.length > 0 && !numbers.includes(chapter.chapterNo)) continue

      const chapterNorm = normalizeText(chapter.name)
      const chapterTokens = chapterNorm === '' ? [] : chapterNorm.split(' ')
      const base: TopicSuggestion = {
        subjectId: subject.id,
        subjectName: subject.name,
        chapterId: chapter.id,
        chapterName: chapter.name,
        part: chapter.part,
        chapterNo: chapter.chapterNo,
        showPart,
      }

      // Chapter-level match: every word is in the chapter or subject name.
      let chapterQuality = 0
      let namedWords = 0
      let chapterMatches = true
      for (const w of words) {
        const inName = bestQuality(w, chapterTokens)
        const inSubject = bestQuality(w, subjectTokens)
        const q = Math.max(inName, inSubject)
        if (q === 0) {
          chapterMatches = false
          break
        }
        if (inName > 0) namedWords++
        chapterQuality += q
      }

      if (chapterMatches) {
        let tier: number
        if (words.length > 0 && joined === chapterNorm && numbers.length === 0)
          tier = 0
        else if (
          words.length === 0 ||
          (namedWords > 0 && chapterNorm.startsWith(joined)) ||
          namedWords === 0
        )
          tier = 1 // number-only, subject-only or name-prefix
        else tier = 2
        // A query that is only a number or a subject keeps chapter order, not name quality.
        const quality = words.length === 0 ? 0 : chapterQuality
        scored.push({ tier, quality, order, suggestion: base })
        continue
      }

      // Otherwise try the concepts of this chapter; keep the best one.
      let bestConcept: Scored | null = null
      for (const concept of chapter.concepts) {
        const conceptTokens = tokenize(concept.name)
        let total = 0
        let usedConcept = false
        let ok = true
        for (const w of words) {
          const inConcept = bestQuality(w, conceptTokens)
          const other = Math.max(
            bestQuality(w, chapterTokens),
            bestQuality(w, subjectTokens),
          )
          const q = Math.max(inConcept, other)
          if (q === 0) {
            ok = false
            break
          }
          if (inConcept > 0) usedConcept = true
          total += q
        }
        if (!ok || !usedConcept) continue
        if (!bestConcept || total > bestConcept.quality) {
          bestConcept = {
            tier: 3,
            quality: total,
            order,
            suggestion: {
              ...base,
              conceptId: concept.id,
              conceptName: concept.name,
            },
          }
        }
      }
      if (bestConcept) scored.push(bestConcept)
    }
  }

  scored.sort(
    (a, b) =>
      a.tier - b.tier || b.quality - a.quality || a.order - b.order,
  )
  return scored.slice(0, limit).map((s) => s.suggestion)
}

/** "Fractions · Part II" style label used by the suggestion rows. */
export function suggestionPartLabel(s: TopicSuggestion): string {
  return s.showPart ? `Part ${s.part}` : ''
}
