import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button', () => {
  it('renders label properly', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'some content',
      },
    })

    expect(wrapper.find('button').text()).toContain('some content')
  })

  it('renders icon properly', async () => {
    const wrapper = mount(Button, {
      attachTo: document.body,
      props: {
        icon: 'icon-path-exists',
      },
    })

    expect(wrapper.find('.button__icon').isVisible()).toBe(true)
  })

  it('button component emits action to parent', () => {
    const wrapper = mount(Button)

    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
