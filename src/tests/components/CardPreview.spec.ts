import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import PagePreview from '@/components/PagePreview.vue'
import type { BookPage } from '@/types'

describe('PagePreview', () => {
  const mockPage: BookPage = {
    id: 2,
    order: 1,
    content: 'Some lines flying off page 2',
    list: 1,
  }

  it('renders properly', () => {
    const wrapper = mount(PagePreview, { props: { page: mockPage } })

    // `page.id` gives the page number
    expect(wrapper.find('.card__page').text().toLowerCase()).toContain('page 2')
    expect(wrapper.find('.card__preview').text()).toContain('Some lines flying off page 2')
  })
})
