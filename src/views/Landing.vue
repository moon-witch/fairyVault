<script setup lang="ts">
// @ts-ignore
import { supabase } from "../../supabase.js";
import { ref } from "vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
// @ts-ignore
import BirthdayTab from "@/components/tabs/BirthdayTab.vue";
import MacrameTab from "@/components/tabs/MacrameTab.vue";
import TimestampTab from "@/components/tabs/TimestampTab.vue";

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
    <div class="fairy-image">
      <img src="/fairy-icon.png" style="width: 5rem;"/>
    </div>
    <div class="custom_text flex justify-center pt-32 general-header">
      <div class="frontpage-font font-bold text-7xl text-center">
        fairy's secret mangrove forest
      </div>
    </div>
    <div class="lg:p-8 pt-8 mt-3 lg:mt-0">
      <TabView>
        <TabPanel header="birthdays" >
          <BirthdayTab />
        </TabPanel>
        <TabPanel header="macrame">
          <MacrameTab />
        </TabPanel>
        <TabPanel header="timestamp">
          <TimestampTab />
        </TabPanel>
      </TabView>
    </div>
    <div class="custom_text absolute top-4 right-8">
      <button @click.prevent="handleSignOut">Logout</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.general-header {
  @media (max-width: 1023px) {
    display: none;
  }
}

.fairy-image {
  padding-top: 2rem;
  display: flex;
  justify-content: center;

  @media (min-width: 1024px) {
    position: absolute;
    left: 1.5rem;
    top: -1rem;
  }
}

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
