<script setup lang="ts">
import { ref, computed } from 'vue'
import bookJson from '../../assets/book.json'
import Card from '../../components/Card/Card.vue'
import PageOrder from '../../components/PageOrder/PageOrder.vue'
import PageModal from '../PageModal/PageModal.vue'
import type { BookPage } from '../../types'
import {
  useDragDrop,
  useMovePage,
  useNavigateBetweenPages,
  useSendToList,
} from './PageArrays.utils'

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

// Drag and drop feature within list 2
const { onDragStart, onDragOverList2, onDropList2 } = useDragDrop(
  list1,
  list2,
  draggedOverIndex,
  draggingItem,
)

// Send pages from "sorted" to "unsorted" list (or back)
const { sendToSort, sendToUnsorted } = useSendToList(list1, list2)

// Move item up-down sorted list
const { moveLeft, moveRight } = useMovePage(list2, draggedOverIndex, draggingItem, onDropList2)

/**
 * PAGE MODAL related
 */
const modalPage = ref<BookPage | null>(null)
const modalIndex = ref<number>(0)
const modalList = ref<BookPage[]>([])
// The dialog component exposes `.open()` through a template ref
const dialogRef = ref<InstanceType<typeof PageModal> | null>(null)

// Opens page dialog on click
function openDialog(initialPage: BookPage, initialIndex: number, list: BookPage[]) {
  modalPage.value = initialPage
  modalIndex.value = initialIndex
  modalList.value = list
  dialogRef.value?.open()
}

// Navigate between pages
const { toPreviousPage, toNextPage } = useNavigateBetweenPages(modalPage, modalIndex)
</script>

<template>
  <!-- LIST 2: SORTED -->
  <section class="page-array__two" @dragover.prevent @dragenter.prevent @drop.prevent="onDropList2">
    <h2>Sorted</h2>
    <p>Reorder the pages of the book by dragging them, or using the arrows.</p>
    <PageOrder :orderString="orderString" />
    <div class="page-array__card-list">
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
  <section class="page-array__one">
    <h2>Unsorted</h2>
    <p>Start ordering the pages by dragging them to the sorted section above.</p>
    <div class="page-array__card-list">
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
.page-array__one,
.page-array__two {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-m);
  background: var(--color-background-mute);
  border-radius: var(--border-radius);
  /* Updated through media queries */
  padding: var(--padding-s);
}
.page-array__card-list {
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

.page-array__one p,
.page-array__two p {
  color: var(--color-foreground);
}

/* MEDIA QUERIES */
@media (width > 568px) {
  .page-array__one,
  .page-array__two {
    padding: var(--padding-m);
    gap: var(--gap-l);
  }
  .page-array__card-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
