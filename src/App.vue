<script setup lang="ts">
import json from '../src/assets/bookPages.json'
import Card from './components/Card.vue'
</script>

<template>
  <header>
    <!-- TODO -->
  </header>

  <main>
    <div class="cardContainer">
      <Card :pages="json" />
    </div>
  </main>
</template>

<style scoped>
/* TODO */
</style>
