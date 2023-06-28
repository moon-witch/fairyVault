<script setup lang="ts">
import LoginModal from "@/components/modals/LoginModal.vue";
</script>

<template>
  <main class="flex flex-col text-center">
    <h1 class="frontpage-font font-bold text-8xl my-20 lg:my-40">the fairy <LoginModal id="login"/> </h1>
    <p class="frontpage-font text-5xl mb-6">Only for authorized entities!</p>
    <p class="frontpage-font text-4xl">Everyone else: You better leave, before it's too late!</p>
  </main>
</template>

<style lang="scss" scoped>
h1, p {
  color: $primary;
}
</style>
