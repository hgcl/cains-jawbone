<script setup lang="ts">
import DropZones from '../components/DropZones/DropZones.vue'
</script>

<template>
  <main>
    <h1>Cain's Jawbone</h1>
    <DropZones />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
main {
  display: flex;
  flex-direction: column;
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
