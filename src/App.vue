<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
// @ts-ignore
import { supabase } from "../supabase.js";
import Landing from "@/views/HomeView.vue";
import ActualLanding from "@/views/Landing.vue";

const session = ref();

onMounted(() => {
  // @ts-ignore
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });

  supabase.auth.onAuthStateChange((_: any, _session: any) => {
    session.value = _session;
  });
});
</script>

<template>
  <div id="appContainer">
    <div>
      <ActualLanding v-if="session"/>
    </div>
    <div>
      <Landing v-if="!session" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#appContainer {
  min-height: 100vh;
  background: $bg-dark;
}
</style>
