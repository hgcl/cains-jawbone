import type { Ref } from 'vue'
import PageOrder from '../PageOrder/PageOrder.vue'

/**
 * COPY ORDER TO CLIPBOARD
 */
export function useCopyContent(
  localInput: Ref<string>,
  copyRef: Ref<InstanceType<typeof PageOrder> | null>,
) {
  async function copyContent() {
    try {
      await navigator.clipboard.writeText(localInput.value)
      copyRef.value.showAndHide()
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return { copyContent }
}
