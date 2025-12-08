<script setup lang="ts">
import Button from '../Button/Button.vue'
import chevronDownSvg from '../../assets/chevron-down-feathericons.svg'
import { useSlots, cloneVNode } from 'vue'

const { label } = defineProps<{ label: string }>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const slots = useSlots()
</script>

<template>
  <div class="dropdown">
    <Button class="dropdown__button" :iconAfter="chevronDownSvg">{{ label }}</Button>
    <div class="dropdown__options">
      <!-- Every child used inside of the default slot will have an `onClick` handler -->
      <!-- `:is` can be any element (<button>, <a>, etc.) -->
      <template v-if="slots.default">
        <component
          v-for="(vnode, i) in slots.default()"
          :is="
            cloneVNode(vnode, {
              onClick: (e: MouseEvent) => {
                vnode.props?.onClick?.(e) // call original `@click` used on child
              },
            })
          "
          :key="i"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  display: inline-block;
  position: relative;
}
.dropdown__button {
  margin-bottom: var(--gap-xs);
}
.dropdown__options {
  display: none;
  position: absolute;
  width: 100%;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
}

.dropdown__options > * {
  /* Reset <button> styles */
  background-color: transparent;
  border: none;
  text-align: left;
  color: var(--color-foreground);
  text-decoration: none;
  /* Custom styles */
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-s);
  padding: var(--padding-xs);
  border-radius: var(--border-radius);
}

/* INTERACTIONS */

.dropdown:hover .dropdown__options,
.dropdown:focus-within .dropdown__options {
  display: flex;
  flex-direction: column;
}
.dropdown__options > *:hover,
.dropdown__options > *:focus {
  background-color: var(--color-background-mute);
}
</style>
