<script setup lang="ts">
import { ref } from 'vue'
import type { BookPage } from '../../types'
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import arrowLeft from '../../assets/arrow-left-feathericons.svg'
import arrowRight from '../../assets/arrow-right-feathericons.svg'

defineProps<{
  page: BookPage | null
  hasNavigation?: boolean
}>()
const emit = defineEmits<{
  (e: 'click:nextpage', event: MouseEvent): void
  (e: 'click:previouspage', event: MouseEvent): void
}>()

const modalRef = ref<InstanceType<typeof Modal> | null>(null)

// Forward exposed methods from Modal.vue
defineExpose({
  open: () => modalRef.value?.open(),
  close: () => modalRef.value?.close(),
})
</script>

<template>
  <Modal ref="modalRef">
    <template #heading>Page {{ page?.id }}</template>
    <p class="page-modal__content" v-html="page?.content"></p>
    <div class="page-modal__buttons" v-if="hasNavigation">
      <Button
        :variant="'secondary'"
        :iconBefore="arrowLeft"
        @click="(e) => emit('click:previouspage', e)"
        >Previous page</Button
      ><Button
        :variant="'secondary'"
        :iconAfter="arrowRight"
        @click="(e) => emit('click:nextpage', e)"
        >Next page</Button
      >
    </div>
  </Modal>
</template>

<style scoped>
.page-modal__buttons {
  display: flex;
  justify-content: space-between;
  gap: var(--gap-m);
}
.page-modal__content {
  font-family: var(--font-family-body);
  white-space: pre-line;
  margin-bottom: var(--gap-l);
}
</style>
