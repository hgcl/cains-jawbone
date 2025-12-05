import { type Ref } from 'vue'
import type { BookPage } from '../../types'
import PageModal from '../PageModal/PageModal.vue'

/**
 * DRAG AND DROP FEATURE
 * Using HTML Drag and Drop API https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */

export function useDragDrop(
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

export function useSendToList(list1: Ref<BookPage[]>, list2: Ref<BookPage[]>) {
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
   * Toggle "sorted" checkbox
   */
  function toggleSorted(page: BookPage, checked: boolean) {
    if (checked) {
      sendToSort(page.id)
    } else {
      sendToUnsorted(page.id)
    }
  }

  return toggleSorted
}

/**
 * MOVE PAGE LEFT-RIGHT
 */
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

/**
 * OPENING PAGE MODAL
 */
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

/**
 * TABS
 */
export function useSelectTab(selectedIndex: Ref<number>) {
  function selectTab(index: number) {
    selectedIndex.value = index

    // Move focus to the newly selected tab
    const tabEl = document.getElementById(`tab${index + 1}`)
    tabEl?.focus()

    // Scroll to the correct panel
    const newPanel = 'page-array__' + (index + 1)
    window?.document?.getElementById(newPanel)?.scrollIntoView()
  }

  function switchTab(event: KeyboardEvent, index: number) {
    let direction = event.key

    if (direction === 'ArrowDown') {
      event.preventDefault()
      selectTab(index)
    } else if (direction === 'ArrowLeft') {
      event.preventDefault()
      if (index === 0) return
      selectTab(index - 1)
    } else if (direction === 'ArrowRight') {
      event.preventDefault()
      if (index === 1) return
      selectTab(index + 1)
    }
  }

  return { selectTab, switchTab }
}

/**
 * INPUT CONTROL
 */
export function useHandleOrderString(
  list1: Ref<BookPage[]>,
  list2: Ref<BookPage[]>,
  bookJson: BookPage[],
) {
  function handleOrderString(pageArray: number[]) {
    let newList1: BookPage[] = []
    let newList2: BookPage[] = []

    bookJson.forEach((el, index) => {
      // const isInList2 = findPageInList(newList2, el.id)
      const indexInList2 = pageArray.indexOf(el.id)
      const pageObject = el

      if (indexInList2 != -1) {
        // If exists in `pageArray`, add to list 2
        pageObject.list = 2
        pageObject.order = indexInList2
        newList2.push(pageObject)
      } else {
        // If page is not in list 2, add to list 1
        pageObject.list = 1
        pageObject.order = index
        newList1.push(pageObject)
      }
    })

    // Replace `list2` and `list1` with updated versions
    list1.value = newList1
    list2.value = newList2
  }

  return { handleOrderString }
}

/**
 * Helpers
 */

function reorderList(list: BookPage[]) {
  list.forEach((item, index) => (item.order = index))
}

function filterPageFromList(list: BookPage[], pageId: number) {
  return list.filter((item) => item.id !== pageId)
}

function findPageInList(list: BookPage[], pageId: number) {
  return list.find((item) => item.id === pageId)
}
