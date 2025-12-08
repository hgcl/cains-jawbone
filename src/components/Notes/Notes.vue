<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '../Button/Button.vue'
import Dropdown from '../Dropdown/Dropdown.vue'
import type { Note } from '@/types'
import trashSvg from '../../assets/trash-feathericons.svg'
import { expandAll, collapseAll, useAddNote, useExportFile } from './Notes.utils'

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
const selectedPageNumber = ref<number | ''>('')
const { addNote, deleteNote } = useAddNote(selectedPageNumber, currentList)

/**
 * IMPORT/EXPORT
 */
const { exportFile, loadFile } = useExportFile(currentList)

function openImportModal() {}
</script>

<template>
  <div class="notes__header">
    <!-- <input type="file" id="fileUpload" accept="application/json" @change="loadFile" /> -->
    <Dropdown :label="'Import/export'">
      <button @click="openImportModal">Import notes</button>
      <button @click="exportFile">Export notes</button>
    </Dropdown>
    <div class="notes__add-page">
      <label for="add-note">Add note for</label>
      <select name="add-note" id="add-note" @change="addNote" v-model="selectedPageNumber">
        <option value="">Page number</option>
        <option v-for="item in unusedList" :value="item">{{ item }}</option>
      </select>
    </div>
    <div class="notes__expand-buttons">
      <Button :variant="'secondary'" @click="expandAll">Expand all</Button> /
      <Button :variant="'secondary'" @click="collapseAll">Collapse all</Button>
    </div>
  </div>
  <details
    v-for="item in sortedCurrentList"
    :id="`note${item.id}`"
    class="note"
    :key="item.id"
    open
  >
    <summary class="note__summary">
      <span class="note__title">Page {{ item.id }}</span>
      <Button class="note__delete-button" :iconBefore="trashSvg" @click="deleteNote(item.id)"
        >Delete</Button
      >
    </summary>
    <textarea class="note__textarea" v-model="item.note"></textarea>
  </details>
</template>

<style scoped>
/* ALL NOTES */

.notes__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--gap-l);
  /* Necessary for positioning the export button */
  position: relative;
}

.notes__add-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap-s);
  align-items: center;
  margin-bottom: var(--gap-l);
}
.notes__add-page label {
  text-transform: uppercase;
  font-weight: bold;
  font-size: var(--font-size-body-s);
  color: var(--color-accent);
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
  background-color: var(--color-accent);
}
.note__title {
  width: 100%;
  font-size: var(--font-size-body-s);
  font-weight: bold;
  text-transform: uppercase;
}
.note__delete-button {
  /* Button will be made visible on hover/focus */
  opacity: 0;
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

.note__summary:hover .note__delete-button,
.note__summary:focus .note__delete-button {
  /* Show delete button */
  opacity: 1;
}

.note__textarea:not(:focus) {
  background-color: var(--color-background-mute);
}
</style>
