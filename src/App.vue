<script setup lang="ts"></script>

<template>
  <transition name="fade">
    <router-view />
  </transition>
</template>

<style>
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
  background-color: var(--color-accent);
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}
</style>
