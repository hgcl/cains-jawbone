<script setup lang="ts">
import Button from '../Button/Button.vue'
import chevronDownSvg from '../../assets/chevron-down-feathericons.svg'
import { useSlots, cloneVNode, ref, onMounted, onBeforeUnmount } from 'vue'

const { label } = defineProps<{ label: string }>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const slots = useSlots()

/**
 * MENU NAVIGATION
 */
let isMenuOpen = ref<boolean>(false)

// Keyboard interactions for menu button
function handleKeydownMenu(event: KeyboardEvent) {
  const { key } = event
  const openKeys = ['Enter', ' ', 'ArrowDown']
  const closeKeys = ['Escape', 'ArrowUp', 'Tab']

  if (key !== 'Tab') {
    event.preventDefault()
  }

  // Recap of keyboard interactions:
  // https://inclusive-components.design/menus-menu-buttons/#keyboardandfocusbehavior

  // Opens the menu and focus on first item
  if (!isMenuOpen.value && openKeys.includes(key)) {
    toggleMenu()
  }

  // Moves focus to the first menu item
  if (isMenuOpen.value && key === 'ArrowDown') {
    const firstItem = document.querySelector('#menu__options')?.firstElementChild?.firstElementChild
    ;(firstItem as HTMLElement).focus()
  }

  // Closes menu
  if (isMenuOpen.value && closeKeys.includes(key)) {
    toggleMenu()
  }
}

// Keyboard interactions for menu items
function handleKeydownItem(event: KeyboardEvent, index: number) {
  const { key } = event
  const closeKeys = ['Escape', 'Tab']

  if (key !== 'Tab') {
    event.preventDefault()
  }

  // Moves focus to the next menu item, or the first menu item if you’re on the last one
  if (isMenuOpen.value && key === 'ArrowDown') {
    const listItems = document.querySelectorAll('#menu__options > li')
    const nextItem = listItems[index + 1]?.firstElementChild

    // Move focus to first item if we are currently on the last one
    if (index + 1 >= listItems.length) {
      const firstItem =
        document.querySelector('#menu__options')?.firstElementChild?.firstElementChild
      ;(firstItem as HTMLElement).focus()
    }

    ;(nextItem as HTMLElement).focus()
  }

  // Moves focus to the previous menu item, or the last menu item if you’re on the first one
  if (isMenuOpen.value && key === 'ArrowUp') {
    const listItems = document.querySelectorAll('#menu__options > li')
    const previousItem = listItems[index - 1]?.firstElementChild

    // Move focus to last item if we are currently on the first one
    if (index - 1 <= 0) {
      const lastItem = document.querySelector('#menu__options')?.lastElementChild?.firstElementChild
      ;(lastItem as HTMLElement).focus()
    }

    ;(previousItem as HTMLElement).focus()
  }

  // Closes menu
  if (isMenuOpen.value && closeKeys.includes(key)) {
    toggleMenu()
  }
}

function toggleMenu() {
  // Toggle the `aria-expanded` state from true to false (and vice-versa)
  isMenuOpen.value = !isMenuOpen.value
  console.log('>>> MENU OPEN: ', isMenuOpen.value)
}

// Close menu when click outside of it
function handleClickOutside(event: MouseEvent) {
  const menuContainer = document.querySelector('.menu')

  // `menuContainer.contains(someNode)` checks whether that node is somewhere inside `.menu`
  if (isMenuOpen.value && menuContainer && !menuContainer.contains(event.target as Node)) {
    toggleMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<!-- ACCESSIBLE MENU -->
<!-- Source: https://inclusive-components.design/menus-menu-buttons/ -->
<template>
  <div class="menu">
    <Button
      aria-controls="menu-options"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      @click="toggleMenu"
      @keydown="handleKeydownMenu($event)"
      class="menu__button"
      :iconAfter="chevronDownSvg"
      >{{ label }}</Button
    >
    <ul id="menu__options" v-if="isMenuOpen">
      <!-- Every child used inside of the default slot will have an `onClick` handler -->
      <template v-if="slots.default">
        <li v-for="(vnode, index) in slots.default()">
          <component
            tabindex="-1"
            @keydown="handleKeydownItem($event, index)"
            :is="cloneVNode(vnode)"
            :key="index"
          >
          </component>
        </li>
      </template>
    </ul>
  </div>
</template>

<style scoped>
.menu {
  position: relative;
}
.menu__button {
  margin-bottom: var(--gap-xs);
}
#menu__options {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
}

#menu__options > li {
  /* Reset styles */
  list-style-type: none;
  /* Custom styles */
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-s);
}
#menu__options > li > * {
  /* Reset <button> and <a> styles */
  background-color: transparent;
  border: none;
  text-align: left;
  color: var(--color-foreground);
  text-decoration: none;
  /* Custom styles */
  cursor: pointer;
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
  width: 100%;
}

/* INTERACTIONS */

#menu__options > li > *:hover,
#menu__options > li > *:focus {
  background-color: var(--color-background-mute);
}
</style>
