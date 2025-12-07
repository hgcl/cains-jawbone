<script setup lang="ts">
import { ref } from 'vue'
import Button from '../Button/Button.vue'

const { initialContent } = defineProps<{ initialContent: string }>()
const emit = defineEmits<{
  (e: 'update:content', value: string): void
}>()

const content = ref<string>(initialContent)

function saveContent() {
  emit('update:content', content.value)
}
</script>

<template>
  <details open>
    <summary>Page 1</summary>
    <textarea v-model="content" />
    <Button @click="saveContent">Save</Button>
  </details>
</template>

<style scoped>
details {
  cursor: pointer;
}
</style>
