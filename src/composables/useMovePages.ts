/**
 * In sorted list, move pages to the left/right with arrows
 */

import type { Ref } from 'vue'
import type { BookPage } from '@/types'

export default function useMovePage(
  list2: Ref<BookPage[]>,
  draggedOverIndex: Ref<number | null>,
  draggingItem: Ref<BookPage | null>,
  onDropList2: () => void,
) {
  function moveLeft(page: BookPage, index: number) {
    if (index <= 0) return

    draggingItem.value = page
    draggedOverIndex.value = index - 1

    onDropList2()
  }
  function moveRight(page: BookPage, index: number) {
    if (index >= list2.value.length - 1) return

    draggingItem.value = page
    draggedOverIndex.value = index + 1

    onDropList2()
  }

  return { moveLeft, moveRight }
}
