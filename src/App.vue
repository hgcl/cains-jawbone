<script setup lang="ts">
import bookJson from '../src/assets/book.json'
import Card from './components/Card.vue'
import { computed, ref } from 'vue'
import type { BookPage } from './components/types'

/**
 * DRAG AND DROP FEATURE
 * Using HTML Drag and Drop API https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */

// Reactive elements
const items = ref<BookPage[]>(bookJson)
let draggedOverIndex = ref<number | undefined>(undefined)
const draggingItem = ref<BookPage | null>(null) // preview array necessary, so that `items` is only updated on drop

// Computed filtered lists
// list 1: unsorted, list 2: sorted
const listOne = computed(() =>
  items.value.filter((item) => item.list === 1).sort((a, b) => a.order - b.order),
)
const listTwo = computed(() =>
  items.value.filter((item) => item.list === 2).sort((a, b) => a.order - b.order),
)
// Preview for list 2, used when dragging
const previewListTwo = computed(() => {
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

  // Hide current card when dragging
  const dropzoneTwo = document.querySelector('#dropzone-two')
  const htmlEl = dropzoneTwo?.querySelector('.card-' + item.id)
  htmlEl?.setAttribute('style', 'display: none;')
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
  // Show current card again
  const dropzoneTwo = document.querySelector('#dropzone-two')
  const htmlEl = dropzoneTwo?.querySelector('.card-' + item.id)
  htmlEl?.setAttribute('style', 'display: block;')

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
</script>

<template>
  <header>
    <!-- TODO -->
  </header>

  <main>
    <!-- Drop zone for list 1 -->
    <section class="dropzone" @drop="onDrop($event, 1)" @dragover.prevent @dragenter.prevent>
      <h2>Unsorted pages</h2>
      <div class="dropzone__card-list">
        <div
          v-for="item in listOne"
          :key="item.id"
          draggable="true"
          @dragstart="startDrag($event, item)"
        >
          <Card ref="page.id" :page="item" />
        </div>
      </div>
    </section>

    <!-- Drop zone for list 2 -->
    <section class="dropzone" @drop="onDrop($event, 2)" @dragover.prevent @dragenter.prevent>
      <h2>Sorted pages</h2>
      <div class="dropzone__card-list" id="dropzone-two">
        <template v-for="(item, index) in previewListTwo" :key="item.id">
          <div v-if="draggedOverIndex === index" class="preview-zone"></div>
          <div
            :class="`card-${item.id}`"
            draggable="true"
            @dragstart="startDrag($event, item)"
            @dragenter.prevent="onDragEnter(index)"
            @dragend="onDragEnd(item)"
            @drop.stop="onDrop($event, 2)"
          >
            <Card ref="page.id" :page="item" />
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dropzone {
  padding: var(--padding-m);
  border-radius: var(--border-radius);
  background-color: var(--color-background-mute);
  margin-bottom: var(--gap-section);
  min-height: 200px;
}
.dropzone__card-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-m);
}
</style>
<style>
.preview-zone {
  background-color: var(--color-background);
  border: var(--border);
  border-radius: var(--border-radius);
  width: 200px;
  height: 296px;
  opacity: 0.6;
}
</style>
