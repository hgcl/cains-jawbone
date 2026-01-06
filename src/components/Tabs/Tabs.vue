<template>
  <div class="tabs__wrapper">
    <!-- TABLIST -->
    <ul role="tablist">
      <li role="presentation" v-for="(tab, index) in tabs" :key="tab.title">
        <button
          role="tab"
          :id="`tab${index + 1}`"
          :tabindex="selectedIndex === index ? 0 : -1"
          :aria-selected="selectedIndex === index ? true : false"
          @keydown="switchTab($event, index)"
          @click="selectTab(index)"
        >
          {{ tab.title }}
        </button>
      </li>
    </ul>

    <!-- LIST 1: UNSORTED -->
    <section role="tabpanel" aria-labelledby="tab1" v-if="selectedIndex === 0">
      <slot name="tab1"></slot>
    </section>

    <!-- LIST 2: SORTED -->
    <section role="tabpanel" aria-labelledby="tab2" v-if="selectedIndex === 1">
      <slot name="tab2"></slot>
    </section>

    <!-- NOTES -->
    <section role="tabpanel" aria-labelledby="tab3" v-if="selectedIndex === 2">
      <slot name="tab3"></slot>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSelectTab } from './Tabs.utils'

/**
 * TABS
 */
const selectedIndex = ref(0)
const tabs = [{ title: 'Unsorted pages' }, { title: 'Sorted pages' }, { title: 'Notes' }]

const { selectTab, switchTab } = useSelectTab(selectedIndex, tabs)
</script>

<style scoped>
.tabs__wrapper {
  width: 100%;
}

/* TABLIST */

[role='tablist'] {
  /* Reset styles */
  list-style-type: none;
  padding: 0;
  /* Custom styles */
  display: flex;
  gap: 1px;
}
[role='tablist'] li button {
  /* Reset styles */
  font-family: var(--font-family-body);
  text-decoration: none;
  color: var(--color-accent);
  /* Custom styles */
  cursor: pointer;
  display: block;
  height: 100%;
  padding: var(--padding-s);
  background-color: var(--color-background-alt);
  border: 1px solid var(--color-background);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  text-transform: uppercase;
  font-size: var(--font-size-body-s);
  font-weight: bold;
  position: static;
}
[role='tablist'] [aria-selected='true'] {
  border-color: var(--color-accent-subtle) var(--color-accent-subtle) var(--color-background-alt)
    var(--color-accent-subtle);
  /* Necessary to hide the top border of the panel */
  position: relative;
  top: 2px;
}

/* TABPANELS */

[role='tabpanel'] {
  background: var(--color-background-alt);
  border: var(--border);
  border-radius: var(--border-radius);
  /* Updated through media queries */
  padding: var(--padding-m) var(--padding-s);
}

/* MEDIA-QUERIES */

@media (width > 568px) {
  [role='tabpanel'] {
    padding: var(--padding-l) var(--padding-m);
  }
}
</style>
