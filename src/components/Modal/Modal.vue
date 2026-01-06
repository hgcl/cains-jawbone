<template>
  <dialog ref="dialog" class="modal" :class="fixedWidthClass">
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import Button from '../Button/Button.vue'

const { fitContent } = defineProps<{ fitContent?: boolean }>()

const fixedWidthClass = computed(() => (!fitContent ? 'modal__fixed-width' : ''))

const dialog = ref<HTMLDialogElement | null>(null)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

defineExpose({ open, close })
</script>

<style scoped>
.modal {
  /* Reset dialog styles */
  border: var(--border);
  /* Custom styles */
  background-color: var(--color-background);
  color: var(--color-foreground);
  margin: auto;
  border-radius: var(--border-radius);
  padding: var(--padding-m) var(--padding-m) var(--padding-l) var(--padding-m);
}
.modal__fixed-width {
  width: 100%;
  max-width: 600px;
}

.modal > *:not(:last-child) {
  margin-bottom: var(--gap-m);
}
.modal__fixed-width > *:not(:last-child) {
  margin-bottom: var(--gap-l);
}

.modal::backdrop {
  background-color: var(--color-backdrop);
}
.modal__header {
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: var(--gap-s);
}
.modal__header__nav-buttons {
  display: flex;
  justify-content: space-between;
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
