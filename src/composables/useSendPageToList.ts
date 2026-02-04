/**
 * Send page from unsorted list to sorted list (and vice-versa)
 */

import type { Ref } from 'vue'
import type { BookPage } from '@/types'
import { filterPageFromList, findPageInList, reorderList } from '@/utils/handlePageLists'

export default function useSendPageToList(list1: Ref<BookPage[]>, list2: Ref<BookPage[]>) {
  /**
   * Send page from unsorted list to sorted list (1 -> 2)
   */
  function sendToSort(id: number) {
    // Find page inside list 2
    const page = findPageInList(list1.value, id)
    if (!page) return

    // Remove from list 1
    list1.value = filterPageFromList(list1.value, id)

    // Move to list 2
    page.list = 2
    page.order = 0
    list2.value.unshift(page)

    // Reorder list 2
    reorderList(list2.value)
  }

  /**
   * Send page from sorted list to unsorted list (2 -> 1)
   */
  function sendToUnsorted(id: number) {
    // Find page inside list 2
    const page = findPageInList(list2.value, id)
    if (!page) return

    // Remove from list 2
    list2.value = filterPageFromList(list2.value, id)

    // Reorder list 2
    reorderList(list2.value)

    // Move to list 1
    page.list = 1
    page.order = 0
    list1.value.unshift(page)
  }

  /**
   * Toggle pages from "sorted" to "unsorted"
   */
  function toggleSort(page: BookPage | null) {
    if (!page) return

    if (page.list === 1) {
      sendToSort(page.id)
    } else {
      sendToUnsorted(page.id)
    }
  }

  return { toggleSort }
}
