<script setup lang="ts">
import { onBeforeMount, onMounted, ref, toRefs } from "vue";
// @ts-ignore
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
// @ts-ignore
import ModalBackdrop from "@/components/modals/ModalBackdrop.vue";
// @ts-ignore
import { supabase } from "../../../supabase.js";

//lets deploy
const showBirthdayModal = ref(false);
const loading = ref(false);

const name = ref();
const date = ref();
const note = ref();

const birthdayData = ref();

function closeModal() {
  showBirthdayModal.value = false;
}

onMounted(() => {
  getBirthdays();
});

async function getBirthdays() {
  try {
    loading.value = true;

    let { data, error, status } = await supabase
      .from("birthdays")
      .select(`name, date, note, created_at, updated_at`);

    if (error && status !== 406) throw error;

    if (data) {
      birthdayData.value = data;
    }
    // @ts-ignore
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function updateBirthdays() {
  try {
    loading.value = true;

    const updates = {
      name: name.value,
      date: date.value,
      note: note.value,
      updated_at: new Date(),
    };

    let { error } = await supabase.from("birthdays").upsert(updates);

    if (error) throw error;
    // @ts-ignore
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
    getBirthdays();
    closeModal();
  }
}
</script>

<template>
  <div>
    <div class="text-end">
      <button
        type="button"
        @click="showBirthdayModal = !showBirthdayModal"
        class="custom_button px-2 py-1 rounded"
      >
        <p id="newLabel"><span>add birthday</span></p>
      </button>
      <ModalTemplate :show="showBirthdayModal">
        <h2 class="font-bold text-2xl text-center">new birthday</h2>
        <form class="flex flex-col justify-center">
          <label for="name">name</label>
          <input
            id="name"
            type="text"
            v-model="name"
            class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          />

          <label for="date">date</label>
          <input
            id="date"
            type="date"
            v-model="date"
            class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          />

          <label for="note">note</label>
          <textarea
            id="note"
            type="textarea"
            v-model="note"
            class="custom_input text-amber-400 rounded-lg p-2 mb-2"
          />
        </form>
        <div class="flex justify-center mt-8">
          <button
            @click="updateBirthdays"
            id="save"
            class="mx-6 px-2 py-1 rounded-lg hover:rounded-xl transition-all"
          >
            Save
          </button>
          <button
            @click.prevent="closeModal"
            id="cancel"
            class="mx-6 px-2 py-1 rounded-lg hover:rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </ModalTemplate>
      <ModalBackdrop :showBackdrop="showBirthdayModal" />
    </div>
    <div>
      <h2 class="font-bold text-2xl text-center my-12">birthdays</h2>
      <div v-for="data in birthdayData" class="text-center mx-40">
        <div class="grid grid-cols-3">
          <span>{{ data.name }}</span>
          <span>{{ data.date.split("-").reverse().join(".") }}</span>
          <span>{{ data.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h2,
label {
  color: $bg-dark;
}

label {
  font-weight: bold;
}

span {
    color: $bg-alt;
}

.custom_button {
  background: $bg-dark;
  color: $bg-alt;
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

#save {
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
