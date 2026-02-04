/**
 * Show results that fit search query
 */

import bookJson from '@/assets/book.json'
import formatPreviewSnippet from './formatPreviewSnippet'

export default function filterResultsByQuery(query: string) {
  const filteredResults = bookJson
    .map((page) => {
      // Search `query` in `bookJson`, if no result => index === -1
      const index = page.content.toLowerCase().indexOf(query)
      if (index === -1) return null

      const snippet = formatPreviewSnippet(page.content, index, query)

      return { page, snippet }
    })
    .filter((result) => result !== null)

  return filteredResults
}
