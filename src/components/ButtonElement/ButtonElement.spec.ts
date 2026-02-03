import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ButtonElement from './ButtonElement.vue'

describe('ButtonElement', () => {
  it('renders label properly', async () => {
    const wrapper = mount(ButtonElement, {
      slots: {
        default: 'some content',
      },
    })

    expect(wrapper.find('button').text()).toContain('some content')
  })

  it('renders icon (before label) properly', async () => {
    const wrapper = mount(ButtonElement, {
      attachTo: document.body,
      props: {
        iconBefore: 'icon-path-exists',
      },
    })

    expect(wrapper.find('.button__icon_before').isVisible()).toBe(true)
  })

  it('renders icon (after label) properly', async () => {
    const wrapper = mount(ButtonElement, {
      attachTo: document.body,
      props: {
        iconAfter: 'icon-path-exists',
      },
    })

    expect(wrapper.find('.button__icon_after').isVisible()).toBe(true)
  })

  it('button component emits action to parent', () => {
    const wrapper = mount(ButtonElement)

    wrapper.find('button').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
