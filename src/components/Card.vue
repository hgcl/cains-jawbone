<script setup lang="ts">
import { ref } from 'vue'
import PageModal from './PageModal.vue'
import type { BookPage } from './types'

defineProps<{
  page: BookPage
}>()

// Selected page that should be shown in the dialog
const selectedPage = ref<BookPage | null>(null)

// The dialog component exposes `.open()` through a template ref
const dialogRef = ref<InstanceType<typeof PageModal> | null>(null)

function openDialog(page: BookPage) {
  selectedPage.value = page
  dialogRef.value?.open() // Call dialog.showModal() internally
}

function truncate(string: string, truncatePosition: 'start' | 'end') {
  let subString = string
  if (truncatePosition === 'end') {
    subString = string.slice(0, 60)
    return string.slice(0, subString.lastIndexOf(' '))
  }
  if (truncatePosition === 'start') {
    subString = string.slice(string.length - 60)
    return string.slice(subString.indexOf(' ') - 60)
  }
}
</script>

<template>
  <article class="card">
    <h3 class="card__page">Page {{ page.id }}</h3>
    <p class="card__preview">
      {{ truncate(page.content, 'end') }} [...] {{ truncate(page.content, 'start') }}
    </p>
    <button class="card__button" @click="openDialog(page)">View page</button>
  </article>

  <PageModal ref="dialogRef" :page="selectedPage" />
</template>

<style scoped>
.card {
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 296px;
  padding: var(--padding-m);
  cursor: pointer;
}
.card__page {
  font-weight: bold;
}
.card__preview {
  font-family: var(--font-family-serif);
  color: var(--color-text-mute);
}
</style>
