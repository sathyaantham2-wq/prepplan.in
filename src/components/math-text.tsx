import { mathHtml } from '../lib/math-text'

/**
 * A question's text with its maths drawn as maths (fractions, roots, powers). The HTML comes only from
 * mathHtml, which escapes everything it does not draw itself, so nothing typed in a question can inject markup.
 */
export function MathText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: mathHtml(text) }}
    />
  )
}
