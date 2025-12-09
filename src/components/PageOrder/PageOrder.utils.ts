import type { Ref } from 'vue'
import ShowElement from '../ShowElement/ShowElement.vue'

/**
 * COPY ORDER TO CLIPBOARD
 */
export function useCopyContent(
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
