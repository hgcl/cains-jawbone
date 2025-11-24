<script setup lang="ts">
import DropZones from './components/DropZones/DropZones.vue'
</script>

<template>
  <header>
    <!-- TODO -->
  </header>

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
}
</style>
