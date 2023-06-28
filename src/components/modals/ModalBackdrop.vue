<script setup lang="ts">
const props = defineProps({
      showBackdrop: {
        type: Boolean,
        default: false,
      },
    }
)
</script>

<template>
  <teleport to="body">
    <transition
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
      <div
          v-if="props.showBackdrop"
          class="fixed z-10 inset-0 overflow-hidden bg-black bg-opacity-70"
      >
      </div>
    </transition>
  </teleport>
</template>