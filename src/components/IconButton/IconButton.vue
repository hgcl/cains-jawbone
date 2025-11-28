<script setup lang="ts">
import { computed } from 'vue'

const { icon } = defineProps<{
  icon: string
}>()
defineSlots<{
  default: string
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const iconStyles = computed(() => ({
  mask: icon ? `url("${icon}") no-repeat center` : '',
}))
</script>

<template>
  <button @click="(e) => emit('click', e)">
    <div v-if="icon" :style="iconStyles" class="button__icon"></div>
    <!-- The label displays as a tooltip on hover -->
    <span class="button__label"><slot>Label needed</slot></span>
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
  display: flex;
  align-items: center;
  gap: var(--gap-xs);
  color: var(--color-accent);
  text-transform: uppercase;
  background: transparent;
  padding: var(--padding-xs);
  border: 1px solid var(--color-accent-subtle);
  border-radius: 1000px;
  /* Necessary for .button__label positioning */
  position: relative;
}

.button__icon {
  background-color: var(--color-accent);
  width: 24px;
  height: 24px;
  transform: scale(80%);
}

.button__label {
  opacity: 0;
  transition: opacity 0.3s;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -100%;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
  color: var(--color-foreground);
  background: var(--color-background);
  font-size: var(--font-size-body-s);
  font-weight: bold;
  white-space: nowrap;
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

button:hover > .button__label,
button:focus > .button__label {
  opacity: 1;
}
</style>
