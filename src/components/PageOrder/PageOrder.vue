<script setup lang="ts">
import Button from '../../components/Button/Button.vue'
import ShowBox from '../../components/ShowBox/ShowBox.vue'
import copySvg from '../../assets/copy-feathericons.svg'
import alertSvg from '../../assets/alert-triangle-feathericons.svg'
import { useCopyContent } from './PageOrder.utils'
import { computed, ref, watch } from 'vue'

const { orderString } = defineProps<{
  orderString: string
}>()
const emit = defineEmits<{
  (e: 'updateOrderString', value: number[]): void
}>()

const localInput = ref<string>(orderString)
const copyRef = ref(null)
const warningRef = ref(null)
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
      'Remove the invalid characters to apply the new order. Only numbers, commas, and spaces are allowed.'
    warningRef.value.show()
    return
  }

  let numberArray = localInput.value.split(',').map(Number)

  // 2. Check if there are duplicates
  const duplicates = numberArray.filter((item, index) => numberArray.indexOf(item) !== index)
  if (duplicates.length > 0) {
    warningMessage.value = 'Remove the duplicates to apply the new order.'
    warningRef.value.show()
    return
  }

  // If all is valid, emit safely
  emit('updateOrderString', numberArray)
}

const { copyContent } = useCopyContent(localInput, copyRef)
</script>

<template>
  <div class="page-order">
    <ShowBox ref="copyRef" class="page-order__copied">Copied!</ShowBox>
    <label class="page-order__label">Pages order</label>
    <div class="page-order__input_wrapper">
      <input class="page-order__input" v-model="localInput" type="text" />
      <Button @click="reviewOrderString">Apply</Button>
      <Button class="page-order__copy-button" @click="copyContent" :iconBefore="copySvg"
        >Copy</Button
      >
    </div>
    <ShowBox ref="warningRef" class="page-order__warning"
      ><div :style="warningIcon"></div>
      {{ warningMessage }}</ShowBox
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
  right: calc(0.9 * 16px);
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
  /* Necessary to set height, so that child input can be 100% height */
  height: 42px;
}
.page-order__input {
  /* Reset styles */
  border: none;
  /* Custom styles */
  height: 100%;
  width: 100%;
  padding: var(--padding-xs);
  border-radius: var(--border-radius);
}
</style>
