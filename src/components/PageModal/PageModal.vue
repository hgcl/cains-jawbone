<script setup lang="ts">
import { ref } from 'vue'
import type { BookPage } from '../../types'
import Button from '../Button/Button.vue'
import arrowLeft from '../../assets/arrow-left-feathericons.svg'
import arrowRight from '../../assets/arrow-right-feathericons.svg'

defineProps<{
  page: BookPage | null
}>()
const emit = defineEmits<{
  (e: 'clickNextPage', event: MouseEvent): void
  (e: 'clickPreviousPage', event: MouseEvent): void
}>()

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

// Expose methods to parent
defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="page-modal">
    <header class="page-modal__header">
      <h3 v-if="page">Page {{ page.id }}</h3>
      <Button class="page-modal__header__close-button" @click="close">Close</Button>
    </header>
    <p class="page-modal__content" v-if="page" v-html="page.content"></p>
    <div class="page-modal__buttons">
      <Button
        :variant="'secondary'"
        :iconBefore="arrowLeft"
        @click="(e) => emit('clickPreviousPage', e)"
        >Previous page</Button
      ><Button
        :variant="'secondary'"
        :iconAfter="arrowRight"
        @click="(e) => emit('clickNextPage', e)"
        >Next page</Button
      >
    </div>
  </dialog>
</template>

<style scoped>
.page-modal {
  /* Reset dialog styles */
  border: none;
  /* Custom styles */
  background-color: var(--color-background);
  color: var(--color-foreground);
  margin: auto;
  border-radius: var(--border-radius);
  max-width: 600px;
  padding: var(--padding-m);
}
.page-modal::backdrop {
  background-color: var(--color-backdrop);
}
.page-modal__header {
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: var(--gap-l);
}
.page-modal__header h3 {
  font-size: var(--font-size-heading-m);
  color: var(--color-accent);
  text-align: center;
}
.page-modal__header__close-button {
  align-self: flex-end;
}
.page-modal__content {
  font-family: var(--font-family-body);
  white-space: pre-line;
  margin-bottom: var(--gap-l);
}
.page-modal__buttons {
  display: flex;
  justify-content: space-between;
  gap: var(--gap-m);
}
</style>
