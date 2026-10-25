import { useId, useMemo, useState } from 'react'
import { searchTopics, suggestionPartLabel } from '../lib/topic-search'
import type { TopicSubject, TopicSuggestion } from '../lib/topic-search'

interface Props {
  subjects: Array<TopicSubject>
  // Called when she taps or presses Enter on a suggestion. Never generates anything by itself.
  onSelect: (suggestion: TopicSuggestion) => void
  // Optional, used by the newer builder layouts: lets the same box also filter a chapter list.
  onTextChange?: (text: string) => void
  label?: string
  placeholder?: string
  className?: string
}

// "What do you want to practise?" -- combobox with a listbox of up to 8 suggestions.
// All matching lives in lib/topic-search.ts; this only renders and handles the keyboard.
export function TopicSearchBox({
  subjects,
  onSelect,
  onTextChange,
  label = 'What do you want to practise?',
  placeholder = 'Try Fractions, or ch 3 science',
  className = 'relative mb-3',
}: Props) {
  const baseId = useId()
  const listId = `${baseId}-list`
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const results = useMemo(() => searchTopics(subjects, text), [subjects, text])
  const hasText = text.trim() !== ''
  const showList = open && hasText
  const optionId = (i: number) => `${baseId}-opt-${i}`

  function choose(s: TopicSuggestion) {
    onSelect(s)
    setText('')
    onTextChange?.('')
    setOpen(false)
    setActive(0)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      if (results.length > 0) setActive((a) => (a + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) setOpen(true)
      if (results.length > 0)
        setActive((a) => (a - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      if (showList && results[active]) {
        e.preventDefault()
        choose(results[active])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setText('')
      onTextChange?.('')
      setOpen(false)
      setActive(0)
    }
  }

  return (
    <div className={className}>
      <label
        htmlFor={`${baseId}-input`}
        className="text-muted-foreground mb-1 block text-xs font-medium"
      >
        {label}
      </label>
      <input
        id={`${baseId}-input`}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showList && results[active] ? optionId(active) : undefined
        }
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        placeholder={placeholder}
        className="border-input bg-background h-11 w-full rounded-md border px-3 text-base shadow-xs sm:text-sm"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          onTextChange?.(e.target.value)
          setOpen(true)
          setActive(0)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Suggestions"
          className="bg-background border-border absolute z-20 mt-1 max-h-96 w-full overflow-auto rounded-md border shadow-lg"
        >
          {results.length === 0 && (
            <li
              role="presentation"
              className="text-small text-muted-foreground px-3 py-3"
            >
              Nothing found. Try a chapter name, like Fractions.
            </li>
          )}
          {results.map((s, i) => {
            const part = suggestionPartLabel(s)
            return (
              <li
                key={`${s.chapterId}-${s.conceptId ?? ''}`}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                // mousedown, not click: the input's blur would close the list first.
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(s)
                }}
                onMouseEnter={() => setActive(i)}
                className={`flex min-h-11 cursor-pointer flex-col justify-center px-3 py-1.5 ${
                  i === active ? 'bg-primary/10' : ''
                }`}
              >
                <span className="text-body font-medium">
                  {s.chapterName}
                  {part && (
                    <span className="text-muted-foreground font-normal">
                      {' '}
                      · {part}
                    </span>
                  )}
                </span>
                <span className="text-caption text-muted-foreground">
                  {s.subjectName}
                  {s.conceptName ? ` · ${s.conceptName}` : ''}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
