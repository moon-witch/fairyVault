<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onMounted, ref} from "vue";
// @ts-ignore
import { supabase } from '../supabase.js'
import Landing from "@/views/HomeView.vue";

const session = ref()

onMounted(() => {
  // @ts-ignore
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_: any, _session: any) => {
    session.value = _session
  })
})
</script>

<template>
  <div id="appContainer">
    <RouterView v-if="session"/>
    <Landing v-else />
  </div>
</template>

<style lang="scss" scoped>
#appContainer {
  height: 100vh;
  width: 100vw;
  background: $bg-dark;
}
</style>
