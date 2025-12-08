<script setup lang="ts">
import Button from '../Button/Button.vue'
import ShowElement from '../ShowElement/ShowElement.vue'
import copySvg from '../../assets/copy-feathericons.svg'
import alertSvg from '../../assets/alert-triangle-feathericons.svg'
import { useCopyContent } from './PageOrder.utils'
import { computed, ref, watch } from 'vue'

const { orderString } = defineProps<{
  orderString: string
}>()
const emit = defineEmits<{
  (e: 'update:orderstring', value: number[]): void
}>()

const localInput = ref<string>(orderString)
const copyRef = ref<InstanceType<typeof ShowElement> | null>(null)
const warningRef = ref<InstanceType<typeof ShowElement> | null>(null)
const warningMessage = ref<string>()

const warningIcon = computed(() => ({
  mask: `url("${alertSvg}") no-repeat center`,
}))

watch(
  () => orderString,
  (val) => {
    if (val !== localInput.value) {
      localInput.value = val
    }
  },
)

function reviewOrderString() {
  // 1. Check if string only contains valid characters

  // REGEX MEMO:
  // ^ and $ => match the entire string
  // [0-9,\s] => allows digits, commas, and spaces
  // * => pattern can be repeated
  const isValid = /^[0-9,\s]*$/.test(localInput.value)
  if (!isValid) {
    warningMessage.value =
      'Remove the invalid characters to apply the new page order. Only numbers, commas, and spaces are allowed.'
    warningRef.value?.show()
    return
  }

  // 2. Transform into array of numbers (= pages)
  let numberArray = localInput.value
    .split(',')
    .map(Number)
    // When there are 2 consecutive commas, a `0` is added to the array
    .filter((item) => item !== 0)

  // 3. Check if there are duplicates
  const duplicates = numberArray.filter((item, index) => numberArray.indexOf(item) !== index)
  if (duplicates.length > 0) {
    warningMessage.value = `Remove the following duplicates to apply the new page order: ${duplicates.join(', ')}`
    warningRef.value?.show()
    return
  }

  // 4. Check if there are invalid numbers
  const invalidNumbers = numberArray.filter((item) => item > 100 || item < 1)
  if (invalidNumbers.length > 0) {
    warningMessage.value = `Remove these invalid page numbers: ${invalidNumbers.join(', ')}`
    warningRef.value?.show()
    return
  }

  // 5. If all is valid, emit safely
  warningRef.value?.hide()
  emit('update:orderstring', numberArray)
}

const { copyContent } = useCopyContent(localInput, copyRef)
</script>

<template>
  <div class="page-order">
    <ShowElement ref="copyRef" class="page-order__copied">Copied!</ShowElement>
    <label class="page-order__label">Page order</label>
    <div class="page-order__input_wrapper">
      <input v-model="localInput" type="text" @keydown.enter="reviewOrderString" />
      <Button @click="reviewOrderString">Apply</Button>
      <Button class="page-order__copy-button" @click="copyContent" :iconBefore="copySvg"
        >Copy</Button
      >
    </div>
    <ShowElement ref="warningRef" class="page-order__warning"
      ><div :style="warningIcon"></div>
      {{ warningMessage }}</ShowElement
    >
  </div>
</template>

<style scoped>
.page-order {
  display: flex;
  flex-direction: column;
  gap: var(--gap-s);
  width: 100%;
  max-width: 560px;
  color: var(--color-foreground);
  /* Necessary for .page-order__copied positioning */
  position: relative;
}
.page-order__copied {
  position: absolute;
  top: calc(-0.25 * 16px);
  right: calc(0.5 * 16px);
  color: var(--color-accent);
}
.page-order__warning {
  display: flex;
  gap: var(--gap-s);
  padding: var(--padding-xs);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-foreground-danger);
  color: var(--color-foreground-danger);
  background: var(--color-background-danger);
  font-size: var(--font-size-body-s);
  font-weight: bold;
}
.page-order__warning > div {
  background-color: var(--color-foreground-danger);
  width: 24px;
  height: 24px;
  transform: scale(80%);
}
.page-order__label {
  text-transform: uppercase;
  font-weight: bold;
  font-size: var(--font-size-body-s);
  color: var(--color-accent);
}
.page-order__input_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--gap-s);
  width: 100%;
}
</style>
