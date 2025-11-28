<script setup lang="ts">
import Button from '../../components/Button/Button.vue'
import copySvg from '../../assets/copy-feathericons.svg'
import { computed } from 'vue'

const props = defineProps<{
  orderString: string
}>()

const pageOrder = computed(() => props.orderString)

async function copyContent() {
  try {
    await navigator.clipboard.writeText(pageOrder.value)

    // Show and hide "Copied!" notification
    const notificationEl = document.querySelector('.page-order__notification')
    notificationEl?.setAttribute('style', 'display: inline;')
    setTimeout(() => notificationEl?.setAttribute('style', 'display: none;'), 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<template>
  <div class="page-order">
    <div class="page-order__notification">Copied!</div>
    <label class="page-order__label">Pages order</label>
    <div class="page-order__input_wrapper">
      <input class="page-order__input" :value="pageOrder" readonly />
      <Button class="page-order__copy-button" @click="copyContent" :iconBefore="copySvg"
        >Copy</Button
      >
    </div>
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
  /* Necessary for .page-order__notification positioning */
  position: relative;
}
.page-order__notification {
  display: none;
  position: absolute;
  top: calc(-0.25 * 16px);
  right: calc(0.9 * 16px);
  color: var(--color-accent);
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
