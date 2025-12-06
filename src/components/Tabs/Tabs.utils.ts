import { type Ref } from 'vue'

/**
 * TABS
 */
export function useSelectTab(selectedIndex: Ref<number>, tabs: {}[]) {
  function selectTab(index: number) {
    selectedIndex.value = index

    // Move focus to the newly selected tab
    const tabEl = document.getElementById(`tab${index + 1}`)
    tabEl?.focus()
  }

  function switchTab(event: KeyboardEvent, index: number) {
    let direction = event.key

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
