import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import PageModal from './PageModal.vue'

describe('PageModal', () => {
  // Mock dialog API since jsdom doesn't support it
  HTMLDialogElement.prototype.close = vi.fn()

  const pageMock = {
    id: 5,
    order: 1,
    content: 'Some lines flying off the page',
    list: 2,
  }

  it('renders properly', async () => {
    const wrapper = mount(PageModal, { props: { page: pageMock } })

    await wrapper.find('button').trigger('click')
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1)
  })
})
