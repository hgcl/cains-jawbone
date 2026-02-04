/**
 * Format page content snippet preview to "truncate" the middle
 * e.g. At my meeting with Clement [...] of mine takes his ease in my chair.
 */

export default function formatPreviewSnippet(content: string, queryIndex: number, query: string) {
  const snippetLength = 30

  const start = Math.max(0, queryIndex - snippetLength)
  // `queryIndex + query.length` gives the position right after the end of the search term
  const end = Math.min(content.length, queryIndex + query.length + snippetLength)

  let snippet = content.slice(start, end)

  if (start > 0) {
    snippet = '...' + snippet
  }
  if (end < content.length) {
    snippet = snippet + '...'
  }

  return snippet
}
