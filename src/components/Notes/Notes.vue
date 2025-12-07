<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '../Button/Button.vue'
import type { Note } from '../../types'

const { initialList } = defineProps<{ initialList: Note[] }>()

const allNotes: number[] = []
for (let i = 1; i < 101; i++) {
  allNotes.push(i)
}

const currentList = ref(initialList)
const unusedList = computed(() =>
  allNotes.filter((pageNumber) => !currentList.value.find((item) => item.id === pageNumber)),
)

const selectedPageNumber = ref<number | ''>('')

function addNote() {
  if (!selectedPageNumber.value) return

  // Add page note to currentList, and reorder it by `id`
  currentList.value.push({ id: selectedPageNumber.value, note: '' })
  currentList.value.sort((a, b) => a.id - b.id)

  // Reset
  // TODO: why doesn't the select field reset?
  selectedPageNumber.value = ''
}

function exportNotes() {
  console.log(currentList.value)

  // Transform into JSON
  // const json = JSON.stringify(currentList.value)
}
</script>

<template>
  <div class="notes__header">
    <div class="notes__add-page">
      <label for="add-note">Add a note for page</label>
      <select name="add-note" id="add-note" @change="addNote" v-model="selectedPageNumber">
        <option disabled value="">Page number</option>
        <option v-for="item in unusedList" :value="item">{{ item }}</option>
      </select>
    </div>
    <Button @click="exportNotes">Export notes</Button>
  </div>
  <details class="note" v-for="item in currentList" :key="item.id" open>
    <summary class="note__summary">
      <span class="note__title">Page {{ item.id }}</span>
    </summary>
    <textarea v-model="item.note"></textarea>
  </details>
</template>

<style scoped>
.notes__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--gap-l);
}
.notes__add-page {
  display: flex;
  gap: var(--gap-s);
  align-items: center;
}
.notes__add-page label {
  text-transform: uppercase;
  font-weight: bold;
  font-size: var(--font-size-body-s);
  color: var(--color-accent);
}

.note {
  cursor: pointer;
  width: 100%;
  /* Necessary for positioning `.note__save-button` */
  position: relative;
}
.note__summary {
  height: 2rem;
  margin-bottom: var(--padding-xs);
}
.note__title {
  font-size: var(--font-size-body-s);
  font-weight: bold;
  text-transform: uppercase;
}

textarea {
  font-family: var(--font-family-body);
  width: 100%;
  padding: var(--padding-xs);
}

/* INTERACTIONS */
.note .note__save-button {
  display: none;
  position: absolute;
  right: 0;
}
.note:open .note__save-button {
  display: inline;
}
</style>
