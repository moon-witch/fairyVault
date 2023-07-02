<script setup lang="ts">
// @ts-ignore
import { supabase } from "../../supabase.js";
import { ref } from "vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
// @ts-ignore
import BirthdayTab from "@/components/tabs/BirthdayTab.vue";

const loading = ref(false);
const handleSignOut = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    alert("Logged out!");
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="custom_text flex justify-center pt-32">
      <div class="frontpage-font font-bold text-7xl text-center">
        fairy's secret mangrove forest
      </div>
    </div>
    <div class="p-8">
      <TabView>
        <TabPanel header="birthdays" >
          <BirthdayTab />
        </TabPanel>
        <TabPanel header="notes">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </TabPanel>
      </TabView>
    </div>
    <div class="custom_text absolute top-4 right-8">
      <button @click.prevent="handleSignOut">Logout</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom_panel_container {
  background: $bg-alt;
}
.custom_text {
  color: $primary;
}

.p-component {
  font-family: "Montserrat", sans-serif;
}

:deep(.p-tabview-title) {
  color: $primary;
}

:deep(
    .p-tabview
      .p-tabview-nav
      li:not(.p-highlight):not(.p-disabled):hover
      .p-tabview-nav-link
  ) {
  background: $bg-dark;
  transform: translateY(2px);
  transition: 0.3s ease;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
  background: $bg-dark;
}

:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
  border-color: $bg-dark;
  background: $secondary;

  span {
    color: $bg-dark;
  }
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link:not(.p-disabled):focus) {
  outline: none;
  outline-offset: none;
  box-shadow: none;
}

:deep(.p-tabview .p-tabview-panels) {
  background-color: $secondary;
}
</style>
