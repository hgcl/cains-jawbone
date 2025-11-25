<script setup lang="ts">
import { ref } from 'vue'
import PageModal from '../PageModal/PageModal.vue'
import Button from '../Button/Button.vue'
import type { BookPage } from '../../types'
import { truncateText, useOpenDialog } from './Card.utils'

defineProps<{
  page: BookPage
}>()
const emit = defineEmits<{
  (e: 'clickSendToSort', event: MouseEvent): void
  (e: 'clickSendToUnsorted', event: MouseEvent): void
}>()

// Selected page that should be shown in the dialog
const selectedPage = ref<BookPage | null>(null)

// The dialog component exposes `.open()` through a template ref
const dialogRef = ref<InstanceType<typeof PageModal> | null>(null)

const openDialog = useOpenDialog(selectedPage, dialogRef)
</script>

<template>
  <article class="card">
    <h3 class="card__page" v-if="page">Page {{ page.id }}</h3>
    <p class="card__preview">
      <span v-html="truncateText(page.content, 'end')"></span> [...]
      <span v-html="truncateText(page.content, 'start')"></span>
    </p>
    <div class="card__buttons">
      <Button @click="openDialog(page)">View</Button>
      <Button
        class="card__button_sort"
        v-if="page.list === 1"
        @click="(e) => emit('clickSendToSort', e)"
        >Sort<span aria-hidden="true"> &uarr;</span></Button
      >
      <Button
        class="card__button_remove"
        v-if="page.list === 2"
        @click="(e) => emit('clickSendToUnsorted', e)"
        >Remove<span aria-hidden="true"> &darr;</span></Button
      >
    </div>
  </article>

  <PageModal ref="dialogRef" :page="selectedPage" />
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--gap-m);
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  cursor: grab;
  /* Updated through media queries */
  width: 100%;
  padding: var(--padding-s);
}
.card__preview {
  color: var(--color-foreground);
}
.card__preview > span:last-of-type {
  /* Updated through media queries */
  display: none;
}
.card__buttons {
  display: flex;
  gap: var(--gap-m);
  justify-content: center;
}

/* INTERACTIONS */
.card:active {
  cursor: grabbing;
}

/* MEDIA QUERIES */
@media (width > 568px) {
  .card {
    height: 312px;
    width: 100%;
    max-width: 216px;
    padding: var(--padding-m);
  }
  .card__preview > span:last-of-type {
    display: unset;
  }
}
</style>
