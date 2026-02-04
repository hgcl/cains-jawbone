import type { Note } from '@/types'
import { nextTick, type Ref } from 'vue'
import ModalElement from '@/components/ModalElement.vue'

/**
 * Add or delete note from list
 */

export default function useAddNote(
  selectedPageNumber: Ref<number | ''>,
  currentList: Ref<Note[]>,
  addNoteModalRef: Ref<InstanceType<typeof ModalElement> | null>,
) {
  async function addNote() {
    if (!selectedPageNumber.value) return

    // Add page note to currentList, and reorder it by `id`
    currentList.value.push({ id: selectedPageNumber.value, note: '' })

    // Close modal
    addNoteModalRef.value?.close()

    // Scroll into view after waiting for the DOM
    await nextTick()
    const noteEl = document.getElementById(`note${selectedPageNumber.value}`)
    const textAreaEl = noteEl?.querySelector('textarea')
    noteEl?.scrollIntoView({ behavior: 'smooth' })

    // Focus on textarea
    setTimeout(() => textAreaEl?.focus(), 600)

    // Reset
    selectedPageNumber.value = ''
  }

  function deleteNote(pageNumber: number) {
    // Warning message before deletion
    const userConfirms = confirm(
      `Are you sure you'd like to delete the note for page ${pageNumber}?`,
    )

    if (!userConfirms) return

    // Remove page note from currentList, and reorder it by `id`
    currentList.value = currentList.value.filter((item) => item.id !== pageNumber)
  }

  return { addNote, deleteNote }
}
