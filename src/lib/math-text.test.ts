import { describe, expect, it } from 'vitest'
import { mathHtml, parseMathText } from './math-text'

const kinds = (t: string) => parseMathText(t).map((s) => s.kind)

describe('plain-text maths becomes real maths (the parser the app, the PDF and the Word export share)', () => {
  it('simple fractions: a number on one side', () => {
    expect(parseMathText('Add 3/4 and 1/2.')).toEqual([
      { kind: 'text', text: 'Add ' },
      { kind: 'frac', num: '3', den: '4' },
      { kind: 'text', text: ' and ' },
      { kind: 'frac', num: '1', den: '2' },
      { kind: 'text', text: '.' },
    ])
  })
  it('bracketed fractions: (a+b)/(c+d), (x+1)/2, 3/(y-2); the outer brackets are not shown', () => {
    expect(parseMathText('(a+b)/(a-b)')).toEqual([{ kind: 'frac', num: 'a+b', den: 'a-b' }])
    expect(parseMathText('Simplify (x+1)/2.')).toEqual([
      { kind: 'text', text: 'Simplify ' },
      { kind: 'frac', num: 'x+1', den: '2' },
      { kind: 'text', text: '.' },
    ])
    expect(parseMathText('3/(y-2)')).toEqual([{ kind: 'frac', num: '3', den: 'y-2' }])
    // a power inside the top or the bottom does not stop it being a fraction
    expect(parseMathText('(n²+1)/(n-1)')).toEqual([{ kind: 'frac', num: 'n²+1', den: 'n-1' }])
    expect(parseMathText('(x^2+1)/(x-1)')).toEqual([{ kind: 'frac', num: 'x^2+1', den: 'x-1' }])
  })
  it('words, units, dates, function calls and sentences in brackets are never fractions', () => {
    for (const t of ['km/h', 'and/or', 'a/b', '12/10/2026', '1/2/3', 'Rs 20/-', 'http://x.in/2', 'f(x)/2', '(see the figure)/(3)', '(rounded off)/2'])
      expect(kinds(t), t).not.toContain('frac')
  })
  it('powers of a bracket group: (x+y)^2 and (x+y)², with the bracket as the base', () => {
    expect(parseMathText('(x+y)^2')).toEqual([{ kind: 'sup', text: '2', base: '(x+y)' }])
    expect(parseMathText('Expand (a-b)² now')).toEqual([
      { kind: 'text', text: 'Expand ' },
      { kind: 'sup', text: '2', base: '(a-b)' },
      { kind: 'text', text: ' now' },
    ])
    expect(parseMathText('x^(n+1)')).toEqual([{ kind: 'text', text: 'x' }, { kind: 'sup', text: 'n+1' }])
    expect(parseMathText('x^{2}')).toEqual([{ kind: 'text', text: 'x' }, { kind: 'sup', text: '2' }])
  })
  it('simple powers and subscripts as before', () => {
    expect(parseMathText('x^2')).toEqual([{ kind: 'text', text: 'x' }, { kind: 'sup', text: '2' }])
    expect(parseMathText('2^-3')).toEqual([{ kind: 'text', text: '2' }, { kind: 'sup', text: '-3' }])
    expect(parseMathText('H₂O')).toEqual([{ kind: 'text', text: 'H' }, { kind: 'sub', text: '2' }, { kind: 'text', text: 'O' }])
  })
  it('roots: a number, a letter, a bracket expression (nested too), cube and fourth roots', () => {
    expect(parseMathText('√9')).toEqual([{ kind: 'sqrt', inner: '9' }])
    expect(parseMathText('√(x + 1)')).toEqual([{ kind: 'sqrt', inner: 'x + 1' }])
    expect(parseMathText('√(a(b+c))')).toEqual([{ kind: 'sqrt', inner: 'a(b+c)' }])
    expect(parseMathText('∛8')).toEqual([{ kind: 'sqrt', inner: '8', degree: '3' }])
    expect(parseMathText('∜(16)')).toEqual([{ kind: 'sqrt', inner: '16', degree: '4' }])
    expect(kinds('√')).toEqual(['text'])
  })
  it('anything unsure stays as typed', () => {
    const t = 'If a ≤ b and 3 × 4 ÷ 2 = π° then a/b stays.'
    expect(parseMathText(t)).toEqual([{ kind: 'text', text: t }])
    expect(parseMathText('')).toEqual([])
  })
})

describe('mathHtml (app screens and PDF)', () => {
  it('draws fractions, roots and powers with plain HTML and escapes everything else', () => {
    const h = mathHtml('Find 3/4 of √9 and (x+y)^2 if a < b & c > d')
    expect(h).toContain('<span class="m-frac"><span class="m-n">3</span><span class="m-d">4</span></span>')
    expect(h).toContain('<span class="m-sqrt"><span class="m-rad">√</span><span class="m-in">9</span></span>')
    expect(h).toContain('(x+y)<sup class="m-sup">2</sup>')
    expect(h).toContain('a &lt; b &amp; c &gt; d')
  })
  it('a fraction inside a fraction or a power inside a root is drawn too, to a safe depth', () => {
    expect(mathHtml('(x^2+1)/(x-1)')).toContain('<sup class="m-sup">2</sup>')
    expect(mathHtml('√(x^2)')).toContain('m-sqrt')
  })
  it('script and markup in a question are never passed through', () => {
    const h = mathHtml('<script>alert(1)</script> 3/4 "x" ^2')
    expect(h).not.toContain('<script>')
    expect(h).toContain('&lt;script&gt;')
    expect(h).toContain('&quot;x&quot;')
  })
  it('text without maths comes back unchanged (escaped)', () => {
    expect(mathHtml('What is the capital of India?')).toBe('What is the capital of India?')
  })
})
