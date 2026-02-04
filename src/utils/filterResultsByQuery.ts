/**
 * Show results that fit search query
 */

import bookJson from '@/assets/book.json'
import { formatSnippet } from './formatSnippet'

export default function filterResultsByQuery(query: string) {
  const filteredResults = bookJson
    .map((page) => {
      // Search `query` in `bookJson`, if no result => index === -1
      const index = page.content.toLowerCase().indexOf(query)
      if (index === -1) return null

      const snippet = formatSnippet(page.content, index, query)

      return { page, snippet }
    })
    .filter((result) => result !== null)

  return filteredResults
}
