import type { BookPage } from '@/types'

export function reorderList(list: BookPage[]) {
  list.forEach((item, index) => (item.order = index))
}

export function filterPageFromList(list: BookPage[], pageId: number) {
  return list.filter((item) => item.id !== pageId)
}

export function findPageInList(list: BookPage[], pageId: number) {
  return list.find((item) => item.id === pageId)
}
