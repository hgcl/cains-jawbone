import bookJson from '../../assets/book.json'
import type { BookPage } from '@/types'
import type { Ref } from 'vue'

export function useShowPage(
  searchVisible: Ref<boolean>,
  pageNumber: Ref<number | null>,
  pageContent: Ref<string>,
  pageList: Ref<string>,
) {
  function showPage(page: BookPage) {
    // Hide search (and show page)
    searchVisible.value = false

    pageNumber.value = page.id
    pageContent.value = page.content
    pageList.value = page.list === 1 ? 'Unsorted page' : 'Sorted page'
  }

  function backToSearch() {
    searchVisible.value = true
  }

  return { showPage, backToSearch }
}

export function filterResultsByQuery(query: string) {
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

/**
 * HELPERS
 */
function formatSnippet(content: string, queryIndex: number, query: string) {
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
