/**
 * Copy page order field to clipboard
 */

import type { Ref } from 'vue'
import ShowElement from '@/components/ShowElement.vue'

export default function useCopyContent(
  localInput: Ref<string>,
  copyRef: Ref<InstanceType<typeof ShowElement> | null>,
) {
  async function copyContent() {
    try {
      await navigator.clipboard.writeText(localInput.value)
      copyRef.value?.showAndHide()
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return { copyContent }
}
