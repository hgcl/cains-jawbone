<script setup lang="ts">
import { ref, computed } from 'vue'
import bookJson from '../../assets/book.json'
import Card from '../../components/Card/Card.vue'
import PageOrder from '../../components/PageOrder/PageOrder.vue'
import type { BookPage } from '../../types'

// Initial lists of items
const list1 = ref<BookPage[]>(bookJson)
const list2 = ref<BookPage[]>([])

// Item being dragged
const draggingItem = ref<BookPage | null>(null)
// Index of the item being dragged over
const draggedOverIndex = ref<number | null>(null)

// List 1: always sorted by `id`
// List 2: sorted based by `order`
const sortedList1 = computed(() => [...list1.value].sort((a, b) => a.id - b.id))
const sortedList2 = computed(() => [...list2.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))

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

// Drop into list 1
function onDropList1() {
  if (!draggingItem.value) return

  // Remove from original list
  if (draggingItem.value.list === 2) {
    list2.value = list2.value.filter((i) => i.id !== draggingItem.value!.id)
    list2.value.forEach((item, i) => (item.order = i))
  } else {
    list1.value = list1.value.filter((i) => i.id !== draggingItem.value!.id)
  }

  // İnsert into list 1 (no order)
  draggingItem.value.list = 1
  list1.value.push({ ...draggingItem.value })

  // Reset temp values
  draggingItem.value = null
  draggedOverIndex.value = null
}

// From "sorted" list to "unsorted" list
function sendToSort(page: BookPage) {
  onDragStart(page)
  onDropList2()
}
function sendToUnsorted(page: BookPage) {
  onDragStart(page)
  onDropList1()
}

// Move item up-down sorted list
function moveLeft(page: BookPage, index: number) {
  if (index === 0) return

  draggingItem.value = page
  draggedOverIndex.value = index - 1

  onDropList2()
}
// Move item up-down sorted list
function moveRight(page: BookPage, index: number) {
  if (index === list2.value.length) return

  draggingItem.value = page
  draggedOverIndex.value = index + 1

  onDropList2()
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
    <p>Drag the pages to change their order in the book.</p>
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
          ref="page.id"
          :page="item"
          @clickSendToUnsorted="sendToUnsorted(item)"
          @clickMoveLeft="moveLeft(item, index)"
          @clickMoveRight="moveRight(item, index)"
        />
      </div>
    </div>
  </section>

  <!-- LIST 1: UNSORTED -->
  <section
    class="dropzone__list-one"
    @dragover.prevent
    @dragenter.prevent
    @drop.prevent="onDropList1"
  >
    <h2>Unsorted</h2>
    <p>Start ordering the pages by dragging them to the sorted section above.</p>
    <div class="dropzone__card-list">
      <div
        v-for="item in sortedList1"
        :key="item.id"
        class="card"
        draggable="true"
        @dragstart="onDragStart(item)"
      >
        <Card ref="page.id" :page="item" @clickSendToSort="sendToSort(item)" />
      </div>
    </div>
  </section>
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
  }
  .dropzone__card-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
