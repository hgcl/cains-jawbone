<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  icon?: string
}>()
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const cssVars = computed(() => ({
  mask: props.icon ? `url("${props.icon}") no-repeat center` : '',
}))
</script>

<template>
  <button @click="(e) => emit('click', e)">
    <div v-show="props.icon" :style="cssVars" class="button__icon"></div>
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
  border: 1px solid var(--color-accent-subtle);
  border-radius: var(--border-radius);
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
