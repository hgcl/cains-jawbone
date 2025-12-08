import type { Note } from '@/types'
import { nextTick, type Ref } from 'vue'

/**
 * EXPAND/COLLAPSE NOTES
 */
export function expandAll() {
  const detailsEls = document.querySelectorAll('details')
  for (let detail of detailsEls) {
    detail.open = true
  }
}
export function collapseAll() {
  const detailsEls = document.querySelectorAll('details')
  for (let detail of detailsEls) {
    detail.open = false
  }
}

/**
 * ADD/DELETE NOTES
 */
export function useAddNote(selectedPageNumber: Ref<number | ''>, currentList: Ref<Note[]>) {
  async function addNote() {
    if (!selectedPageNumber.value) return

    // Add page note to currentList, and reorder it by `id`
    currentList.value.push({ id: selectedPageNumber.value, note: '' })

    // Scroll into view after waiting for the DOM
    await nextTick()
    const noteEl = document.getElementById(`note${selectedPageNumber.value}`)
    const textAreaEl = noteEl?.querySelector('textarea')
    noteEl?.scrollIntoView({ behavior: 'smooth' })

    // Focus on textarea
    setTimeout(() => textAreaEl?.focus(), 600)

    // Reset
    selectedPageNumber.value = ''

    console.log(currentList.value)
  }
  function deleteNote(pageNumber: number) {
    // Remove page note from currentList, and reorder it by `id`
    currentList.value = currentList.value.filter((item) => item.id !== pageNumber)

    // Warning message before deletion
    confirm(`Are you sure you'd like to delete the note for page ${pageNumber}?`)
  }

  return { addNote, deleteNote }
}

/**
 * IMPORT/EXPORT
 */
export function useExportFile(currentList: Ref<Note[]>) {
  function exportFile() {
    // Transform form into JSON
    const filename = 'cains-jawbone.json'
    const jsonStr = JSON.stringify(currentList.value)

    // Create download link
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const urlForDownload = window.URL.createObjectURL(blob)
    const linkElement = document.createElement('a')
    linkElement.href = urlForDownload
    linkElement.download = filename
    linkElement.click()

    URL.revokeObjectURL(urlForDownload) // Free memory
  }

  function loadFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsedJson = JSON.parse(text)

        currentList.value = parsedJson
      } catch (err) {
        console.error('Invalid JSON file', err)
      }
    }

    // Read the file:
    // This starts the asynchronous process of reading the file as a text string. When the file is fully read, the FileReader triggers the `onload` event above.
    reader.readAsText(file)
  }

  return { exportFile, loadFile }
}
