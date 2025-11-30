import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Card from './Card.vue'
import type { BookPage } from '@/types'

describe('Card', () => {
  const mockPage: BookPage = {
    id: 2,
    order: 1,
    content: 'Some lines flying off page 2',
    list: 1,
  }

  it('renders properly', () => {
    const wrapper = mount(Card, { props: { page: mockPage } })

    // `page.id` gives the page number
    expect(wrapper.find('.card__page').text().toLowerCase()).toContain('page 2')
    expect(wrapper.find('.card__preview').text()).toContain('Some lines flying off page 2')
  })

  it('shows and hide correct buttons', () => {
    let wrapper = mount(Card, { props: { page: mockPage } })

    // Page belongs to list 1 => show "sort" button
    expect(wrapper.find('.card__button_sort').exists()).toBe(true)
    expect(wrapper.find('.card__button_remove').exists()).toBe(false)

    // Page belongs to list 2 => show "remove" button
    mockPage.list = 2
    wrapper = mount(Card, { props: { page: mockPage } })

    expect(wrapper.find('.card__button_sort').exists()).toBe(false)
    expect(wrapper.find('.card__button_remove').exists()).toBe(true)
  })
})
