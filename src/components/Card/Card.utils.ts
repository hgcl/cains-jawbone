import type { Ref } from 'vue'
import type { BookPage } from '../../types'
import PageModal from '../PageModal/PageModal.vue'

export function truncateText(string: string, truncatePosition: 'start' | 'end') {
  let subString = string
  if (truncatePosition === 'end') {
    subString = string.slice(0, 60)
    return string.slice(0, subString.lastIndexOf(' '))
  }
  if (truncatePosition === 'start') {
    subString = string.slice(string.length - 60)
    return string.slice(subString.indexOf(' ') - 60)
  }
}

export function useOpenDialog(
  selectedPage: Ref<BookPage | null>,
  dialogRef: Ref<InstanceType<typeof PageModal> | null>,
) {
  return function openDialog(page: BookPage) {
    selectedPage.value = page
    dialogRef.value?.open()
  }
}
