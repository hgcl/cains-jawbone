<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '../Button/Button.vue'
import Menu from '../Menu/Menu.vue'
import Modal from '../Modal/Modal.vue'
import PageModal from '../PageModal/PageModal.vue'
import ImportModal from '../ImportModal/ImportModal.vue'
import { expandAll, collapseAll, useAddNote, useExportFile } from './Notes.utils'
import type { BookPage, Note } from '@/types'
import trashSvg from '../../assets/trash-feathericons.svg'
import plusSvg from '../../assets/plus-feathericons.svg'
import bookJson from '../../assets/book.json'
import { useOpenDialog } from '../PagesOverview/PagesOverview.utils'

const { initialList } = defineProps<{ initialList: Note[] }>()

const allNotes: number[] = []
for (let i = 1; i < 101; i++) {
  allNotes.push(i)
}

// `currentList` contains the pages that already have notes
const currentList = ref<Note[]>(initialList)
const sortedCurrentList = computed(() => [...currentList.value].sort((a, b) => a.id - b.id))
// `unusedList` contains the pages that DON'T have notes
const unusedList = computed(() =>
  allNotes.filter((pageNumber) => !currentList.value.find((item) => item.id === pageNumber)),
)

/**
 * ADD/DELETE NOTE
 */

const addNoteModalRef = ref<InstanceType<typeof Modal> | null>(null)

function openAddNoteModal() {
  addNoteModalRef.value?.open()
}

const selectedPageNumber = ref<number | ''>('')
const { addNote, deleteNote } = useAddNote(selectedPageNumber, currentList, addNoteModalRef)

/**
 * IMPORT/EXPORT
 */

const importDialogRef = ref<InstanceType<typeof ImportModal> | null>(null)

const { exportFile, loadFile } = useExportFile(currentList, importDialogRef)

function openImportModal() {
  importDialogRef.value?.open()
}

/**
 * VIEW PAGE
 */
const modalPage = ref<BookPage | null>(null)
const modalIndex = ref<number>(0)
const modalList = ref<BookPage[]>([])
// The dialog component exposes `.open()` through a template ref
const pageDialogRef = ref<InstanceType<typeof PageModal> | null>(null)

const openDialog = useOpenDialog(modalPage, modalIndex, modalList, pageDialogRef)
</script>

<template>
  <div class="notes__header">
    <Button :iconBefore="plusSvg" @click="openAddNoteModal">Add note</Button>
    <Menu :label="'Import/export'">
      <button @keydown.enter="openImportModal" @click="openImportModal">Import notes</button>
      <button @keydown.enter="exportFile" @click="exportFile">Export notes</button>
    </Menu>
  </div>

  <div class="notes__expand-buttons">
    <Button :variant="'secondary'" @click="expandAll">Expand all</Button> /
    <Button :variant="'secondary'" @click="collapseAll">Collapse all</Button>
  </div>

  <!-- Accordion list of notes -->
  <details
    v-for="item in sortedCurrentList"
    :id="`note${item.id}`"
    class="note"
    :key="item.id"
    open
  >
    <summary class="note__summary">
      <span class="note__title">Page {{ item.id }}</span>
      <Menu :label="'More'">
        <button
          @keydown.enter="openDialog(bookJson[item.id - 1] as BookPage, item.id - 1, bookJson)"
          @click="openDialog(bookJson[item.id - 1] as BookPage, item.id - 1, bookJson)"
        >
          View page
        </button>
        <button @keydown.enter="deleteNote(item.id)" @click="deleteNote(item.id)">Delete</button>
      </Menu>
    </summary>
    <textarea class="note__textarea" v-model="item.note"></textarea>
  </details>

  <Modal ref="addNoteModalRef" fitContent>
    <div class="notes__add-page">
      <label for="add-note">Select a page number to add a note for it in the list</label>
      <select name="add-note" id="add-note" @change="addNote" v-model="selectedPageNumber">
        <option value="">Page number</option>
        <option v-for="item in unusedList" :value="item">{{ item }}</option>
      </select>
    </div>
  </Modal>
  <ImportModal ref="importDialogRef" @change:loadfile="loadFile" />

  <PageModal ref="pageDialogRef" :page="modalPage" />
</template>

<style scoped>
/* ALL NOTES */

.notes__header {
  display: flex;
  gap: var(--gap-m);
  align-items: start;
  justify-content: space-between;
  margin-bottom: var(--gap-l);
  /* Necessary for positioning the export button */
  position: relative;
}

.notes__add-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap-m);
  align-items: center;
}

.notes__expand-buttons > * {
  display: inline-block;
}

/* ONE NOTE */

.note {
  cursor: pointer;
  width: 100%;
  margin-top: var(--gap-m);
  border-bottom: 1px solid var(--color-accent-subtle);
}
.note__summary {
  /* Reset styles */
  list-style: none;
  /* Custom styles */
  color: var(--color-foreground);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-s);
  margin-bottom: var(--gap-s);
}
.note__summary::before {
  /* Add custom marker */
  content: '';
  width: 1.3em;
  height: 1.3em;
  mask: url('../../assets/chevron-right-feathericons.svg') no-repeat center/contain;
  background-color: var(--color-foreground);
}
.note__title {
  width: 100%;
  font-size: var(--font-size-body-s);
  font-weight: bold;
  text-transform: uppercase;
}
.note__textarea {
  max-width: 100%;
  min-width: 100%;
}

/* INTERACTIONS */

/* Update <details> custom marker */
.note:open .note__summary::before {
  mask-image: url('../../assets/chevron-down-feathericons.svg');
}
.note:open {
  border-bottom: none;
}
.note__textarea:not(:focus) {
  background-color: var(--color-background-mute);
}
</style>
