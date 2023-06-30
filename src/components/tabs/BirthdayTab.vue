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
const showEditModal = ref(false);
const loading = ref(false);

const name = ref();
const date = ref();
const note = ref();

const birthdayData = ref();
const months = [
  {name: 'January',
    number: '01'
  },
  {name: 'February',
    number: '02'
  },
  {name: 'March',
    number: '03'
  },
  {name: 'April',
    number: '04'
  },
  {name: 'May',
    number: '05'
  },
  {name: 'June',
    number: '06'
  },
  {name: 'July',
    number: '07'
  },
  {name: 'August',
    number: '08'
  },
  {name: 'September',
    number: '09'
  },
  {name: 'October',
    number: '10'
  },
  {name: 'November',
    number: '11'
  },
  {name: 'December',
    number: '12'
  }
]

const currentDate = ref();

function closeModal() {
  showBirthdayModal.value = false;
  name.value = null;
  date.value = null;
  note.value = null;
}

onMounted(() => {
  getBirthdays();
  const today = new Date;
  currentDate.value = today.toISOString().split('T')[0].split("-").reverse().join(".").substring(0,6);
});

async function getBirthdays() {
  try {
    loading.value = true;

    let { data, error, status } = await supabase
      .from("birthdays")
      .select(`id, name, date, note, created_at, updated_at`);

    if (error && status !== 406) throw error;

    if (data) {
      birthdayData.value = data;
      for (let i = 0; i < birthdayData.value.length; i++) {
        birthdayData.value[i].date = birthdayData.value[i].date.split('-').reverse().join('-')
      }
      birthdayData.value.sort((a: any, b: any) => parseFloat(a.date) - parseFloat(b.date))
    }
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

    if (name.value && date.value) {
      let {error} = await supabase.from("birthdays").upsert(updates);


      if (error) throw error;

    }
  } finally {
    loading.value = false;
    if (name.value && date.value) {
      getBirthdays();
      closeModal();
    }
  }
}

async function deleteBirthday(id: number) {
  try {
    loading.value = true;

    let { error } = await supabase.from("birthdays").delete().eq('id', id);

    if (error) throw error;
  } finally {
    loading.value = false;
    await getBirthdays();
    closeModal();
  }
}

</script>

<template>
  <div>
    <div class="text-center lg:text-end">
      <button
        type="button"
        @click="showBirthdayModal = !showBirthdayModal"
        class="custom_button lg:mr-8 mt-2 px-2 py-1 rounded"
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
            required
          />

          <label for="date">date</label>
          <input
            id="date"
            type="date"
            v-model="date"
            class="custom_input text-amber-400 rounded-lg p-2 mb-2"
            required
          />

          <label for="note">note</label>
          <textarea
            id="note"
            type="textarea"
            v-model="note"
            class="custom_input text-amber-400 rounded-lg p-2 mb-2"
            required
          />
          <div class="flex justify-center mt-8">
            <button
                type="submit"
                @click.prevent="updateBirthdays()"
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
        </form>
      </ModalTemplate>
      <ModalBackdrop :showBackdrop="showBirthdayModal" />
    </div>
    <div>
      <h2 class="font-bold text-6xl text-center my-8 frontpage-font">birthdays</h2>
      <div class="grid lg:grid-cols-3">
        <div v-for="month in months" class="m-1 lg:m-8 custom_card rounded">
          <div class="text-center mb-2 py-2 font-bold text-3xl custom_head frontpage-font">{{ month.name }}</div>
          <div v-for="data in birthdayData" class="text-center">
            <div v-if="data.date.split('-').join('.').substring(3,5) === month.number" class="grid lg:grid-cols-4">
              <span>{{ data.name }}</span>
              <span v-if="currentDate === data.date.split('-').join('.').substring(0,6)" class="bg-red-900 rounded">{{ data.date.split("-").join(".") }}</span>
              <span v-else >{{ data.date.split("-").join(".") }}</span>
              <span>{{ data.note }}</span>
              <span>
            <button @click="deleteBirthday(data.id)">
              <span class="pi pi-times custom_button rounded p-0.5"></span>
            </button>
          </span>
            </div>
          </div>
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

.custom_card {
  border: 2px solid $bg-dark;
  color: $bg-alt;
  min-height: 200px;
}

.custom_head {
  background: $bg-dark;
  letter-spacing: 3px;
}

.custom_button {
  background: $bg-dark;
  color: $bg-alt;
  transition: 0.1s ease;

  @media (max-width: 1400px) {
  }

  &:hover {
    transition: 0.1s ease;
    box-shadow: 0 0 6px 0 $bg-dark;
    transform: scale(1.01)
  }
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
