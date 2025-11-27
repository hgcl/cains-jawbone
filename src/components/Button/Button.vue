<script setup lang="ts">
import { computed } from 'vue'

const {
  variant = 'primary',
  inverted = false,
  iconBefore,
  iconAfter,
  href,
  to,
} = defineProps<{
  variant?: 'primary' | 'secondary'
  inverted?: boolean
  iconBefore?: string
  iconAfter?: string
  href?: string
  to?: string
}>()
defineSlots<{
  default: string
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// Format CSS vars
const iconBeforeStyles = computed(() => ({
  mask: iconBefore ? `url("${iconBefore}") no-repeat center` : '',
}))
const iconAfterStyles = computed(() => ({
  mask: iconAfter ? `url("${iconAfter}") no-repeat center` : '',
}))
const invertedClass = computed(() => (inverted ? 'button__inverted' : ''))

// Determine which component to render
const linkComponent = computed(() => {
  // If there's a `to` prop, render as a <router-link>
  if (to) {
    return 'router-link'
  }
  // If there's an `href` prop, render as an <a> tag
  if (href) {
    return 'a'
  }
  // Otherwise, render as a <button>
  return 'button'
})
</script>

<template>
  <component
    :is="linkComponent"
    :to="to"
    @click="(e: MouseEvent) => emit('click', e)"
    :class="[`button button__${variant} ${invertedClass}`]"
  >
    <div v-if="iconBefore" :style="iconBeforeStyles" class="button__icon button__icon_before"></div>
    <slot>Label needed</slot>
    <div v-if="iconAfter" :style="iconAfterStyles" class="button__icon button__icon_after"></div>
  </component>
</template>

<style scoped>
.button {
  /* Reset styles */
  border: 0;
  padding: 0;
  font-family: unset;
  font-size: var(--font-size-body-s);
  text-decoration: none;
  /* Ċustom styles */
  transition: background-color 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
  color: var(--color-accent);
  /* Different when inverted */
  background-color: transparent;
}
.button__primary {
  border: 1px solid var(--color-accent-subtle);
}

.button__inverted {
  background-color: var(--color-on-accent);
  border: 1px solid var(--color-on-accent);
}

.button__icon {
  background-color: var(--color-accent);
  width: 24px;
  height: 24px;
  transform: scale(80%);
}

/* INTERACTIONS */
.button__primary:hover,
.button__primary:focus {
  color: var(--color-on-accent);
  background-color: var(--color-accent);
}
.button__secondary:hover,
.button__secondary:focus {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}
.button__primary:hover > .button__primary,
.button__primary:focus > .button__icon {
  background-color: var(--color-on-accent);
}
</style>
