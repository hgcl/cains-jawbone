<script setup lang="ts">
import { ref, defineExpose } from 'vue'

defineProps<{
  page: { number: number; content: string } | null
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
  <dialog ref="dialog" class="pageModal">
    <header class="pageModal__header">
      <h3 v-if="page">Page {{ page.number }}</h3>
      <button @click="close">Close</button>
    </header>
    <p v-if="page">{{ page.content }}</p>
  </dialog>
</template>

<style scoped>
.pageModal {
  inset: 0.5rem;
  margin: auto;
  border-radius: var(--border-radius);
  max-width: 600px;
  padding: var(--padding-l);
  /* Reset dialog styles */
  border: none;
}
.pageModal::backdrop {
  background-color: var(--color-backdrop);
}
.pageModal__header {
  display: flex;
  justify-content: space-between;
}
</style>
