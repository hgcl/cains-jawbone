<script setup lang="ts">
import { ref } from 'vue'
import bookJson from '../../assets/book.json'
import Card from '../../components/Card/Card.vue'
import { useDragDrop } from './DropZones.utils'
import type { BookPage } from '../../types'

// Initial list of items
const items = ref<BookPage[]>(bookJson)

// Index of the element being dragged over
let draggedOverIndexInit = ref<number | undefined>(undefined)

// Item being dragged
const draggingItem = ref<BookPage | null>(null) // preview array necessary, so that `items` is only updated on drop

const { listOne, previewListTwo, draggedOverIndex, startDrag, onDragEnter, onDragEnd, onDrop } =
  useDragDrop(items, draggedOverIndexInit, draggingItem)
</script>

<template>
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
    <div class="dropzone__card-list" id="dropzone-two">
      <template v-for="(item, index) in previewListTwo" :key="item.id">
        <div v-if="draggedOverIndex === index" class="preview-zone"></div>
        <div
          :class="`card-${item.id}`"
          draggable="true"
          @dragstart="startDrag($event, item)"
          @dragenter.prevent="onDragEnter(index)"
          @dragend="onDragEnd(item)"
          @drop.stop="onDrop($event, 2)"
        >
          <Card ref="page.id" :page="item" />
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.dropzone {
  padding: var(--padding-m);
  border-radius: var(--border-radius);
  background-color: var(--color-background-mute);
  margin-bottom: var(--gap-section);
  min-height: 200px;
}
.dropzone__card-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-m);
}
</style>
<style>
.preview-zone {
  background-color: var(--color-background);
  border: var(--border);
  border-radius: var(--border-radius);
  width: 200px;
  height: 296px;
  opacity: 0.6;
}
</style>
