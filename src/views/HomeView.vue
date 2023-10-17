<script setup lang="ts">
import LoginModal from "@/components/modals/LoginModal.vue";
</script>

<template>
  <main class="flex flex-col text-center">
    <h1 class="frontpage-font font-bold text-8xl mb-20 lg:mb-40">fairy <LoginModal/> </h1>
    <p class="frontpage-font text-5xl mb-6">Only for authorized entities!</p>
    <p class="frontpage-font text-4xl mx-1">Everyone else: You better leave, before it's too late!</p>
  </main>
</template>

<style lang="scss" scoped>
main {
  background-color: transparent;
  height: 100dvh;
  justify-content: center;
  align-items: center;
}

h1, p {
  color: $primary;
}
</style>
