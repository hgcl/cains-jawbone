import { describe, it, expect, vi } from 'vitest'

import { useNavigateBetweenPages, useOpenDialog, type DialogType } from './PagesOverview.utils'
import type { BookPage } from '@/types'
import { ref } from 'vue'

describe('PagesOverview -- utils', () => {
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

  it('navigates to next/previous page', () => {
    const { toPreviousPage, toNextPage } = useNavigateBetweenPages(modalPage, modalIndex)

    // Initial modalIndex
    expect(modalIndex.value).toBe(1)

    // Go to previous page (index 0)
    toPreviousPage(1, mockList) // to index 1
    expect(modalPage.value?.id).toBe(1)
    expect(modalIndex.value).toBe(0)

    // // Does not go below 0
    toPreviousPage(0, mockList) // to index 0
    expect(modalIndex.value).toBe(0)

    // Go to next page
    toNextPage(0, mockList)
    expect(modalIndex.value).toBe(1)

    // Does not exceed max
    toNextPage(1, mockList) // to index 1
    toNextPage(2, mockList) // to index 2
    expect(modalIndex.value).toBe(2)
  })

  it('dialog opens on click', () => {
    const openMock = vi.fn()
    const dialogRef = ref<DialogType>({ open: openMock })

    const openDialog = useOpenDialog(modalPage, modalIndex, modalList, dialogRef)

    openDialog(mockPage, 0, mockList)

    // `modal*` vars are defined correctly
    expect(modalPage.value).toStrictEqual(mockPage)
    expect(modalIndex.value).toBe(0)
    expect(modalList.value).toStrictEqual(mockList)

    // Dialog is opened once
    expect(openMock).toHaveBeenCalledTimes(1)
  })
})
