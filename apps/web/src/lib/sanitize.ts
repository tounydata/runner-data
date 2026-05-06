import DOMPurify from 'dompurify'
import { marked } from 'marked'

/**
 * Safely render markdown from untrusted sources (AI responses).
 * Returns sanitised HTML string; use with dangerouslySetInnerHTML ONLY
 * after this function has been applied.
 */
export function renderSafeMarkdown(markdown: string): string {
  const rawHtml = marked.parse(markdown) as string
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'blockquote',
      'code',
      'pre',
    ],
    ALLOWED_ATTR: [],
    FORBID_CONTENTS: ['script', 'style'],
  })
}

/** Strip all HTML — for plain text contexts */
export function stripHtml(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}
