<script setup lang="ts">
import { ref } from 'vue'

defineSlots<{
  default: string
}>()

const visible = ref(false)

function showAndHide() {
  visible.value = true

  setTimeout(() => {
    visible.value = false
  }, 2000)
}

function show() {
  visible.value = true
}

function hide() {
  visible.value = false
}

defineExpose({ show, showAndHide, hide })
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
