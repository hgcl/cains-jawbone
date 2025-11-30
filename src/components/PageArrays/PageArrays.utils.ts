import { type Ref } from 'vue'
import type { BookPage } from '../../types'
import PageModal from '../PageModal/PageModal.vue'

/**
 * DRAG AND DROP FEATURE
 * Using HTML Drag and Drop API https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */

export function useDragDrop(
  list1: Ref<BookPage[]>,
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
    if (draggingItem.value.list === 1) {
      list1.value = list1.value.filter((i) => i.id !== draggingItem.value!.id)
    } else {
      list2.value = list2.value.filter((i) => i.id !== draggingItem.value!.id)
    }

    // Insert into list 2 at `draggedOverIndex`
    const insertIndex = draggedOverIndex.value ?? list2.value.length
    draggingItem.value.list = 2
    list2.value.splice(insertIndex, 0, { ...draggingItem.value })

    // Reorder list 2
    list2.value.forEach((item, i) => (item.order = i))

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

export function useSendToList(list1: Ref<BookPage[]>, list2: Ref<BookPage[]>) {
  // Send page from unsorted list to sorted list (1 -> 2)
  function sendToSort(id: number) {
    // Find page inside list 2
    const page = list1.value.find((i) => i.id === id)
    if (!page) return

    // Remove from list 1
    list1.value = list1.value.filter((i) => i.id !== id)

    // Move to list 2
    page.list = 2
    page.order = 0
    list2.value.unshift(page)

    // Fix order indexes for list 2
    list2.value.forEach((item, index) => (item.order = index))
  }

  // Send page from sorted list to unsorted list (2 -> 1)
  function sendToUnsorted(id: number) {
    // Find page inside list 2
    const page = list2.value.find((i) => i.id === id)
    if (!page) return

    // Remove from list 2
    list2.value = list2.value.filter((i) => i.id !== id)

    // Fix order indexes for list 2
    list2.value.forEach((item, index) => (item.order = index))

    // Move to list 1
    page.list = 1
    page.order = 0
    list1.value.unshift(page)
  }

  return { sendToSort, sendToUnsorted }
}

export function useMovePage(
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

export function useNavigateBetweenPages(modalPage: Ref<BookPage | null>, modalIndex: Ref<number>) {
  function toPreviousPage(index: number, list: BookPage[]) {
    if (index > 0) {
      modalPage.value = list[index - 1] as BookPage
      modalIndex.value--
    }
  }
  function toNextPage(index: number, list: BookPage[]) {
    if (index < list.length - 1) {
      modalPage.value = list[index + 1] as BookPage
      modalIndex.value++
    }
  }
  return { toPreviousPage, toNextPage }
}

export function useOpenDialog(
  modalPage: Ref<BookPage | null>,
  modalIndex: Ref<number>,
  modalList: Ref<BookPage[]>,
  dialogRef: Ref<InstanceType<typeof PageModal> | null>,
) {
  return function openDialog(initialPage: BookPage, initialIndex: number, list: BookPage[]) {
    modalPage.value = initialPage
    modalIndex.value = initialIndex
    modalList.value = list
    dialogRef.value?.open()
  }
}
