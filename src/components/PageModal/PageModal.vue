<template>
  <Modal ref="modalRef">
    <template #heading>Page {{ page?.id }}</template>
    <Button
      v-if="page?.list === 1"
      class="page-modal__sort-button"
      :iconBefore="plusSvg"
      @click="(e) => emit('toggle:sorted', e)"
      >Sort page</Button
    >
    <Button
      v-if="page?.list === 2"
      class="page-modal__sort-button"
      :iconBefore="checkSvg"
      @click="(e) => emit('toggle:sorted', e)"
      >Unsort page</Button
    >
    <p class="page-modal__content" v-html="page?.content"></p>
    <div class="page-modal__nav-buttons" v-if="hasNavigation">
      <Button
        :variant="'secondary'"
        :iconBefore="arrowLeftSvg"
        @click="(e) => emit('click:previouspage', e)"
        >Previous page</Button
      ><Button
        :variant="'secondary'"
        :iconAfter="arrowRightSvg"
        @click="(e) => emit('click:nextpage', e)"
        >Next page</Button
      >
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BookPage } from '../../types'
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import arrowLeftSvg from '../../assets/arrow-left-feathericons.svg'
import arrowRightSvg from '../../assets/arrow-right-feathericons.svg'
import checkSvg from '../../assets/x-feathericons.svg'
import plusSvg from '../../assets/plus-feathericons.svg'

defineProps<{
  page: BookPage | null
  hasNavigation?: boolean
}>()
const emit = defineEmits<{
  (e: 'toggle:sorted', event: MouseEvent): void
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

<style scoped>
.page-modal__sort-button {
  margin-left: auto;
  margin-right: auto;
}
.page-modal__nav-buttons {
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
