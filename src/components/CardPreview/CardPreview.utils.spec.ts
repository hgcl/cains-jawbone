import { describe, it, expect } from 'vitest'

import { truncateText } from './CardPreview.utils'

describe('CardPreview -- utils', () => {
  it('truncates content correctly', () => {
    const string = 'Hello there, this is a pretty long string to be truncated at both ends'
    const stringCutStart = 'Hello there, this is a pretty long string to be truncated'
    const stringCutEnd = 'is a pretty long string to be truncated at both ends'

    // String is truncated at 60 chars (last word that is cut is removed)
    expect(truncateText(string, 'end')).toBe(stringCutStart)
    // String is truncated at 55 chars (first word that is cut is removed)
    expect(truncateText(string, 'start')).toBe(stringCutEnd)

    const string2 = 'Hello there, this is another pretty long string to be truncated at both ends'
    const string2CutStart = 'Hello there, this is another pretty long string to be'
    const string2CutEnd = 'pretty long string to be truncated at both ends'

    // String is truncated at 60 chars (last word that is cut is removed)
    expect(truncateText(string2, 'end')).toBe(string2CutStart)
    // String is truncated at 55 chars (first word that is cut is removed)
    expect(truncateText(string2, 'start')).toBe(string2CutEnd)
  })
})
