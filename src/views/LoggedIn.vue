<script setup lang="ts">
// @ts-ignore
import { supabase } from "../../supabase.js";
import {ref} from "vue";

const loading = ref(false)
const handleSignOut = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    alert('Logged out!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="custom_text flex justify-center align-middle pt-60">
    <div class="font-bold text-6xl">Congrats! You logged in!</div>
  </div>
  <div class="custom_text flex justify-center align-middle pt-64">
    <button @click.prevent="handleSignOut">Logout</button>
  </div>
</template>

<style lang="scss" scoped>
.custom_text {
  color: $primary;
}
</style>