/**
 * Import or export notes file
 */

import type { Note } from '@/types'
import type { Ref } from 'vue'
import NotesImportModal from '@/components/NotesImportModal.vue'

export default function useExportFile(
  currentList: Ref<Note[]>,
  importDialogRef: Ref<InstanceType<typeof NotesImportModal> | null>,
) {
  function exportFile() {
    // Transform form into Markdown
    const filename = 'cains-jawbone.md'
    const intro =
      "# CAIN'S JAWBONE\r\n\n" +
      'READ ME:\r\n\n' +
      '- Here are your notes from cains-jawbone.hgcl.workers.dev\r\n' +
      '- If you want to go on solving the mystery, upload this file back into the website to import your notes.\r\n' +
      '- You can also edit this file directly, but make sure to keep the exact same file structure. DO NOT rename the titles, or use double `#` characters in your notes.\r\n'
    const outro = `## END OF FILE — do not erase\r\n`
    const notes = currentList.value
      .map((item) => `## Page ${item.id}\r\n\n${item.note}`)
      .join('\r\n\n')
    const content = intro + '\r\n' + notes + '\r\n' + outro

    // Create download link
    const blob = new Blob([content], { type: 'text/plain' })
    const urlForDownload = window.URL.createObjectURL(blob)
    const linkElement = document.createElement('a')
    linkElement.href = urlForDownload
    linkElement.download = filename
    linkElement.click()

    URL.revokeObjectURL(urlForDownload) // Free memory
  }

  function loadFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) {
      importDialogRef.value!.status = 'danger'
      return
    }

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const originalText = event.target?.result as string

        // Get array of page numbers
        const regexPageNumbers = /## Page (\d*?)\s/g
        const pageNumbers = [...originalText.matchAll(regexPageNumbers)].map((item) =>
          Number(item[1]),
        )

        if (pageNumbers.length === 0) {
          importDialogRef.value!.status = 'danger'
          throw new Error(`No page found in the file`)
        }

        // Parse content and format
        const parsedContent = pageNumbers
          .map((page) => {
            // This creates the following regex for each page `/## Page 1(.*?)/gs`
            const regex = new RegExp('## Page ' + page + '(.*?)##', 'gs')

            const matchedContent = regex.exec(originalText)

            if (!matchedContent) {
              importDialogRef.value!.status = 'danger'
              throw new Error(`Failed to parse page ${page}`)
            }

            // Return captured group of each page
            return { id: page, note: matchedContent[1]?.trim() }
          })
          .filter((result): result is Note => result !== null)

        // Apply markdown content to live data
        currentList.value = parsedContent

        // Success message
        importDialogRef.value!.status = 'success'
      } catch (err) {
        importDialogRef.value!.status = 'danger'
        console.error('Invalid Markdown file', err)
      }
    }

    // Read the file:
    // This starts the asynchronous process of reading the file as a text string. When the file is fully read, the FileReader triggers the `onload` event above.
    reader.readAsText(file)
  }

  return { exportFile, loadFile }
}
