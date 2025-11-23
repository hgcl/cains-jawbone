<script setup lang="ts">
import bookJson from '../src/assets/book.json'
import Card from './components/Card.vue'
import { computed, ref } from 'vue'
import type { BookPage } from './components/types'

/**
 * DRAG AND DROP FEATURE
 * Using HTML Drag and Drop API https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
 */

// Reactive array of items
const items = ref<BookPage[]>(bookJson)

// Computed filtered lists
// list 1: default, list 2: unsorted
const listOne = computed(() => items.value.filter((item) => item.list === 1))
const listTwo = computed(() => items.value.filter((item) => item.list === 2))

// Drag start handler
function startDrag(evt: DragEvent, item: BookPage) {
  // Check that there is a `DataTransfer` object which contains the drag event's data
  if (!evt.dataTransfer) return
  // `effectAllowed`: what the drag source allows
  evt.dataTransfer.effectAllowed = 'move'
  // `dropEffect`: what the drop target does
  evt.dataTransfer.dropEffect = 'move'
  // Attach item id as string to the drag event
  evt.dataTransfer.setData('itemID', item.id.toString())
}

// On drop handler
function onDrop(evt: DragEvent, targetList: number) {
  if (!evt.dataTransfer) return
  // Retrieve value previously attached to drag event
  const idStr = evt.dataTransfer.getData('itemID')
  // Convert id back to a number
  const id = Number(idStr)
  // Find the matching item in original `items` array
  const found = items.value.find((i) => i.id === id)
  // Move `found` item into the new target list
  if (found) {
    found.list = targetList
  }
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
      <div class="dropzone__card-list">
        <div
          v-for="item in listTwo"
          :key="item.id"
          draggable="true"
          @dragstart="startDrag($event, item)"
        >
          <Card ref="page.id" :page="item" />
        </div>
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
}
.dropzone__card-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-m);
}
</style>
