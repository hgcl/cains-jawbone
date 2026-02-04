<template>
  <div :class="[`notification notification__${status}`]">
    <div class="notification__icon" aria-hidden="true"></div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const { status } = defineProps<{ status: 'danger' | 'success' }>()
</script>

<style scoped>
.notification {
  display: flex;
  gap: var(--gap-s);
  padding: var(--padding-xs);
  border-radius: var(--border-radius);
  font-size: var(--font-size-body-s);
  font-weight: bold;
}
.notification__danger {
  border: 1px solid var(--color-foreground-danger);
  color: var(--color-foreground-danger);
  background: var(--color-background-danger);
}
.notification__success {
  border: 1px solid var(--color-foreground-success);
  color: var(--color-foreground-success);
  background: var(--color-background-success);
}

.notification__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  transform: scale(80%);
}

.notification__danger .notification__icon {
  mask: url('../assets/alert-triangle-feathericons.svg') no-repeat center;
  background-color: var(--color-foreground-danger);
}
.notification__success .notification__icon {
  mask: url('../assets/check-circle-feathericons.svg') no-repeat center;
  background-color: var(--color-foreground-success);
}
</style>
