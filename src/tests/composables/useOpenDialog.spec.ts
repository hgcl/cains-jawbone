import { describe, expect, it, vi } from 'vitest'

import { createSharedMocks } from '@/tests/useSharedMocks'
import useOpenDialog, { type DialogType } from '@/composables/useOpenDialog'
import { ref } from 'vue'

describe.only('useOpenDialog', () => {
  const { mockPage, modalIndex, mockList, modalPage, modalList } = createSharedMocks()

  it('dialog opens on click', () => {
    const openMock = vi.fn()
    const dialogRef = ref<DialogType>({ open: openMock })

    // Init refs
    const openDialog = useOpenDialog(modalPage, modalIndex, modalList, dialogRef)

    // Update refs values
    // openDialog(initialPage: BookPage, initialIndex: number, list: BookPage[])
    openDialog(mockPage, 0, mockList)

    // `modal*` vars are defined correctly
    expect(modalPage.value).toStrictEqual(mockPage)
    expect(modalIndex.value).toBe(0)
    expect(modalList.value).toStrictEqual(mockList)

    // Dialog is opened once
    expect(openMock).toHaveBeenCalledTimes(1)
  })
})
