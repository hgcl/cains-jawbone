import { describe, it, expect, vi } from 'vitest'

import { useGoPage, useOpenDialog, truncateText } from './Card.utils'
import type { BookPage } from '@/types'
import { ref } from 'vue'

describe('Card -- utils', () => {
  it('truncates content correctly', () => {
    const string = 'Hello there, this is a pretty long string to be truncated at both ends'
    const stringCutStart = 'Hello there, this is a pretty long string to be truncated'
    const stringCutEnd = 'is a pretty long string to be truncated at both ends'

    // String is truncated at 60 chars (last word that is cut is removed)
    expect(truncateText(string, 'end')).toBe(stringCutStart)
    // String is truncated at 55 chars (first word that is cut is removed)
    expect(truncateText(string, 'start')).toBe(stringCutEnd)

    const string2 = 'Hello there, this is another pretty long string to be truncated at both ends'
    const string2CutStart = 'Hello there, this is another pretty long string to be'
    const string2CutEnd = 'pretty long string to be truncated at both ends'

    // String is truncated at 60 chars (last word that is cut is removed)
    expect(truncateText(string2, 'end')).toBe(string2CutStart)
    // String is truncated at 55 chars (first word that is cut is removed)
    expect(truncateText(string2, 'start')).toBe(string2CutEnd)
  })

  it('navigates to next page', () => {
    const mockIndexRef = ref(1)
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

    const { toPreviousPage, toNextPage } = useGoPage(mockIndexRef, mockList)

    // Go to previous page (0)
    toPreviousPage()
    expect(mockIndexRef.value).toBe(0)

    // Does not go below 0
    mockIndexRef.value = 0
    toPreviousPage() // stays 0
    expect(mockIndexRef.value).toBe(0)

    // Go to next page
    toNextPage()
    expect(mockIndexRef.value).toBe(1)

    // Does not exceed max
    mockIndexRef.value = 2
    toNextPage() // stays 2
    expect(mockIndexRef.value).toBe(2)
  })

  it('dialog opens on click', () => {
    const mockOpen = vi.fn()
    const dialogRef = ref({
      open: mockOpen,
    })

    const openDialog = useOpenDialog(dialogRef as any)

    openDialog()

    // Dialog is opened once
    expect(mockOpen).toHaveBeenCalledTimes(1)
  })
})
