<script setup lang="ts">
import { ref, computed } from 'vue'
import bookJson from '../../assets/book.json'
import Card from '../../components/Card/Card.vue'
import PageOrder from '../../components/PageOrder/PageOrder.vue'
import PageModal from '../PageModal/PageModal.vue'
import type { BookPage } from '../../types'

// Initial lists of items
const list1 = ref<BookPage[]>(bookJson.filter((i) => i.list === 1))
const list2 = ref<BookPage[]>(bookJson.filter((i) => i.list === 2))

// Item being dragged
const draggingItem = ref<BookPage | null>(null)
// Index of the item being dragged over
const draggedOverIndex = ref<number | null>(null)

// List 1: always sorted by `id`
// List 2: sorted based by `order`
const sortedList1 = computed(() => [...list1.value].sort((a, b) => a.id - b.id))
const sortedList2 = computed(() => [...list2.value].sort((a, b) => a.order - b.order))

// Final order (as a string)
const orderString = computed(() => sortedList2.value.map((el) => el.id).join(', '))

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

// From "sorted" list to "unsorted" list
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

// Move item up-down sorted list
function moveLeft(page: BookPage, index: number) {
  if (index <= 0) return

  draggingItem.value = page
  draggedOverIndex.value = index - 1

  onDropList2()
}
// Move item up-down sorted list
function moveRight(page: BookPage, index: number) {
  if (index >= list2.value.length - 1) return

  draggingItem.value = page
  draggedOverIndex.value = index + 1

  onDropList2()
}

// The dialog component exposes `.open()` through a template ref
const modalPage = ref<BookPage | null>(null)
const modalIndex = ref<number>(0)
const modalList = ref<BookPage[]>([])
const dialogRef = ref<InstanceType<typeof PageModal> | null>(null)

function openDialog(initialPage: BookPage, initialIndex: number, list: BookPage[]) {
  modalPage.value = initialPage
  modalIndex.value = initialIndex
  modalList.value = list
  dialogRef.value?.open()
}

// Navigate between pages
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
</script>

<template>
  <!-- LIST 2: SORTED -->
  <section
    class="dropzone__list-two"
    @dragover.prevent
    @dragenter.prevent
    @drop.prevent="onDropList2"
  >
    <h2>Sorted</h2>
    <p>Reorder the pages of the book by dragging them, or using the arrows.</p>
    <PageOrder :orderString="orderString" />
    <div class="dropzone__card-list">
      <div
        v-for="(item, index) in sortedList2"
        :key="item.id"
        class="card"
        draggable="true"
        @dragstart="onDragStart(item)"
        @dragover.prevent="onDragOverList2(index)"
      >
        <Card
          :page="item"
          @clickOpenDialog="openDialog(item, index, sortedList2)"
          @clickSendToUnsorted="sendToUnsorted(item.id)"
          @clickMoveLeft="moveLeft(item, index)"
          @clickMoveRight="moveRight(item, index)"
        />
      </div>
    </div>
  </section>

  <!-- LIST 1: UNSORTED -->
  <section class="dropzone__list-one">
    <h2>Unsorted</h2>
    <p>Start ordering the pages by dragging them to the sorted section above.</p>
    <div class="dropzone__card-list">
      <div v-for="(item, index) in sortedList1" :key="item.id" class="card">
        <Card
          :page="item"
          @clickOpenDialog="openDialog(item, index, sortedList1)"
          @clickSendToSort="sendToSort(item.id)"
        />
      </div>
    </div>
  </section>

  <!-- COMMON DIALOG -->
  <PageModal
    ref="dialogRef"
    :page="modalPage"
    @clickNextPage="toNextPage(modalIndex, modalList)"
    @clickPreviousPage="toPreviousPage(modalIndex, modalList)"
  />
</template>

<style scoped>
.dropzone__list-one,
.dropzone__list-two {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-m);
  background: var(--color-background-mute);
  border-radius: var(--border-radius);
  /* Updated through media queries */
  padding: var(--padding-s);
}
.dropzone__card-list {
  display: flex;
  justify-content: center;
  gap: var(--gap-m);
  border: 2px dashed var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
  min-height: calc(14 * 16px);
  width: 100%;
  /* Updated through media queries */
  flex-direction: column;
}

.dropzone__list-one p,
.dropzone__list-two p {
  color: var(--color-foreground);
}

/* MEDIA QUERIES */
@media (width > 568px) {
  .dropzone__list-one,
  .dropzone__list-two {
    padding: var(--padding-m);
    gap: var(--gap-l);
  }
  .dropzone__card-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
