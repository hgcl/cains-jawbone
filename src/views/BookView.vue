<template>
  <div>
    <main id="main">
      <div class="header">
        <h1>Cain's Jawbone</h1>
        <BaseButton href="#getting-started" :variant="'secondary'">Getting started</BaseButton>
      </div>

      <BaseButton @click="openSearchModal" :iconBefore="searchSvg">Search content</BaseButton>
      <SearchModal ref="dialogRef" />
      <AppContent />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppFooter from '../components/AppFooter.vue'
import BaseButton from '../components/base/BaseButton.vue'
import SearchModal from '../components/SearchModal.vue'
import AppContent from '../components/AppContent.vue'
import searchSvg from '../assets/search-feathericons.svg'
import { ref, onMounted } from 'vue'

const dialogRef = ref<InstanceType<typeof SearchModal> | null>(null)

function openSearchModal() {
  dialogRef.value?.open()
}

// Integrate Boost Toad feedback system
onMounted(() => {
  const script = document.createElement('script')
  script.src =
    'https://www.boosttoad.com/api/widget/bundle?projectId=10c326b0-a71e-474c-bd87-a0024559fadf'
  script.async = true
  document.body.appendChild(script)
})
</script>

<style>
/* Main */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-xl);
  max-width: 1480px;
  background-color: var(--color-background);
  /* Updated through media queries */
  padding: var(--padding-m) var(--padding-xs);
}
main .header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-l);
}
h1 {
  text-align: center;
}

/* MEDIA QUERIES */
@media (width > 568px) {
  h1 {
    font-size: 10vw;
  }
  main {
    padding: var(--padding-m);
  }
}
@media (width > 800px) {
  main {
    padding: var(--padding-l);
  }
}
</style>
