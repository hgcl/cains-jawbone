<script setup lang="ts">
import { computed } from 'vue'

const { variant = 'primary', icon } = defineProps<{
  variant?: 'primary' | 'secondary'
  icon?: string
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const cssVars = computed(() => ({
  mask: icon ? `url("${icon}") no-repeat center` : '',
}))
</script>

<template>
  <button @click="(e) => emit('click', e)" :class="[`button__${variant}`]">
    <div v-show="icon" :style="cssVars" class="button__icon"></div>
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  /* Reset styles */
  border: 0;
  padding: 0;
  font-family: unset;
  font-size: var(--font-size-body-s);
  /* Ċustom styles */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-accent);
  text-transform: uppercase;
  font-weight: bold;
  background: transparent;
  border-radius: var(--border-radius);
}
.button__primary {
  border: 1px solid var(--color-accent-subtle);
  padding: var(--padding-xs);
}
button > .button__icon {
  background-color: var(--color-accent);
  width: 24px;
  height: 24px;
  transform: scale(80%);
}

/* INTERACTIONS */
button:hover,
button:focus {
  color: var(--color-on-accent);
  background-color: var(--color-accent);
}
button:hover > .button__icon,
button:focus > .button__icon {
  background-color: var(--color-on-accent);
}
</style>
