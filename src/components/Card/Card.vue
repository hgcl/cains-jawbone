<script setup lang="ts">
import { ref } from 'vue'
import PageModal from '../PageModal/PageModal.vue'
import Button from '../Button/Button.vue'
import type { BookPage } from '../../types'
import { truncateText, useOpenDialog } from './Card.utils'

defineProps<{
  page: BookPage
}>()

// Selected page that should be shown in the dialog
const selectedPage = ref<BookPage | null>(null)

// The dialog component exposes `.open()` through a template ref
const dialogRef = ref<InstanceType<typeof PageModal> | null>(null)

const openDialog = useOpenDialog(selectedPage, dialogRef)
</script>

<template>
  <article class="card">
    <p class="card__preview">
      <span v-html="truncateText(page.content, 'end')"></span> [...]
      <span v-html="truncateText(page.content, 'start')"></span>
    </p>
    <Button @click="openDialog(page)">View page {{ page.id }}</Button>
  </article>

  <PageModal ref="dialogRef" :page="selectedPage" />
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 296px;
  padding: var(--padding-m);
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  cursor: grab;
}
.card__preview {
  color: var(--color-foreground);
}

/* INTERACTIONS */
.card:active {
  cursor: grabbing;
}
</style>
