<script setup lang="ts">
import CardTemplate from './../cards/CardTemplate.vue';
import UploadSupa from "@/components/buttons/UploadSupa.vue";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";
import {onMounted, ref} from "vue";
import {supabase} from "../../../supabase";
import ConfirmPopup from "primevue/confirmpopup";
import Toast from "primevue/toast";
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
import Checkbox from "primevue/checkbox";
import ModalBackdrop from "@/components/modals/ModalBackdrop.vue";

const confirm = useConfirm();
const toast = useToast();

const showMacrameModal = ref(false);
const showEditModal = ref(false);
const loading = ref(false);

const header = ref<string | null>(null)
const updateHeader = ref<string | null>(null)
const link = ref<string | null>(null)
const updateLink = ref<string | null>(null)
const photo = ref<string | null>(null)
const updatePhoto = ref<string | null>(null)
const notes1 = ref<string | null>(null)
const updateNotes1 = ref<string | null>(null)
const notes2 = ref<string | null>(null)
const updateNotes2 = ref<string | null>(null)

const macrameData = ref<any>(null)

function openEditModal(
    id: number,
    header: string,
    link: string,
    photo: string,
    notes1: string,
    notes2: string
) {
  showEditModal.value = true;

  updateHeader.value = header;
  updateLink.value = link;
  updatePhoto.value = photo;
  updateNotes1.value = notes1;
  updateNotes2.value = notes2;
}

function closeModal() {
  showMacrameModal.value = false;
  showEditModal.value = false;
  header.value = null;
  link.value = null;
  photo.value = null;
  notes1.value = null;
  notes2.value = null;
}

onMounted(() => {
  getRecipes();
});

async function getRecipes() {
  try {
    loading.value = true;

    let { data, error, status } = await supabase
        .from("macrame")
        .select(`id, link, photo, header, notes1, notes2, created_at, updated_at`);

    if (error && status !== 406) throw error;

    if (data) {
      macrameData.value = data;
      console.log(data)
    }
  } finally {
    loading.value = false;
  }
}

async function updateRecipes(id?: number) {
  try {
    loading.value = true;

    const newEntry = {
      header: header.value,
      link: link.value,
      photo: photo.value,
      notes1: notes1.value,
      notes2: notes2.value,
      updated_at: new Date()
    };

    const updatedEntry = {
      header: updateHeader.value,
      link: updateLink.value,
      photo: updatePhoto.value,
      notes1: updateNotes1.value,
      notes2: updateNotes2.value,
      updated_at: new Date()
    };

    if ((header.value && link.value) || (updateHeader.value && updateLink.value)) {
      if (!id) {
        let { error } = await supabase.from("macrame").insert(newEntry);
        if (error) throw error;
      } else {
        let { error } = await supabase
            .from("macrame")
            .update(updatedEntry)
            .eq("id", id);
        if (error) throw error;
      }
    }
  } finally {
    loading.value = false;
    if ((header.value && link.value) || (updateHeader.value && updateLink.value)) {
      await getRecipes();
      closeModal();
    }
  }
}

async function deleteRecipes(id: number) {
  try {
    loading.value = true;

    let { error } = await supabase.from("macrame").delete().eq("id", id);

    if (error) throw error;
  } finally {
    loading.value = false;
    await getRecipes();
    closeModal();
  }
}

const showTemplate = (event: any, currentId: number) => {
  confirm.require({
    target: event.currentTarget,
    group: "deleteConfirm",
    message: "Weally, Dewete?",
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
      deleteRecipes(currentId);
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
      <button
          type="button"
          @click="showMacrameModal = !showMacrameModal"
          class="custom_button lg:mr-8 px-4 py-2 rounded"
      >
        <p class="text-lg"><span>add</span></p>
      </button>
      <ModalTemplate :show="showMacrameModal">
        <h2 class="font-bold text-2xl text-center">new birthday</h2>
        <form class="flex flex-col justify-center">
          <label for="header">header</label>
          <input
              id="header"
              type="text"
              v-model="header"
              class="custom_input text-amber-400 rounded-lg p-2 mb-2"
              required
          />
          <label for="link">link</label>
          <input
              id="link"
              type="text"
              v-model="link"
              class="custom_input text-amber-400 rounded-lg p-2 mb-2"
              required
          />
          <label for="notes1">materials</label>
          <textarea
              id="notes1"
              type="textarea"
              v-model="notes1"
              class="custom_input text-amber-400 rounded-lg p-2 mb-2"
              required
          />
          <label for="notes2">good to know</label>
          <textarea
              id="notes2"
              type="textarea"
              v-model="notes2"
              class="custom_input text-amber-400 rounded-lg p-2 mb-2"
              required
          />
          <div class="flex justify-center mt-8">
            <button
                type="submit"
                @click.prevent="updateRecipes()"
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
      <ModalBackdrop :showBackdrop="showMacrameModal" />
      <div  class="recipes">
        <div v-for="recipe in macrameData">
          <CardTemplate :link="recipe.link" :photo="recipe.photo" :header="recipe.header">
            <!--            <template v-slot:upload>
                          <div class="upload">
                            <UploadSupa v-model:path="photo" @upload="updateRecipes"/>
                          </div>
                        </template>-->
            <template v-slot:notes-1>
              {{  recipe.notes1 }}
            </template>
            <template v-slot:notes-2>
              {{  recipe.notes2 }}
            </template>
            <template v-slot:action>
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
            </template>
          </CardTemplate>
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

.upload {
  display: flex;
  justify-content: center;
  color: $bg-dark;
  margin-top: 1rem;
}

.recipes {
  display: flex;
  justify-content: center;
  gap: 5rem;
}
</style>