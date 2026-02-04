import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import IconButton from '@/components/IconButton.vue'

describe('IconButton', () => {
  it('renders label properly', async () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'icon-path-exists',
      },
      slots: {
        default: 'some content',
      },
    })

    expect(wrapper.find('button').text()).toContain('some content')
  })

  it('renders icon properly', async () => {
    const wrapper = mount(IconButton, {
      attachTo: document.body,
      props: {
        icon: 'icon-path-exists',
      },
    })

    expect(wrapper.find('.button__icon').isVisible()).toBe(true)
  })

  it('button component emits action to parent', () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'icon-path-exists',
      },
    })

    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
