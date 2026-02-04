import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import PageOrderInput from '@/components/PageOrderInput.vue'

describe('PageOrderInput', () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: () => {},
    },
  })

  it('correct value is copied to clipboard', async () => {
    const spy = vi.spyOn(navigator.clipboard, 'writeText')

    const wrapper = mount(PageOrderInput, {
      props: {
        orderString: '1, 2, 3, 4',
      },
    })

    const copyButton = wrapper.find('.page-order__copy-button')
    await copyButton.trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('1, 2, 3, 4')
  })
})
