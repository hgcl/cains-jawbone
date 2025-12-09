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
  maskImage: iconBefore ? `url("${iconBefore}")` : '',
}))
const iconAfterStyles = computed(() => ({
  maskImage: iconAfter ? `url("${iconAfter}")` : '',
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
    :href="href"
    @click="(e: MouseEvent) => emit('click', e)"
    :class="[`button button__${variant} ${invertedClass}`]"
  >
    <div
      v-if="iconBefore"
      :style="iconBeforeStyles"
      class="button__icon button__icon_before"
      aria-hidden="true"
    ></div>
    <slot>Label needed</slot>
    <div
      v-if="iconAfter"
      :style="iconAfterStyles"
      class="button__icon button__icon_after"
      aria-hidden="true"
    ></div>
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
  gap: var(--gap-xs);
  width: fit-content;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: var(--border-radius);
  color: var(--color-accent);
  /* Different when inverted */
  background-color: transparent;
}
.button__primary {
  border: 1px solid var(--color-accent-subtle);
  padding: var(--padding-xs);
}
.button__secondary,
.button__secondary {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}

.button__inverted {
  background-color: var(--color-on-accent);
  border: 1px solid var(--color-on-accent);
}

.button__icon {
  background-color: var(--color-accent);
  width: 1.3em;
  height: 1.3em;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

/* INTERACTIONS */
.button__primary:hover,
.button__primary:focus {
  color: var(--color-on-accent);
  background-color: var(--color-accent);
}
.button__primary:hover > .button__icon,
.button__primary:focus > .button__icon {
  background-color: var(--color-on-accent);
}
</style>
