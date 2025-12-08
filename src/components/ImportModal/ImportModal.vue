<script setup lang="ts">
import { ref } from 'vue'
import Modal from '../Modal/Modal.vue'

const emit = defineEmits<{
  (e: 'change:loadfile', event: Event): void
}>()

/**
 * MODAL RELATED
 */
const modalRef = ref<InstanceType<typeof Modal> | null>(null)

// Forward exposed methods from Modal.vue
defineExpose({
  open: () => modalRef.value?.open(),
  close: () => modalRef.value?.close(),
})
</script>

<template>
  <Modal ref="modalRef">
    <template #heading>Import notes</template>
    <p>
      If you have previously exported your notes, you can import that <code>.JSON</code>
      file back into the app.
    </p>
    <input
      type="file"
      id="fileUpload"
      accept="application/json"
      @change="(e) => emit('change:loadfile', e)"
    />
  </Modal>
</template>

<style scoped></style>
