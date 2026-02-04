/**
 * Navigate between pages using the next/previous arrows in a page modal
 */

import type { Ref } from 'vue'
import type { BookPage } from '@/types'

export default function useNavigateBetweenPages(
  modalPage: Ref<BookPage | null>,
  modalIndex: Ref<number>,
  modalList: Ref<BookPage[]>,
) {
  function toPreviousPage() {
    if (modalIndex.value > 0) {
      modalPage.value = modalList.value[modalIndex.value - 1] as BookPage
      modalIndex.value--
    }
  }
  function toNextPage() {
    if (modalIndex.value < modalList.value.length - 1) {
      modalPage.value = modalList.value[modalIndex.value + 1] as BookPage
      modalIndex.value++
    }
  }
  return { toPreviousPage, toNextPage }
}
