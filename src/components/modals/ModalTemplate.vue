<script setup lang="ts">
const props = defineProps({
      show: {
        type: Boolean,
        default: false,
      },
    }
)
</script>

<template>
  <teleport to="body">
    <div class="absolute top-60 w-screen z-20">
      <div
          v-if="props.show"
          class="flex items-start justify-center max-h-screen pt-24 text-center"
      >
        <transition
            enter-active-class="transition ease-out duration-300 transform "
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
        >
          <div
              class="custom_modal rounded-lg text-left overflow-hidden shadow-xl p-8 w-1/4"
              role="dialog"
              ref="modal"
              aria-modal="true"
              aria-labelledby="modal-headline"
          >
            <slot>I am an empty slot</slot>
          </div>
        </transition>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.custom_modal {
  background: $bg-alt;
  width: 400px;
}
</style>