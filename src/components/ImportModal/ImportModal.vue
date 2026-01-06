<template>
  <Modal ref="modalRef">
    <template #heading>Import notes</template>
    <p>
      If you have previously exported your notes, you can import that <code>.md</code>
      file back into the app.
    </p>
    <input
      type="file"
      id="fileUpload"
      accept=".md, text/markdown"
      @change="(e) => emit('change:loadfile', e)"
    />
    <ShowElement ref="showElRef">
      <NotificationInline v-if="status === 'danger'" :status="'danger'"
        >There was an error while trying to import your notes. Are you uploading a .md file with the
        correct structure?</NotificationInline
      >
      <NotificationInline v-if="status === 'success'" :status="'success'">
        Your notes were successfully imported. You can get back to solving the mystery!
      </NotificationInline>
    </ShowElement>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '../Modal/Modal.vue'
import ShowElement from '../ShowElement/ShowElement.vue'
import NotificationInline from '../NotificationInline/NotificationInline.vue'

const emit = defineEmits<{
  (e: 'change:loadfile', event: Event): void
}>()

/**
 * MODAL RELATED
 */
const modalRef = ref<InstanceType<typeof Modal> | null>(null)

/**
 * NOTIFICATION RELATED
 */
const status = ref<string | null>(null)
// Exposes functions from `ShowElement`
const showElRef = ref<InstanceType<typeof ShowElement> | null>(null)

// Watch so that `showElRef` updates not just on mount, but whenever status is updated
watch(status, (newStatus) => {
  if (newStatus) {
    showElRef.value?.show()
  }
})

// Forward exposed methods from Modal.vue
defineExpose({
  open: () => modalRef.value?.open(),
  close: () => modalRef.value?.close(),
  status,
})
</script>

<style scoped></style>
