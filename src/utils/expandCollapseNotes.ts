/**
 * Expand or collapse all notes (recognized by ".details" class)
 */

export function expandAll() {
  const detailsEls = document.querySelectorAll('details')
  for (const detail of detailsEls) {
    detail.open = true
  }
}
export function collapseAll() {
  const detailsEls = document.querySelectorAll('details')
  for (const detail of detailsEls) {
    detail.open = false
  }
}
