<template>
  <main>
    <div>
      <h1>Cain's Jawbone</h1>
      <p>
        In 1934, Torquemada penned a gripping 100-page murder mystery... but there's a twist. The
        pages have been scrambled, and the story is arranged all wrong.
      </p>
      <p>
        Can you find the correct page order, uncover the secrets hidden within, and solve the
        chilling murders?
      </p>
      <Button :to="'/book'" :inverted="true">Open the book</Button>
    </div>
  </main>
</template>

<script setup lang="ts">
import Button from '../components/Button/Button.vue'
</script>

<style scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Vertically center */
  height: 100vh;
}
main > div {
  max-width: 464px;
  display: flex;
  flex-direction: column;
  gap: var(--gap-l);
  padding: var(--padding-l) var(--padding-m);
  font-size: var(--font-size-body-l);
  color: var(--color-on-accent);
  background-color: var(--color-accent);
}
h1 {
  font-size: var(--font-size-heading-xl);
  color: var(--color-background-alt);
}
</style>
