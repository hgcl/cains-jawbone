import type { BookPage } from '@/types'
import { ref } from 'vue'

export function createSharedMocks() {
  const mockPage: BookPage = {
    id: 1,
    order: 1,
    content: 'Some lines flying off page 1',
    list: 1,
  }
  const modalPage = ref<BookPage | null>(null)
  const modalIndex = ref<number>(1)
  const mockList: BookPage[] = [
    {
      id: 1,
      order: 1,
      content: 'Some lines flying off page 1',
      list: 1,
    },
    {
      id: 2,
      order: 1,
      content: 'Some lines flying off page 2',
      list: 1,
    },
    {
      id: 3,
      order: 1,
      content: 'Some lines flying off page 3',
      list: 1,
    },
  ]
  const modalList = ref(mockList)

  return {
    mockPage,
    mockList,
    modalPage,
    modalIndex,
    modalList,
  }
}
