<script setup lang="ts">
import { ref } from 'vue'
import PageModal from './PageModal.vue'

defineProps<{
  pages: { number: number; content: string }[]
}>()

// Selected page that should be shown in the dialog
const selectedPage = ref<{ number: number; content: string } | null>(null)

// The dialog component exposes `.open()` through a template ref
const dialogRef = ref<InstanceType<typeof PageModal> | null>(null)

function openDialog(page: { number: number; content: string }) {
  selectedPage.value = page
  dialogRef.value?.open() // Call dialog.showModal() internally
}
</script>

<template>
  <article class="card" v-for="page in pages" :key="page.number">
    <h3 class="card__page">Page {{ page.number }}</h3>
    <p class="card__preview">{{ page.content.slice(0, 60) }}...</p>
    <button class="card__button" @click="openDialog(page)">View page</button>
  </article>

  <PageModal ref="dialogRef" :page="selectedPage" />
</template>

<style scoped>
.card {
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--background-color-mute);
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 200px;
  padding: var(--padding-m);
}
.card__page {
  font-weight: bold;
}
.card__preview {
  color: var(--color-text-mute);
}
.card__button {
}
</style>
