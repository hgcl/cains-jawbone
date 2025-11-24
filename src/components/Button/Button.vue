<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button @click="(e) => emit('click', e)">
    <slot />
  </button>
</template>

<style scoped>
button {
  /* Reset styles */
  border: 0;
  padding: 0;
  font-family: unset;
  /* Ċustom styles */
  cursor: pointer;
  color: var(--color-accent);
  text-transform: uppercase;
  font-weight: bold;
  background: transparent;
  border: 1px solid var(--color-accent-subtle);
  border-radius: var(--border-radius);
  padding: var(--padding-s);
}

/* INTERACTIONS */
button:hover {
  color: var(--color-on-accent);
  background: var(--color-accent);
}
</style>
