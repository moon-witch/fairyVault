<script setup lang="ts">
import {ref} from "vue";
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
import ModalBackdrop from "@/components/modals/ModalBackdrop.vue";
// @ts-ignore
import { supabase } from '../../../supabase.js'
import { useRouter } from 'vue-router';
const router = useRouter()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
    await router.push({ path: '/'})
  }
}

function closeModal() {
  showLoginModal.value = false;
  showRegisterModal.value = false;
}

</script>

<template>
  <button
      type="button"
      @click="showLoginModal = !showLoginModal"
      class="custom_button px-2 py-1 "
  >
    <p id="newLabel"><span>vault</span></p>
  </button>
  <ModalTemplate :show="showLoginModal">
    <h2 class="font-bold text-2xl text-center">Login</h2>
    <form class="flex flex-col justify-center">
      <label for="email">Email</label>
      <input id="email" type="email" v-model="email" class="custom_input text-amber-400 rounded-lg p-2 mb-2">

      <label for="email">Password</label>
      <input id="password" type="password" v-model="password" class="custom_input text-amber-400 rounded-lg p-2 mb-2">
    </form>
    <div class="flex justify-center mt-8">
      <button @click="handleLogin" id="login" class="mx-6 px-2 py-1 rounded-lg hover:rounded-xl transition-all">Login</button>
      <button @click.prevent="closeModal" id="cancel" class="mx-6 px-2 py-1 rounded-lg hover:rounded-xl transition-all">Cancel</button>
    </div>
  </ModalTemplate>
  <ModalBackdrop :showBackdrop="showLoginModal" />
  <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
    <div class="flex justify-center">
      <div
          v-if="loading"
          class="custom_input fixed z-30 inset-0 overflow-hidden bg-black bg-opacity-95 font-bold text-4xl text-center top-1/4 bottom-1/4 py-52"
      >
        entering the sacred halls
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
h2, label {
    color: $bg-dark;
}

label {
    font-weight: bold;
}

.custom_input {
  background: $bg-dark;
  color: $bg-bright;

  &:focus {
    background: $bg-bright;
    color: $bg-dark;
    font-weight: bolder;
  }
}

.custom_button {

  @media (min-width: 900px) {
    width: 9rem;
  }

  &#newLabel span {
    content: 'vault';
  }

  &:hover #newLabel span{
    display: none;
  }

  &:hover #newLabel:after {
    transition: 7s ease;
    cursor: none;
    content: 'login';
  }
}

.custom_link {
  color: $primary;

  &:hover {
    background: $bg-dark;
  }
}

#login {
  background: $primary;

  &:hover {
    background: $secondary;
  }
}

#cancel {
  background: $secondary;

  &:hover {
    background: $primary;
  }
}
</style>