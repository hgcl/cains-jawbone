<template>
  <TabsWrapper>
    <!-- LIST 1: UNSORTED -->
    <template #tab1>
      <div id="page-array__1">
        <p>
          Open a page of the book to read it, and start ordering the pages by moving them to the
          <em>Sorted pages</em> tab.
        </p>

        <!-- List of cards -->
        <div class="page-array__card-list">
          <div v-for="(item, index) in sortedList1" :key="item.id" class="card">
            <PagePreview :page="item" @open:dialog="openPageDialog(item, index, sortedList1)" />
          </div>
        </div>
      </div>
    </template>

    <!-- LIST 2: SORTED -->
    <template #tab2>
      <div id="page-array__2" @dragover.prevent @dragenter.prevent @drop.prevent="onDropList2">
        <p>
          Reorder the pages of the book by dragging them, using the arrows, or editing the field
          below.
        </p>
        <PageOrderInput :orderString="orderString" @update:orderstring="updateOrderString" />

        <!-- List of cards -->
        <div class="page-array__card-list">
          <!-- If no page yet, show instruction -->
          <div v-if="sortedList2.length < 1" class="page-array__empty-list-msg">
            <p>
              Add your first page to be sorted through the <em>Page order</em> field above, or by
              clicking on the <em>Sort</em> button inside each page.
            </p>
          </div>

          <!-- If pages were already added -->
          <div
            v-for="(item, index) in sortedList2"
            :key="item.id"
            class="card"
            draggable="true"
            @dragstart="onDragStart(item)"
            @dragover.prevent="onDragOverList2(index)"
          >
            <PagePreview
              :page="item"
              @open:dialog="openPageDialog(item, index, sortedList2)"
              @click:moveleft="moveLeft(item, index)"
              @click:moveright="moveRight(item, index)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- NOTES -->
    <template #tab3>
      <NotesView :notesList="notesList" @update:notesList="updateNotesList" />
    </template>
  </TabsWrapper>

  <!-- COMMON DIALOG -->
  <PageModal
    ref="pageDialogRef"
    :page="modalPage"
    :hasNavigation="true"
    @toggle:sorted="toggleSort(modalPage)"
    @click:nextpage="toNextPage"
    @click:previouspage="toPreviousPage"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import useMovePage from '../composables/useMovePages'
import useDragDropPages from '../composables/useDragDropPages'
import useSendPageToList from '../composables/useSendPageToList'
import useNavigateBetweenPages from '../composables/useNavigateBetweenPages'
import useOpenPageDialog from '../composables/useOpenPageDialog'
import useUpdateOrderString from '../composables/useUpdateOrderString'

import bookJson from '../assets/book.json'
import TabsWrapper from './TabsWrapper.vue'
import PagePreview from './PagePreview.vue'
import PageOrderInput from './PageOrderInput.vue'
import PageModal from './PageModal.vue'
import NotesView from './NotesView.vue'
import type { BookPage, Note } from '../types'

// Initial lists of items
const list1 = ref<BookPage[]>(bookJson.filter((i) => i.list === 1))
const list2 = ref<BookPage[]>(bookJson.filter((i) => i.list === 2))

/**
 * DRAG AND DROP (IN LIST 2)
 */
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
const { onDragStart, onDragOverList2, onDropList2 } = useDragDropPages(
  list2,
  draggedOverIndex,
  draggingItem,
)

// Send pages from "sorted" to "unsorted" list (or back)
const { toggleSort } = useSendPageToList(list1, list2)

// Move item up-down sorted list
const { moveLeft, moveRight } = useMovePage(list2, draggedOverIndex, draggingItem, onDropList2)

/**
 * PAGE MODAL
 */
const modalPage = ref<BookPage | null>(null)
const modalIndex = ref<number>(0)
const modalList = ref<BookPage[]>([])
// The dialog component exposes `.open()` through a template ref
const pageDialogRef = ref<InstanceType<typeof PageModal> | null>(null)

// Opens page dialog on click
const openPageDialog = useOpenPageDialog(modalPage, modalIndex, modalList, pageDialogRef)

// Navigate between pages
const { toPreviousPage, toNextPage } = useNavigateBetweenPages(modalPage, modalIndex, modalList)

/**
 * INPUT CONTROL
 */
// 1. updateOrderString() is called by `@update:orderstring="updateOrderString"` (emitted by PageOrderInput.vue)
// 2. It causes sortedList1, sortedList2, and orderString to be recomputed
const { updateOrderString } = useUpdateOrderString(list1, list2, bookJson)

/**
 * NOTES
 */
const notesList = ref<Note[]>([])
const notesListString = computed(() => JSON.stringify(notesList.value))

function updateNotesList(newNotesList: Note[]) {
  notesList.value = newNotesList
}

/**
 * LOCAL STORAGE
 */

// Local storage: pageOrder
// 1a. If user updates `orderString` (e.g. drag & drop, arrows, modal actions)
// 1b. If user updates page order input, updateOrderString() is called and `orderString` is recomputed
// 2. If `orderString` is updated, watcher updates the `pageOrder` local storage variable
// 3. On mount, updateOrderString() is called with the (parsed) local storage value => `orderString` is recomputed
const ORDER_STORAGE_KEY = 'pageOrder'

watch(orderString, (newVal) => {
  localStorage.setItem(ORDER_STORAGE_KEY, newVal)
})

onMounted(() => {
  const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY)
  if (!savedOrder) return

  // Transform string into type number[]
  const parsed = savedOrder.split(',').map(Number)

  updateOrderString(parsed)
})

// Local storage: notes
const NOTES_STORAGE_KEY = 'notes'

watch(notesListString, (newVal) => {
  localStorage.setItem(NOTES_STORAGE_KEY, newVal)
})

onMounted(() => {
  const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY)
  if (!savedNotes) return

  // Transform string into type Note[]
  const parsed = JSON.parse(savedNotes)

  updateNotesList(parsed)
})
</script>

<style scoped>
#page-array__1,
#page-array__2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-l);
}
.page-array__card-list {
  display: flex;
  justify-content: center;
  gap: var(--gap-m);
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
  min-height: calc(14 * 16px);
  width: 100%;
  /* Updated through media queries */
  flex-direction: column;
}

.page-array__empty-list-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--padding-m);
  color: var(--color-foreground);
  text-align: center;
  border: 1px dashed var(--color-foreground);
  border-radius: var(--border-radius);
  width: 100%;
}

#page-array__1 p,
#page-array__2 p {
  color: var(--color-foreground);
}

/* MEDIA QUERIES */
@media (width > 568px) {
  .page-array__card-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
