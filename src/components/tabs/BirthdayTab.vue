<script setup lang="ts">
import { onBeforeMount, onMounted, ref, toRefs } from "vue";
// @ts-ignore
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
// @ts-ignore
import ModalBackdrop from "@/components/modals/ModalBackdrop.vue";
// @ts-ignore
import { supabase } from "../../../supabase.js";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Checkbox from "primevue/checkbox";

const confirm = useConfirm();
const toast = useToast();

const showBirthdayModal = ref(false);
const showEditModal = ref(false);
const loading = ref(false);
const birthdayToday = ref(false);

const name = ref();
const date = ref();
const note = ref();
const isNameday = ref();

const updateName = ref();
const updateDate = ref();
const updateNote = ref();
const updatedId = ref();

const birthdayData = ref();
const months = [
  {
    name: "January",
    number: "01",
  },
  {
    name: "February",
    number: "02",
  },
  {
    name: "March",
    number: "03",
  },
  {
    name: "April",
    number: "04",
  },
  {
    name: "May",
    number: "05",
  },
  {
    name: "June",
    number: "06",
  },
  {
    name: "July",
    number: "07",
  },
  {
    name: "August",
    number: "08",
  },
  {
    name: "September",
    number: "09",
  },
  {
    name: "October",
    number: "10",
  },
  {
    name: "November",
    number: "11",
  },
  {
    name: "December",
    number: "12",
  },
];

const currentDate = ref();
const currentYear = ref();

function openEditModal(
  id: number,
  name: string,
  date: string,
  note: string,
  nameday: boolean
) {
  showEditModal.value = true;

  updateName.value = name;
  updateDate.value = date;
  updateNote.value = note;
  updatedId.value = id;
  isNameday.value = nameday;
}

function closeModal() {
  showBirthdayModal.value = false;
  showEditModal.value = false;
  name.value = null;
  date.value = null;
  note.value = null;
  isNameday.value = null;
}

onMounted(() => {
  getBirthdays();
  const today = new Date();
  currentDate.value = today
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join(".")
    .substring(0, 6);
  currentYear.value = today.getFullYear();
});

async function getBirthdays() {
  try {
    loading.value = true;

    let { data, error, status } = await supabase
      .from("birthdays")
      .select(`id, name, date, note, created_at, updated_at, isNameday`);

    if (error && status !== 406) throw error;

    if (data) {
      birthdayData.value = data;
      for (let i = 0; i < birthdayData.value.length; i++) {
        birthdayData.value[i].date = birthdayData.value[i].date
          .split("-")
          .reverse()
          .join("-");
      }
      birthdayData.value.sort(
        (a: any, b: any) => parseFloat(a.date) - parseFloat(b.date)
      );
      birthdayToday.value = birthdayData.value.some(
        (e: any) =>
          e.date.split("-").join(".").substring(0, 6) === currentDate.value
      );
    }
  } finally {
    loading.value = false;
  }
}

async function updateBirthdays(id?: number) {
  try {
    loading.value = true;

    const newEntry = {
      name: name.value,
      date: date.value,
      note: note.value,
      updated_at: new Date(),
      isNameday: isNameday.value,
    };

    const updatedEntry = {
      name: updateName.value,
      date: updateDate.value,
      note: updateNote.value,
      updated_at: new Date(),
      isNameday: isNameday.value,
    };

    if ((name.value && date.value) || (updateName.value && updateDate.value)) {
      if (!id) {
        let { error } = await supabase.from("birthdays").insert(newEntry);
        if (error) throw error;
      } else {
        let { error } = await supabase
          .from("birthdays")
          .update(updatedEntry)
          .eq("id", id);
        if (error) throw error;
      }
    }
  } finally {
    loading.value = false;
    if ((name.value && date.value) || (updateName.value && updateDate.value)) {
      getBirthdays();
      closeModal();
    }
  }
}

async function deleteBirthday(id: number) {
  try {
    loading.value = true;

    let { error } = await supabase.from("birthdays").delete().eq("id", id);

    if (error) throw error;
  } finally {
    loading.value = false;
    await getBirthdays();
    closeModal();
  }
}

const showTemplate = (event: any, currentId: number) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteConfirm",
    message: "Weally, faiwy? Dewete?",
    icon: "pi pi-question-circle",
    acceptIcon: "pi pi-check",
    rejectIcon: "pi pi-times",
    accept: () => {
      toast.add({
        severity: "warn",
        summary: "JUDGEMENT: DEATH",
        detail: "You threw the entry into the depths of hell!",
        life: 3000,
      });
      deleteBirthday(currentId);
    },
    reject: () => {
      toast.add({
        severity: "success",
        summary: "JUDGEMENT: REDEMPTION",
        detail: "You saved that entry from certain death!",
        life: 3000,
      });
    },
  });
};
</script>

<template>
  <div>
    <Toast />
    <ConfirmPopup
      style="
        background-color: rgba(31, 29, 29, 0.9);
        border-color: rgba(31, 29, 29, 0.86);
        :before {
          border-bottom-color: rgba(31, 29, 29, 0.86);
        }
        :after {
          border-bottom-color: rgba(31, 29, 29, 0.86);
        }
      "
      group="deleteConfirm"
    >
      <template #message="slotProps">
        <div class="flex p-4">
          <i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
          <p class="pl-2">{{ slotProps.message.message }}</p>
        </div>
      </template>
    </ConfirmPopup>
    <div class="text-center lg:text-end">
      <button
        type="button"
        @click="showBirthdayModal = !showBirthdayModal"
        class="custom_button lg:mr-8 px-4 py-2 rounded"
      >
        <p class="text-lg"><span>add birthday</span></p>
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
          <div class="flex justify-start">
            <Checkbox
              v-model="isNameday"
              inputId="createNameday"
              :binary="true"
            />
            <label class="text-sm ml-2" for="createNameday">Saint's day?</label>
          </div>

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
      <h2 class="font-bold text-6xl text-center my-8 frontpage-font">
        birthdays
      </h2>
      <div v-if="birthdayToday" class="flex justify-center">
        <div
          class="custom_today_container flex justify-center my-4 rounded-xl p-2.5"
        >
          <div class="custom_today_title font-bold text-xl mx-2">Today:</div>
          <div v-for="birthday in birthdayData" class="text-center">
            <div
              v-if="
                currentDate ===
                birthday.date.split('-').join('.').substring(0, 6)
              "
              class="custom_today px-2 mx-2 border rounded-2xl"
            >
              <span class="text-xl">{{ birthday.name }}</span>
              <span class="text-xl">
                {{
                  " " + "(" + (currentYear - birthday.date.split("-")[2]) + ")"
                }}</span
              >
              <span class="text-xs" v-if="birthday.isNameday">(N)</span>
            </div>
          </div>
        </div>
      </div>
      <div class="custom_container rounded-xl grid lg:grid-cols-3">
        <div v-for="month in months" class="m-1 lg:m-8 custom_card rounded">
          <div
            class="text-center mb-2 py-2 font-bold text-3xl custom_head frontpage-font"
          >
            {{ month.name }}
          </div>
          <div v-for="birthday in birthdayData" class="text-center">
            <div
              v-if="
                birthday.date.split('-').join('.').substring(3, 5) ===
                month.number
              "
              class="grid xl:grid-cols-4 py-0.5"
            >
              <span>{{ birthday.name }}</span>
              <span
                v-if="
                  currentDate ===
                  birthday.date.split('-').join('.').substring(0, 6)
                "
                class="bg-red-900 rounded"
                >{{ birthday.date.split("-").join(".") }}
                <span class="text-xs" v-if="birthday.isNameday">(N)</span>
              </span>
              <span v-else
                >{{ birthday.date.split("-").join(".") }}
                <span class="text-xs" v-if="birthday.isNameday">(N)</span></span
              >
              <span>{{ birthday.note }}</span>
              <span class="flex justify-end pr-2">
                <button
                  @click="
                    openEditModal(
                      birthday.id,
                      birthday.name,
                      birthday.date.split('-').reverse().join('-'),
                      birthday.note,
                      birthday.isNameday
                    )
                  "
                  class="mx-0.5 flex justify-center align-middle"
                >
                  <span
                    class="pi pi-pencil custom_button rounded p-1 pr-0.7"
                  ></span>
                </button>
                <button
                  @click="showTemplate($event, birthday.id)"
                  class="mx-0.5 flex justify-center align-middle"
                >
                  <span
                    class="pi pi-times custom_button rounded p-1 pr-0.7"
                  ></span>
                </button>
              </span>
            </div>
          </div>
        </div>
        <ModalTemplate :show="showEditModal">
          <h2 class="font-bold text-2xl text-center">edit entry</h2>
          <form class="flex flex-col justify-center">
            <label for="updateName">name</label>
            <input
              id="updateName"
              type="text"
              v-model="updateName"
              class="custom_input text-amber-400 rounded-lg p-2 mb-2"
              required
            />

            <label for="updateDate">date</label>
            <input
              id="updateDate"
              type="date"
              v-model="updateDate"
              class="custom_input text-amber-400 rounded-lg p-2 mb-2"
              required
            />
            <div class="flex justify-start">
              <Checkbox
                v-model="isNameday"
                inputId="editNameday"
                :binary="true"
              />
              <label class="text-sm ml-2" for="editNameday">Saint's day?</label>
            </div>

            <label for="updateNote">note</label>
            <textarea
              id="updateNote"
              type="textarea"
              v-model="updateNote"
              class="custom_input text-amber-400 rounded-lg p-2 mb-2"
              required
            />
            <div class="flex justify-center mt-8">
              <button
                type="submit"
                @click.prevent="updateBirthdays(updatedId)"
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
        <ModalBackdrop :showBackdrop="showEditModal" />
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

.custom_today_title {
  color: $bg-dark;
}

.custom_today {
  border-color: $bg-dark;

  span {
    color: $bg-dark;
  }
}

.custom_card {
  border: 2px solid $bg-dark;
  color: $bg-alt;
  min-height: 200px;

  span {
    overflow-wrap: break-word;
  }
}

.custom_head {
  background: $bg-dark;
  letter-spacing: 3px;
}

.custom_button {
  background: $bg-dark;
  color: $bg-alt;
  transition: 0.1s ease;

  &:hover {
    transition: 0.1s ease;
    box-shadow: 0 0 6px 0 $bg-dark;
    transform: scale(1.01);
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

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  border-color: $bg-dark;
  background: $bg-dark;

  :hover {
    border-color: $secondary;
    background: $secondary;
  }
}

:deep(.p-checkbox .p-checkbox-box .p-checkbox-icon) {
    color: $bg-bright;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover) {
    border-color: $secondary;
    background: $secondary;
    color: $primary;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus) {
  border-color: $bg-dark;
  background: $bg-dark;
  color: $secondary;
  box-shadow: none;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-highlight:hover) {
  border-color: $bg-dark;
  background: $bg-dark;
  color: $secondary;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box:hover) {
    border-color: $bg-dark;
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
