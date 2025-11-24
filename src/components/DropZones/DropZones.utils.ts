import { computed, type Ref } from 'vue'
import type { BookPage } from '../../types'

/**
 * DRAG AND DROP FEATURE
 * Using HTML Drag and Drop API https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */

export function useDragDrop(
  items: Ref<BookPage[]>,
  draggedOverIndex: Ref<number | undefined>,
  draggingItem: Ref<BookPage | null>,
) {
  // Computed filtered lists
  // list 1: unsorted, list 2: sorted
  const listOne = computed(() =>
    items.value.filter((item) => item.list === 1).sort((a, b) => a.order - b.order),
  )
  const listTwo = computed(() =>
    items.value.filter((item) => item.list === 2).sort((a, b) => a.order - b.order),
  )
  // Temp list 2, used when dragging
  const tempListTwo = computed(() => {
    const list = items.value.filter((i) => i.list === 2).sort((a, b) => a.order - b.order)

    if (!draggingItem.value || draggedOverIndex.value === undefined) return list

    // Remove dragging item from the array if present
    const filteredList = list.filter((i) => i.id !== draggingItem.value!.id)

    // Insert dragging item at draggedOverIndex
    const insertIndex = draggedOverIndex.value
    filteredList.splice(insertIndex, 0, draggingItem.value)

    return filteredList
  })

  /**
   * Drag start handler
   */
  function startDrag(evt: DragEvent, item: BookPage) {
    // Check that there is a `DataTransfer` object which contains the drag event's data
    if (!evt.dataTransfer) return
    // `effectAllowed`: what the drag source allows
    evt.dataTransfer.effectAllowed = 'move'
    // `dropEffect`: what the drop target does
    evt.dataTransfer.dropEffect = 'move'
    // Attach item id as string to the drag event
    evt.dataTransfer.setData('itemID', item.id.toString())

    draggingItem.value = item
    draggedOverIndex.value = listTwo.value.findIndex((i) => i.id === item.id)
  }

  /**
   * On drag enter handler: when dragging over a card
   */
  function onDragEnter(targetIndex?: number) {
    draggedOverIndex.value = targetIndex
  }

  /**
   * On drag end handler: when the mouse leaves the card
   */
  function onDragEnd(item: BookPage) {
    // Reset
    draggedOverIndex.value = undefined
    draggingItem.value = null
  }

  /**
   * On drop handler
   */
  function onDrop(evt: DragEvent, targetList: number) {
    if (!evt.dataTransfer || draggingItem.value === null) return

    // Retrieve value previously attached to drag event, and convert it back to a number
    const idStr = evt.dataTransfer.getData('itemID')
    const id = Number(idStr)

    // Find the matching item in original `items` array
    const dragEl = items.value.find((i) => i.id === id)
    if (!dragEl) return

    // Add found item to sorted list
    dragEl.list = targetList

    // Sort items (only for list 2)
    if (targetList === 2) {
      sortListTwo(dragEl)
    }

    // Reset
    draggedOverIndex.value = undefined
    draggingItem.value = null
  }

  function sortListTwo(dragEl: BookPage) {
    // Get current list
    const listItems = items.value.filter((i) => i.list === 2).sort((a, b) => a.order - b.order)

    // Remove dragged element from its old position in the sorted array
    const oldIndex = listItems.findIndex((i) => {
      return i.id === dragEl.id
    }) // `findIndex()` returns -1 if item is not in list
    if (oldIndex !== -1) listItems.splice(oldIndex, 1)

    // Insert item into the new position
    const insertIndex = draggedOverIndex.value ?? listItems.length
    listItems.splice(insertIndex, 0, dragEl)

    // Reassign order values
    listItems.forEach((item, i) => {
      item.order = i
    })
  }

  return {
    listOne,
    listTwo,
    // tempListOne,
    tempListTwo,
    draggedOverIndex,
    startDrag,
    onDragEnter,
    onDragEnd,
    onDrop,
  }
}
