<template>
  <Modal ref="modalRef">
    <template #heading>Page {{ page?.id }}</template>
    <Toggle
      :isChecked="isSorted"
      @update:isChecked="updateToggle"
      :iconUnchecked="starSvg"
      :iconChecked="starFillSvg"
      class="page-modal__sort-toggle"
      >Sorted</Toggle
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
import { computed, ref } from 'vue'
import type { BookPage } from '../../types'
import Modal from '../Modal/Modal.vue'
import Button from '../Button/Button.vue'
import Toggle from '../Toggle/Toggle.vue'
import arrowLeftSvg from '../../assets/arrow-left-feathericons.svg'
import arrowRightSvg from '../../assets/arrow-right-feathericons.svg'
import starSvg from '../../assets/star-feathericons.svg'
import starFillSvg from '../../assets/star-fill-feathericons.svg'

const props = defineProps<{
  page: BookPage | null
  hasNavigation?: boolean
}>()
const emit = defineEmits<{
  (e: 'toggle:sorted', value: boolean): void
  (e: 'click:nextpage', event: MouseEvent): void
  (e: 'click:previouspage', event: MouseEvent): void
}>()

/**
 * TOGGLE SORT/UNSORTED
 */

const isSorted = computed({
  get: () => props.page?.list === 2,
  set: (value: boolean) => emit('toggle:sorted', value),
})

function updateToggle(newValue: boolean) {
  isSorted.value = newValue
}

/**
 * MODAL
 */
const modalRef = ref<InstanceType<typeof Modal> | null>(null)

// Forward exposed methods from Modal.vue
defineExpose({
  open: () => modalRef.value?.open(),
  close: () => modalRef.value?.close(),
})
</script>

<style scoped>
.page-modal__sort-toggle {
  width: fit-content;
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
