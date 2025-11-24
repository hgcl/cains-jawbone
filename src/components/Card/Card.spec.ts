import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card', () => {
  const pageMock = {
    id: 5,
    order: 1,
    content: 'Some lines flying off the page',
    list: 2,
  }

  it('renders properly', () => {
    const wrapper = mount(Card, { props: { page: pageMock } })
    // `page.id` gives the page number
    expect(wrapper.find('button').text().toLowerCase()).toContain('page 5')
    expect(wrapper.find('.card__preview').text()).toContain('Some lines flying off the page')
  })
})
