/**
 * Handle switching to selected tab
 */

import type { Ref } from 'vue'

export function useSelectTab(selectedIndex: Ref<number>, tabs: { title: string }[]) {
  function selectTab(index: number) {
    selectedIndex.value = index

    // Move focus to the newly selected tab
    const tabEl = document.getElementById(`tab${index + 1}`)
    tabEl?.focus()
  }

  function switchTab(event: KeyboardEvent, index: number) {
    const direction = event.key

    if (direction === 'ArrowLeft') {
      event.preventDefault()
      if (index === 0) return
      selectTab(index - 1)
    } else if (direction === 'ArrowRight') {
      event.preventDefault()
      if (index === tabs.length - 1) return
      selectTab(index + 1)
    }
  }

  return { selectTab, switchTab }
}
