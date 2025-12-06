<script setup lang="ts">
import { ref } from 'vue'
import Button from '../Button/Button.vue'

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialog" class="modal">
    <header class="modal__header">
      <h2><slot name="heading"></slot></h2>
      <div class="modal__header__nav-buttons">
        <slot name="back"></slot>
        <Button class="modal__header__close-button" @click="close">Close</Button>
      </div>
    </header>
    <slot></slot>
  </dialog>
</template>

<style scoped>
.modal {
  /* Reset dialog styles */
  border: 1px solid var(--color-accent-subtle);
  /* Custom styles */
  background-color: var(--color-background);
  color: var(--color-foreground);
  margin: auto;
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 600px;
  padding: var(--padding-m) var(--padding-m) var(--padding-l) var(--padding-m);
}
.modal::backdrop {
  background-color: var(--color-backdrop);
}
.modal__header {
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: var(--gap-l);
}
.modal__header__nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--gap-s);
}
.modal__header h2 {
  font-size: var(--font-size-heading-m);
  color: var(--color-accent);
  text-align: center;
}
.modal__header__close-button {
  margin-left: auto;
}
</style>
