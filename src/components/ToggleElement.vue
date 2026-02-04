<template>
  <label>
    <input type="checkbox" :checked="isChecked" @change="onChange" class="visually-hidden" />
    <div v-if="isChecked" :style="iconCheckedStyles" class="toggle__icon" aria-hidden="true"></div>
    <div
      v-if="!isChecked"
      :style="iconUncheckedStyles"
      class="toggle__icon"
      aria-hidden="true"
    ></div>

    <span><slot>Label needed</slot></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { isChecked, iconUnchecked, iconChecked } = defineProps<{
  isChecked: boolean
  iconUnchecked?: string
  iconChecked?: string
}>()
defineSlots<{
  default: string
}>()

const emit = defineEmits<{
  (e: 'update:isChecked', value: boolean): void
}>()

function onChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:isChecked', checked)
}

// Format CSS vars
const iconUncheckedStyles = computed(() => ({
  maskImage: iconUnchecked ? `url("${iconUnchecked}")` : '',
}))
const iconCheckedStyles = computed(() => ({
  maskImage: iconChecked ? `url("${iconChecked}")` : '',
}))
</script>

<style scoped>
label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--gap-s);
}
label span {
  font-size: var(--font-size-body-s);
  text-transform: uppercase;
}
.toggle__icon {
  background-color: var(--color-accent);
  width: 1.3em;
  height: 1.3em;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

/* INTERACTIONS */

label:hover span,
label:focus-within span {
  text-decoration: underline;
  text-underline-offset: 0.25em;
}
</style>
