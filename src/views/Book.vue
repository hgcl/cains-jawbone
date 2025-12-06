<script setup lang="ts">
import Button from '../components/Button/Button.vue'
import SearchModal from '../components/SearchModal/SearchModal.vue'
import PagesOverview from '../components/PagesOverview/PagesOverview.vue'
import searchSvg from '../assets/search-feathericons.svg'
import { ref } from 'vue'

const dialogRef = ref<InstanceType<typeof SearchModal> | null>(null)

function openSearchModal() {
  dialogRef.value?.open()
}
</script>

<template>
  <main>
    <h1>Cain's Jawbone</h1>
    <Button @click="openSearchModal" :iconBefore="searchSvg">Search content</Button>
    <SearchModal ref="dialogRef" />
    <PagesOverview />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-l);
  max-width: 1480px;
  background-color: var(--color-background);
  /* Updated through media queries */
  padding: var(--padding-m) var(--padding-xs);
}

/* MEDIA QUERIES */
@media (width > 568px) {
  h1 {
    font-size: 10vw;
  }
  main {
    padding: var(--padding-m);
    gap: var(--gap-xl);
  }
}
@media (width > 800px) {
  main {
    padding: var(--padding-l);
  }
}
</style>
