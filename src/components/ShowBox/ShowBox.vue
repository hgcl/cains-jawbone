<script setup lang="ts">
import { ref } from 'vue'

defineSlots<{
  default: string
}>()

const visible = ref(false)
let timer = null

function showAndHide() {
  visible.value = true

  timer = setTimeout(() => {
    visible.value = false
  }, 2000)
}

function show() {
  visible.value = true
}

defineExpose({ show, showAndHide })
</script>

<template>
  <transition name="fade">
    <div v-if="visible">
      <slot></slot>
    </div>
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
