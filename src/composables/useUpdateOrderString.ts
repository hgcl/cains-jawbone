/**
 * Edit page order through input field
 */

import type { BookPage } from '@/types'
import type { Ref } from 'vue'

export default function useUpdateOrderString(
  list1: Ref<BookPage[]>,
  list2: Ref<BookPage[]>,
  bookJson: BookPage[],
) {
  function updateOrderString(pageArray: number[]) {
    const newList1: BookPage[] = []
    const newList2: BookPage[] = []

    bookJson.forEach((el, index) => {
      const indexInList2 = pageArray.indexOf(el.id)
      const pageObject = el

      if (indexInList2 != -1) {
        // If exists in `pageArray`, add to list 2
        pageObject.list = 2
        pageObject.order = indexInList2
        newList2.push(pageObject)
      } else {
        // If page is not in list 2, add to list 1
        pageObject.list = 1
        pageObject.order = index
        newList1.push(pageObject)
      }
    })

    // Replace `list2` and `list1` with updated versions
    list1.value = newList1
    list2.value = newList2
  }

  return { updateOrderString }
}
