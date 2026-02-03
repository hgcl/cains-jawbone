export const truncateText = (string: string, truncatePosition: 'start' | 'end'): string => {
  let subString = string

  // String is truncated at 60 chars (last word that is cut is removed)
  if (truncatePosition === 'end') {
    subString = string.slice(0, 60)
    return string.slice(0, subString.lastIndexOf(' '))
  }

  // String is truncated at 55 chars (first word that is cut is removed)
  if (truncatePosition === 'start') {
    subString = string.slice(string.length - 55)
    return string.slice(subString.indexOf(' ') - 55).trimStart()
  }

  return ''
}
