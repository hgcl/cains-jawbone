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
