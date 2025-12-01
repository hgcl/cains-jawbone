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
  useOpenDialog,
  useSendToList,
  useSelectTab,
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
const toggleSorted = useSendToList(list1, list2)

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
const openDialog = useOpenDialog(modalPage, modalIndex, modalList, dialogRef)

// Navigate between pages
const { toPreviousPage, toNextPage } = useNavigateBetweenPages(modalPage, modalIndex)

/**
 * TABS
 */
const selectedIndex = ref(0)
const tabs = [{ title: 'Unsorted pages' }, { title: 'Sorted pages' }]

const { selectTab, switchTab } = useSelectTab(selectedIndex)
</script>

<template>
  <div>
    <ul role="tablist">
      <li role="presentation" v-for="(tab, index) in tabs" :key="tab.title">
        <button
          role="tab"
          :id="`tab${index + 1}`"
          :tabindex="selectedIndex === index ? 0 : -1"
          :aria-selected="selectedIndex === index ? true : false"
          @keydown="switchTab($event, index)"
          @click="selectTab(index)"
        >
          {{ tab.title }}
        </button>
      </li>
    </ul>
    <!-- LIST 1: UNSORTED -->
    <section id="page-array__1" role="tabpanel" aria-labelledby="tab1" v-if="selectedIndex === 0">
      <p>Start ordering the pages by moving them to the "Sorted pages" tab.</p>
      <div class="page-array__card-list">
        <div v-for="(item, index) in sortedList1" :key="item.id" class="card">
          <Card
            :page="item"
            @clickOpenDialog="openDialog(item, index, sortedList1)"
            @toggleSorted="toggleSorted(item, $event)"
          />
        </div>
      </div>
    </section>

    <!-- LIST 2: SORTED -->
    <section
      id="page-array__2"
      role="tabpanel"
      aria-labelledby="tab2"
      v-if="selectedIndex === 1"
      @dragover.prevent
      @dragenter.prevent
      @drop.prevent="onDropList2"
    >
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
            @toggleSorted="toggleSorted(item, $event)"
            @clickMoveLeft="moveLeft(item, index)"
            @clickMoveRight="moveRight(item, index)"
          />
        </div>
      </div>
    </section>
  </div>

  <!-- COMMON DIALOG -->
  <PageModal
    ref="dialogRef"
    :page="modalPage"
    @clickNextPage="toNextPage(modalIndex, modalList)"
    @clickPreviousPage="toPreviousPage(modalIndex, modalList)"
  />
</template>

<style scoped>
#page-array__1,
#page-array__2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-l);
  background: var(--color-background-mute);
  border: 1px solid var(--color-accent-subtle);
  border-radius: var(--border-radius);
  /* Updated through media queries */
  padding: var(--padding-m) var(--padding-s);
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

#page-array__1 p,
#page-array__2 p {
  color: var(--color-foreground);
}

/* Tabs */
[role='tablist'] {
  /* Reset styles */
  list-style-type: none;
  padding: 0;
  /* Custom styles */
  display: flex;
}
[role='tablist'] li button {
  /* Reset styles */
  font-family: var(--font-family-body);
  text-decoration: none;
  color: var(--color-accent);
  /* Custom styles */
  cursor: pointer;
  display: block;
  padding: var(--padding-s);
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-background-mute);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  text-transform: uppercase;
  font-size: var(--font-size-body-s);
  font-weight: bold;
  position: static;
}
[role='tablist'] [aria-selected='true'] {
  border-color: var(--color-accent-subtle) var(--color-accent-subtle) var(--color-background-mute)
    var(--color-accent-subtle);
  /* Necessary to hide the top border of the panel */
  position: relative;
  top: 2px;
}

/* MEDIA QUERIES */
@media (width > 568px) {
  #page-array__1,
  #page-array__2 {
    padding: var(--padding-l) var(--padding-m);
  }
  .page-array__card-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
