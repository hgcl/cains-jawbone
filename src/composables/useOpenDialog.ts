/**
 * Open modal of selected page
 */

import type { BookPage } from '@/types'
import type { Ref } from 'vue'

export type DialogType = {
  open: () => void
}

export default function useOpenDialog(
  modalPage: Ref<BookPage | null>,
  modalIndex: Ref<number>,
  modalList: Ref<BookPage[]>,
  dialogRef: Ref<DialogType | null>,
) {
  return function openDialog(initialPage: BookPage, initialIndex: number, list: BookPage[]) {
    modalPage.value = initialPage
    modalIndex.value = initialIndex
    modalList.value = list
    dialogRef.value?.open()
  }
}
