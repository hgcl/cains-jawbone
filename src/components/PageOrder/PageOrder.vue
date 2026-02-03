<template>
  <div class="page-order">
    <label class="page-order__label">Page order</label>
    <div class="page-order__input_wrapper">
      <input v-model="localInput" type="text" @keydown.enter="reviewOrderString" />
      <div class="page-order__input__buttons">
        <ButtonElement @click="reviewOrderString">Apply order</ButtonElement>
        <ShowElement ref="copyRef" class="page-order__copied">Copied!</ShowElement>
        <ButtonElement class="page-order__copy-button" @click="copyContent" :iconBefore="copySvg">
          Copy
        </ButtonElement>
      </div>
    </div>
    <ShowElement ref="showElRef">
      <NotificationInline :status="'danger'">
        {{ errorMessage }}
      </NotificationInline>
    </ShowElement>
  </div>
</template>

<script setup lang="ts">
import ButtonElement from '../ButtonElement/ButtonElement.vue'
import ShowElement from '../ShowElement/ShowElement.vue'
import NotificationInline from '../NotificationInline/NotificationInline.vue'
import copySvg from '../../assets/copy-feathericons.svg'
import { useCopyContent } from './PageOrder.utils'
import { ref, watch } from 'vue'

const { orderString } = defineProps<{
  orderString: string
}>()
const emit = defineEmits<{
  (e: 'update:orderstring', value: number[]): void
}>()

const localInput = ref<string>(orderString)
const copyRef = ref<InstanceType<typeof ShowElement> | null>(null)
const errorMessage = ref<string>()
// Exposes functions from `ShowElement`
const showElRef = ref<InstanceType<typeof ShowElement> | null>(null)

// If the parent updates orderString (e.g. drag & drop, arrows, modal actions)
// The watcher: 1) updates localInput 2) keeps the input field in sync
watch(
  () => orderString,
  (val) => {
    if (val !== localInput.value) {
      localInput.value = val
    }
  },
)

// reviewOrderString() is only called when the user clicks on "Apply order". It does:
// - character validation
// - converts the localInput string to an array of numbers
// - emits the new order string (now an array of numbers) to the parent
function reviewOrderString() {
  // 1. Check if string only contains valid characters

  // REGEX MEMO:
  // ^ and $ => match the entire string
  // [0-9,\s] => allows digits, commas, and spaces
  // * => pattern can be repeated
  const isValid = /^[0-9,\s]*$/.test(localInput.value)
  if (!isValid) {
    errorMessage.value =
      'Remove the invalid characters to apply the new page order. Only numbers, commas, and spaces are allowed.'
    showElRef.value?.show()
    return
  }

  // 2. Transform into array of numbers (= pages)
  const numberArray = localInput.value
    .split(',')
    .map(Number)
    // When there are 2 consecutive commas, a `0` is added to the array
    .filter((item) => item !== 0)

  // 3. Check if there are duplicates
  const duplicates = numberArray.filter((item, index) => numberArray.indexOf(item) !== index)
  if (duplicates.length > 0) {
    errorMessage.value = `Remove the following duplicates to apply the new page order: ${duplicates.join(', ')}`
    showElRef.value?.show()
    return
  }

  // 4. Check if there are invalid numbers
  const invalidNumbers = numberArray.filter((item) => item > 100 || item < 1)
  if (invalidNumbers.length > 0) {
    errorMessage.value = `Remove these invalid page numbers: ${invalidNumbers.join(', ')}`
    showElRef.value?.show()
    return
  }

  // 5. If all is valid, emit safely
  showElRef.value?.hide()
  emit('update:orderstring', numberArray)
}

const { copyContent } = useCopyContent(localInput, copyRef)
</script>

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

.page-order__label {
  text-transform: uppercase;
  font-weight: bold;
  font-size: var(--font-size-body-s);
  color: var(--color-accent);
}

.page-order__input_wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--gap-s);
  width: 100%;
}
.page-order__input__buttons {
  display: flex;
  flex-direction: row;
  gap: var(--gap-s);
}
.page-order__input__buttons > * {
  flex-grow: 1;
  justify-content: center;
}

.page-order__copied {
  position: absolute;
  top: calc(-0.25 * 16px);
  right: calc(0.5 * 16px);
  color: var(--color-accent);
}
</style>
