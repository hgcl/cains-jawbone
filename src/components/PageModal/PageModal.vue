<template>
  <ModalElement ref="modalRef">
    <template #heading>Page {{ page?.id }}</template>
    <ToggleElement
      :isChecked="isSorted"
      @update:isChecked="updateToggle"
      :iconUnchecked="starSvg"
      :iconChecked="starFillSvg"
      class="page-modal__sort-toggle"
      >Sorted</ToggleElement
    >
    <p class="page-modal__content" v-if="page" v-html="sanitizeHtml(page.content)"></p>
    <div class="page-modal__nav-buttons" v-if="hasNavigation">
      <ButtonElement
        :variant="'secondary'"
        :iconBefore="arrowLeftSvg"
        @click="(e) => emit('click:previouspage', e)"
        >Previous page</ButtonElement
      ><ButtonElement
        :variant="'secondary'"
        :iconAfter="arrowRightSvg"
        @click="(e) => emit('click:nextpage', e)"
        >Next page</ButtonElement
      >
    </div>
  </ModalElement>
</template>

<script setup lang="ts">
import sanitizeHtml from 'sanitize-html'

import { computed, ref } from 'vue'
import type { BookPage } from '../../types'
import ModalElement from '../ModalElement/ModalElement.vue'
import ButtonElement from '../ButtonElement/ButtonElement.vue'
import ToggleElement from '../ToggleElement/ToggleElement.vue'
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
const modalRef = ref<InstanceType<typeof ModalElement> | null>(null)

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
