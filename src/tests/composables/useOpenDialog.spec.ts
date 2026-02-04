import { describe, expect, it, vi } from 'vitest'

import { createSharedMocks } from '@/tests/useSharedMocks'
import useOpenPageDialog, { type DialogType } from '@/composables/useOpenPageDialog'
import { ref } from 'vue'

describe.only('useOpenPageDialog', () => {
  const { mockPage, modalIndex, mockList, modalPage, modalList } = createSharedMocks()

  it('dialog opens on click', () => {
    const openMock = vi.fn()
    const dialogRef = ref<DialogType>({ open: openMock })

    // Init refs
    const openPageDialog = useOpenPageDialog(modalPage, modalIndex, modalList, dialogRef)

    // Update refs values
    // openPageDialog(initialPage: BookPage, initialIndex: number, list: BookPage[])
    openPageDialog(mockPage, 0, mockList)

    // `modal*` vars are defined correctly
    expect(modalPage.value).toStrictEqual(mockPage)
    expect(modalIndex.value).toBe(0)
    expect(modalList.value).toStrictEqual(mockList)

    // Dialog is opened once
    expect(openMock).toHaveBeenCalledTimes(1)
  })
})
