import { describe, expect, it } from 'vitest'

import { createSharedMocks } from '@/tests/useSharedMocks'
import useNavigateBetweenPages from '@/composables/useNavigateBetweenPages'

function setup() {
  const mocks = createSharedMocks()
  return {
    ...mocks,
    ...useNavigateBetweenPages(mocks.modalPage, mocks.modalIndex, mocks.modalList),
  }
}

describe('useNavigateBetweenPages', () => {
  it('navigates to previous page', () => {
    const { modalIndex, modalPage, toPreviousPage } = setup()

    // Initial modalIndex
    expect(modalIndex.value).toBe(1)

    // Go to previous page (index 0)
    toPreviousPage() // to index 1
    expect(modalPage.value?.id).toBe(1)
    expect(modalIndex.value).toBe(0)

    // // Does not go below 0
    toPreviousPage() // to index 0
    expect(modalIndex.value).toBe(0)
  })

  it('navigates to next page', () => {
    const { modalIndex, toNextPage } = setup()

    // Initial modalIndex
    expect(modalIndex.value).toBe(1)

    // Go to next page
    toNextPage()
    expect(modalIndex.value).toBe(2)

    // Does not exceed max (index 2)
    toNextPage()
    expect(modalIndex.value).toBe(2)
  })
})
