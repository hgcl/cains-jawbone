import type { Ref } from 'vue'
import ShowBox from '../ShowBox/ShowBox.vue'

/**
 * COPY ORDER TO CLIPBOARD
 */
export function useCopyContent(
  localInput: Ref<string>,
  copyRef: Ref<InstanceType<typeof ShowBox> | null>,
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
