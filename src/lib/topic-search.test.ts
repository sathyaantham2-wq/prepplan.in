import { describe, expect, it } from 'vitest'
import {
  normalizeText,
  searchTopics,
  suggestionPartLabel,
  withinOneEdit,
} from './topic-search'
import type { TopicSubject } from './topic-search'

const maths: TopicSubject = {
  id: 'maths',
  name: 'Mathematics',
  chapters: [
    { id: 'm1', name: 'Fractions', part: 'I', chapterNo: 1, concepts: [
      { id: 'c1', name: 'Adding fractions' },
      { id: 'c2', name: 'Equivalent fractions' },
    ] },
    { id: 'm3a', name: 'A Peek Beyond the Point', part: 'I', chapterNo: 3, concepts: [
      { id: 'c3', name: 'Decimal place value' },
    ] },
    { id: 'm3b', name: 'Another Peek Beyond the Point', part: 'II', chapterNo: 3, concepts: [] },
    { id: 'm4', name: 'Fractions and Decimals', part: 'II', chapterNo: 4, concepts: [] },
  ],
}

const science: TopicSubject = {
  id: 'sci',
  name: 'Science',
  chapters: [
    { id: 's1', name: 'The Ever-Evolving World of Science', part: 'I', chapterNo: 1, concepts: [] },
    { id: 's3', name: 'Light: Shadows and Reflections', part: 'I', chapterNo: 3, concepts: [
      { id: 'sc1', name: 'Reflection of light' },
      { id: 'sc2', name: 'Pinhole camera' },
    ] },
    { id: 's5', name: 'Séparation of Mixtures', part: 'I', chapterNo: 5, concepts: [
      { id: 'sc3', name: 'Filtration' },
    ] },
  ],
}

const all = [maths, science]
const ids = (q: string) => searchTopics(all, q).map((s) => s.chapterId)

describe('normalizeText', () => {
  it('lowercases, strips accents and punctuation, collapses spaces', () => {
    expect(normalizeText('  Séparation,  OF   Mixtures! ')).toBe('separation of mixtures')
    expect(normalizeText('Ever-Evolving')).toBe('ever evolving')
  })
})

describe('withinOneEdit', () => {
  it('accepts one insert, delete, substitution or swap only', () => {
    expect(withinOneEdit('fractoin', 'fraction')).toBe(true)
    expect(withinOneEdit('fraction', 'fractions')).toBe(true)
    expect(withinOneEdit('fracton', 'fraction')).toBe(true)
    expect(withinOneEdit('fractian', 'fraction')).toBe(true)
    expect(withinOneEdit('fractiin', 'fractons')).toBe(false)
    expect(withinOneEdit('abc', 'abcde')).toBe(false)
  })
})

describe('searchTopics', () => {
  it('returns nothing for empty, blank or filler-only input', () => {
    expect(searchTopics(all, '')).toEqual([])
    expect(searchTopics(all, '   ')).toEqual([])
    expect(searchTopics(all, '!!!')).toEqual([])
    expect(searchTopics(all, 'chapter')).toEqual([])
  })

  it('is case-insensitive and ignores punctuation and extra spaces', () => {
    expect(ids('FRACTIONS')[0]).toBe('m1')
    expect(ids('  fractions!!  ')[0]).toBe('m1')
    expect(ids('ever-evolving')).toEqual(['s1'])
    expect(ids('light shadows')).toEqual(['s3'])
  })

  it('ignores accents on either side', () => {
    expect(ids('separation')).toEqual(['s5'])
    expect(ids('séparation')).toEqual(['s5'])
  })

  it('ranks exact chapter name, then prefix, then other chapter words, then concepts', () => {
    const r = searchTopics(all, 'fractions')
    expect(r.map((s) => s.chapterId)).toEqual(['m1', 'm4'])
    // "decimal" is a chapter word of m4 only; the concept of m3a ("Decimal place value") ranks last.
    const d = searchTopics(all, 'decimal')
    expect(d.map((s) => s.chapterId)).toEqual(['m4', 'm3a'])
    expect(d[0].conceptName).toBeUndefined()
    expect(d[1].conceptName).toBe('Decimal place value')
  })

  it('puts a prefix match before a later-word match', () => {
    const r = searchTopics(all, 'peek')
    expect(r.map((s) => s.chapterId)).toEqual(['m3a', 'm3b'])
  })

  it('names the concept when only the concept matched', () => {
    const r = searchTopics(all, 'pinhole')
    expect(r).toHaveLength(1)
    expect(r[0]).toMatchObject({
      chapterId: 's3',
      chapterName: 'Light: Shadows and Reflections',
      subjectName: 'Science',
      conceptId: 'sc2',
      conceptName: 'Pinhole camera',
    })
  })

  it('prefers a chapter-name match over concepts of the same chapter', () => {
    const r = searchTopics(all, 'light')
    expect(r[0].chapterId).toBe('s3')
    expect(r[0].conceptName).toBeUndefined()
    expect(r.filter((s) => s.chapterId === 's3')).toHaveLength(1)
  })

  it('matches prefixes while she is still typing', () => {
    expect(ids('frac')[0]).toBe('m1')
    expect(ids('refl')).toEqual(['s3'])
  })

  it('tolerates one typo in words of 5 or more letters', () => {
    expect(ids('fractoin')).toContain('m1')
    expect(ids('mixtrues')).toEqual(['s5']) // one transposition
    expect(ids('mixtxxes')).toEqual([]) // two edits
    expect(ids('mixtures')).toEqual(['s5'])
    expect(ids('shadws')).toEqual(['s3'])
  })

  it('does not apply typo tolerance to short words', () => {
    expect(ids('lite')).toEqual([])
    expect(ids('ligt')).toEqual([])
  })

  it('matches chapter numbers in several spellings', () => {
    for (const q of ['3', 'ch 3', 'chapter 3', 'Chapter-3', 'ch. 3']) {
      const r = searchTopics(all, q).map((s) => s.chapterId)
      expect(r.sort()).toEqual(['m3a', 'm3b', 's3'].sort())
    }
  })

  it('shows both chapters when the number repeats across parts, each with its part', () => {
    const r = searchTopics([maths], 'chapter 3')
    expect(r.map((s) => [s.chapterId, s.part])).toEqual([
      ['m3a', 'I'],
      ['m3b', 'II'],
    ])
    expect(r.every((s) => s.showPart)).toBe(true)
    expect(suggestionPartLabel(r[1])).toBe('Part II')
  })

  it('does not show a part when the subject has only one', () => {
    const r = searchTopics([science], 'ch 3')
    expect(r).toHaveLength(1)
    expect(r[0].showPart).toBe(false)
    expect(suggestionPartLabel(r[0])).toBe('')
  })

  it('combines a number with a subject word', () => {
    expect(ids('ch 3 science')).toEqual(['s3'])
    expect(ids('science 5')).toEqual(['s5'])
    // "maths" is one typo away from the start of "mathematics".
    expect(ids('chapter 3 maths').sort()).toEqual(['m3a', 'm3b'])
    expect(ids('chapter 3 physics')).toEqual([])
  })

  it('combines a number with a chapter word', () => {
    expect(ids('3 light')).toEqual(['s3'])
    expect(ids('chapter 3 fractions')).toEqual([])
    expect(ids('chapter 4 fractions')).toEqual(['m4'])
  })

  it('does not treat a bare number as a match for chapters of other numbers', () => {
    expect(ids('7')).toEqual([])
  })

  it('treats "ch" as a word, not filler, when there is no number', () => {
    expect(searchTopics([{ id: 'x', name: 'Chemistry', chapters: [
      { id: 'x1', name: 'Acids', part: 'I', chapterNo: 1, concepts: [] },
    ] }], 'ch')).toHaveLength(1)
  })

  it('lists every chapter of a subject when only its name is typed', () => {
    // s1 has "Science" in its own name (a chapter-name match), so it ranks after the subject-only ones.
    expect(ids('science')).toEqual(['s3', 's5', 's1'])
  })

  it('caps results at 8 and honours a custom limit', () => {
    const big: TopicSubject = {
      id: 'b',
      name: 'Big',
      chapters: Array.from({ length: 20 }, (_, i) => ({
        id: `b${i}`,
        name: `Waves ${i}`,
        part: 'I',
        chapterNo: i + 1,
        concepts: [],
      })),
    }
    expect(searchTopics([big], 'waves')).toHaveLength(8)
    expect(searchTopics([big], 'waves', 3)).toHaveLength(3)
  })

  it('returns nothing when nothing matches', () => {
    expect(ids('zzzzz')).toEqual([])
  })

  it('works with no subjects', () => {
    expect(searchTopics([], 'fractions')).toEqual([])
  })
})
