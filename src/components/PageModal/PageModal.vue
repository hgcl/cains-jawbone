<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import type { BookPage } from '../types'

defineProps<{
  page: BookPage | null
}>()

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

// Expose methods to parent
defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialog" class="page-modal">
    <header class="page-modal__header">
      <h3 v-if="page">Page {{ page.id }}</h3>
      <button @click="close">Close</button>
    </header>
    <p v-if="page">{{ page.content }}</p>
  </dialog>
</template>

<style scoped>
.page-modal {
  inset: 0.5rem;
  margin: auto;
  border-radius: var(--border-radius);
  max-width: 600px;
  padding: var(--padding-l);
  /* Reset dialog styles */
  border: none;
}
.page-modal::backdrop {
  background-color: var(--color-backdrop);
}
.page-modal__header {
  display: flex;
  justify-content: space-between;
}
</style>
