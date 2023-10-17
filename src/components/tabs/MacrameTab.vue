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

const showBirthdayModal = ref(false);
const showEditModal = ref(false);
const loading = ref(false);
const birthdayToday = ref(false);

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
  showBirthdayModal.value = false;
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
    }
  } finally {
    loading.value = false;
  }
}

async function updateBirthdays(id?: number) {
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

async function deleteBirthday(id: number) {
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
      <UploadSupa />
        <CardTemplate link="aTsC_GP6_sI?si=Tp3g9WwNuyyKAl3v" photo="jade_leafy_bracelet.jpg" header="big leafy thing">
            <template v-slot:notes-1>
                hello
            </template>
            <template v-slot:notes-2>
                helloo
            </template>
        </CardTemplate>
    </div>
</template>

<style scoped lang="scss">

</style>