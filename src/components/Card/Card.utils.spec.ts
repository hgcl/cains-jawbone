import { describe, it, expect, vi } from 'vitest'

import { useOpenDialog } from './Card.utils'
import type { BookPage } from '@/types'
import { ref } from 'vue'

describe('Card -- utils', () => {
  it('opens dialog of selected page', () => {
    // Mock variables
    const page: BookPage = {
      id: 1,
      list: 1,
      order: 0,
      content: 'Hello world',
    }
    const selectedPage = ref<BookPage | null>(null)
    const openMock = vi.fn()
    const dialogRef = ref({
      open: openMock,
    })

    const openDialog = useOpenDialog(selectedPage, dialogRef as any)

    openDialog(page)

    // `selectedPage` correctly takes the value of `page`
    expect(selectedPage.value).toEqual(page)

    // Dialog is opened once
    expect(openMock).toHaveBeenCalledTimes(1)
  })
})
