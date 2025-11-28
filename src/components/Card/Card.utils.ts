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
    return string.slice(subString.indexOf(' ') - 55)
  }
}

export function useGoPage(currentIndex: Ref<number>, pageList: BookPage[]) {
  function toPreviousPage() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }
  function toNextPage() {
    if (currentIndex.value < pageList.length - 1) {
      currentIndex.value++
    }
  }

  return { toPreviousPage, toNextPage }
}

export function useOpenDialog(dialogRef: Ref<InstanceType<typeof PageModal> | null>) {
  return function openDialog() {
    dialogRef.value?.open()
  }
}
