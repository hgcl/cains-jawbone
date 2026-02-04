import type { BookPage } from '@/types'
import type { Ref } from 'vue'

export function useShowSearchResult(
  searchVisible: Ref<boolean>,
  pageNumber: Ref<number | null>,
  pageContent: Ref<string>,
  pageList: Ref<string>,
) {
  // Hide search (and show selected page)
  function showSearchResult(page: BookPage) {
    searchVisible.value = false
    pageNumber.value = page.id
    pageContent.value = page.content
    pageList.value = page.list === 1 ? 'Unsorted page' : 'Sorted page'
  }

  function backToSearch() {
    searchVisible.value = true
  }

  return { showSearchResult, backToSearch }
}
