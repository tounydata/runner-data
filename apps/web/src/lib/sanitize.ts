import DOMPurify from 'dompurify'
import { marked } from 'marked'

/**
 * Safely render markdown from untrusted sources (AI responses).
 * Returns sanitised HTML string; use with dangerouslySetInnerHTML ONLY
 * after this function has been applied.
 */
export async function renderSafeMarkdown(markdown: string): Promise<string> {
  const rawHtml = await marked.parse(markdown, { async: false })
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre',
    ],
    ALLOWED_ATTR: [],
    FORBID_CONTENTS: ['script', 'style'],
  })
}

/** Strip all HTML — for plain text contexts */
export function stripHtml(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}
