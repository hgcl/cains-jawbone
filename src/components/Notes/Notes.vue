<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import Button from '../Button/Button.vue'
import type { Note } from '../../types'
import trashSvg from '../../assets/trash-feathericons.svg'

const { initialList } = defineProps<{ initialList: Note[] }>()

const allNotes: number[] = []
for (let i = 1; i < 101; i++) {
  allNotes.push(i)
}

// `currentList` contains the pages that already have notes
const currentList = ref(initialList)
const sortedCurrentList = computed(() => [...currentList.value].sort((a, b) => a.id - b.id))
// `unusedList` contains the pages that DON'T have notes
const unusedList = computed(() =>
  allNotes.filter((pageNumber) => !currentList.value.find((item) => item.id === pageNumber)),
)

const selectedPageNumber = ref<number | ''>('')

/**
 * ADD/DELETE NOTES
 */
async function addNote() {
  if (!selectedPageNumber.value) return

  // Add page note to currentList, and reorder it by `id`
  currentList.value.push({ id: selectedPageNumber.value, note: '' })

  // Scroll into view after waiting for the DOM
  await nextTick()
  const noteEl = document.getElementById(`note${selectedPageNumber.value}`)
  const textAreaEl = noteEl?.querySelector('textarea')
  noteEl?.scrollIntoView({ behavior: 'smooth' })

  // Focus on textarea
  setTimeout(() => textAreaEl?.focus(), 600)

  // Reset
  selectedPageNumber.value = ''

  console.log(currentList.value)
}
function deleteNote(pageNumber: number) {
  // Remove page note from currentList, and reorder it by `id`
  currentList.value = currentList.value.filter((item) => item.id !== pageNumber)

  // Warning message before deletion
  confirm(`Are you sure you'd like to delete the note for page ${pageNumber}?`)
}

/**
 * EXPAND/COLLAPSE
 */
function expandAll() {
  const detailsEls = document.querySelectorAll('details')
  for (let detail of detailsEls) {
    detail.open = true
  }
}
function collapseAll() {
  const detailsEls = document.querySelectorAll('details')
  for (let detail of detailsEls) {
    detail.open = false
  }
}

/**
 * IMPORT/EXPORT
 */
function exportNotes() {
  // Transform form into JSON
  const filename = 'cains-jawbone.json'
  const jsonStr = JSON.stringify(currentList.value)

  // Create download link
  let element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)

  // Click download link
  element.click()

  // Remove from DOM
  document.body.removeChild(element)
}
function loadFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = (event) => {
    try {
      const text = event.target?.result as string
      const parsedJson = JSON.parse(text)

      currentList.value = parsedJson
    } catch (err) {
      console.error('Invalid JSON file', err)
    }
  }

  // Read the file:
  // This starts the asynchronous process of reading the file as a text string. When the file is fully read, the FileReader triggers the `onload` event above.
  reader.readAsText(file)
}
</script>

<template>
  <div class="notes__header">
    <input type="file" id="fileUpload" accept="application/json" @change="loadFile" />
    <Button class="notes__export-button" @click="exportNotes">Export notes</Button>
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
