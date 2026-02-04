/**
 * In the sorted list, drag and drop to change page order
 * Using HTML Drag and Drop API https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */

import type { Ref } from 'vue'
import type { BookPage } from '@/types'
import { filterPageFromList, reorderList } from '@/utils/handlePageLists'

export default function useDragDropPages(
  list2: Ref<BookPage[]>,
  draggedOverIndex: Ref<number | null>,
  draggingItem: Ref<BookPage | null>,
) {
  // Drag start
  function onDragStart(item: BookPage) {
    draggingItem.value = item
  }

  // List 2 drag over
  function onDragOverList2(index: number) {
    draggedOverIndex.value = index
  }

  // Drop into list 2
  function onDropList2() {
    if (!draggingItem.value) return

    // Remove from original list (it will be added to list 2 later)
    list2.value = filterPageFromList(list2.value, draggingItem.value!.id)

    // Insert into list 2 at `draggedOverIndex`
    const insertIndex = draggedOverIndex.value ?? list2.value.length
    draggingItem.value.list = 2
    list2.value.splice(insertIndex, 0, { ...draggingItem.value })

    // Reorder list 2
    reorderList(list2.value)

    // Reset temp values
    draggingItem.value = null
    draggedOverIndex.value = null
  }

  return {
    onDragStart,
    onDragOverList2,
    onDropList2,
  }
}
