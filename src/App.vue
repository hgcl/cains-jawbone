<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
// Integrate Boost Toad feedback system
export default {
  mounted() {
    const script = document.createElement('script')
    script.src =
      'https://www.boosttoad.com/api/widget/bundle?projectId=10c326b0-a71e-474c-bd87-a0024559fadf'
    script.async = true
    document.body.appendChild(script)
  },
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background-color: var(--color-accent);
}
main {
  width: 100%;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
