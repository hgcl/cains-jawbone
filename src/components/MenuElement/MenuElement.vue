<!-- ACCESSIBLE MENU -->
<!-- Source: https://inclusive-components.design/menus-menu-buttons/ -->
<template>
  <div class="menu">
    <ButtonElement
      aria-controls="menu-options"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      @click.stop="toggleMenu"
      @keydown="handleKeydownMenu($event)"
      class="menu__button"
      :iconAfter="chevronDownSvg"
      >{{ label }}
    </ButtonElement>
    <div v-if="isMenuOpen" class="menu-overlay" @click="isMenuOpen = false"></div>
    <ul class="menu__options" v-if="isMenuOpen">
      <!-- Every child used inside of the default slot will have an `onClick` handler -->
      <template v-if="slots.default">
        <li v-for="(vnode, index) in slots.default()" :key="vnode.key ?? index">
          <component
            tabindex="-1"
            @keydown="handleKeydownItem($event, index)"
            :is="cloneVNode(vnode)"
          >
          </component>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import ButtonElement from '../ButtonElement/ButtonElement.vue'
import chevronDownSvg from '../../assets/chevron-down-feathericons.svg'
import { useSlots, cloneVNode, ref, onMounted, onBeforeUnmount } from 'vue'

const { label } = defineProps<{ label: string }>()

const slots = useSlots()

/**
 * MENU NAVIGATION
 */
const isMenuOpen = ref<boolean>(false)

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
    const firstItem = document.querySelector('.menu__options')?.firstElementChild?.firstElementChild
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
    const listItems = document.querySelectorAll('.menu__options > li')
    const nextItem = listItems[index + 1]?.firstElementChild

    // Move focus to first item if we are currently on the last one
    if (index + 1 >= listItems.length) {
      const firstItem =
        document.querySelector('.menu__options')?.firstElementChild?.firstElementChild
      ;(firstItem as HTMLElement).focus()
    }

    ;(nextItem as HTMLElement).focus()
  }

  // Moves focus to the previous menu item, or the last menu item if you’re on the first one
  if (isMenuOpen.value && key === 'ArrowUp') {
    const listItems = document.querySelectorAll('.menu__options > li')
    const previousItem = listItems[index - 1]?.firstElementChild

    // Move focus to last item if we are currently on the first one
    if (index - 1 <= 0) {
      const lastItem = document.querySelector('.menu__options')?.lastElementChild?.firstElementChild
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

<style scoped>
.menu {
  position: relative;
}
.menu__button {
  margin-bottom: var(--gap-xs);
}
.menu__options {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  width: 100%;
  min-width: fit-content;
  white-space: nowrap;
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  padding: var(--padding-xs);
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.1);
  /* Keep dropdown above overlay */
  z-index: 2;
}

.menu__options > li {
  /* Reset styles */
  list-style-type: none;
  /* Custom styles */
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-s);
}
.menu__options > li > * {
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

/* Overlay to support click outside of menu */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Keep behind the menu */
  z-index: 1;
}

/* INTERACTIONS */

.menu__options > li > *:hover,
.menu__options > li > *:focus {
  background-color: var(--color-background-mute);
}
</style>
