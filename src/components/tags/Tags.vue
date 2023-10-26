<script setup lang="ts">
// @ts-ignore
import {supabase} from "../../../supabase";
import {ref} from "vue";
// @ts-ignore
import {vOnClickOutside} from '@vueuse/components';
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";
import {useConfirm} from "primevue/useconfirm";
import {useToast} from "primevue/usetoast";

const props = defineProps({
  tags: {
    required: true
  }
})

const emit = defineEmits(['tagsUpdated'])

const confirm = useConfirm();
const toast = useToast();

const newTag = ref<string | undefined>(undefined)

const inputExpanded = ref<boolean>(false);

async function addTag() {
  try {
    const newEntry = {
      tag: newTag.value,
      updated_at: new Date()
    };

    if (Array.isArray(props.tags) && !props.tags.includes(newTag.value)) {
      let {error} = await supabase.from("tags").insert(newEntry);
      if (error) throw error;
    }
  } finally {
    emit('tagsUpdated')
  }
}

async function deleteTag(deleteTag: string) {
  try {
    let {error} = await supabase.from("tags").delete().eq("tag", deleteTag);

    if (error) throw error;
  } finally {
    emit('tagsUpdated')
    console.log('UPDATE')
  }
}

function closeInput() {
  if (newTag.value != undefined) {
    addTag()
  }
  inputExpanded.value = false;
  newTag.value = undefined;
}

function pauseInput() {
  inputExpanded.value = false;
}

const showTemplate = (event: any, currentTag: string) => {
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
      deleteTag(currentTag);
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
  <Toast/>
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
  <div class="tag-container">
    <div class="header-input">
      <div class="header">Tags</div>
      <div class="new-input">
        <input type="text" v-model="newTag" class="tag-input" :class="{inputExpand: inputExpanded}"
               v-on-click-outside="pauseInput">
        <i v-if="!inputExpanded" class="pi pi-plus symbol" @click="inputExpanded = true"/>
        <i v-if="inputExpanded" class="pi pi-tag symbol" :class="{inputExpand: inputExpanded}" @click="closeInput"/>
      </div>
    </div>
    <div class="tags">
      <div v-if="props.tags" v-for="tag in props.tags" class="tag">
        <div class="sort">{{ tag }}</div>
        <i class="pi pi-times delete" @click="showTemplate($event, tag)"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media (max-width: 1023px) {
    display: block;
  }
}

.header-input {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 1023px) {
    justify-content: center;
    margin-top: 1rem;
  }


  .header {
    background: $bg-dark;
    color: $bg-bright;
    padding: 0.3rem;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    font-weight: bold;
  }

  .new-input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0.4rem;

    .tag-input {
      border-radius: 5px;
      margin: 0.2rem;
      width: 0;
      transition: 0.3s ease;

      &:focus-visible {
        outline: none;
      }
    }

    .inputExpand {
      width: 7rem;
      padding: 0 0.5rem;
    }

    .symbol {
      margin: 0.2rem 0.2rem 0.2rem -0.8rem;
      padding: 0.25rem 0.25rem 0.25rem 0.3rem;
      background: $bg-dark;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
      font-size: 1.6rem;

      &.inputExpand {
        width: auto;
        padding: 0.25rem 0.25rem 0.25rem 0.3rem;
        margin: 0.5rem 0.2rem 0.5rem -0.8rem;
        font-size: 1rem;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.tags {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  width: 89%;
  flex-wrap: wrap;

  @media (max-width: 1023px) {
    margin-top: 1rem;
  }

  .tag {
    background: $bg-bright;
    color: $bg-dark;
    padding: 0 0.5rem;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 0.2rem;
    height: 2rem;
    white-space: nowrap;

    .sort {
      padding: 0 0.2rem;
    }

    .delete {
      border-left: 1px dashed $bg-dark;
      padding: 0 0.2rem;
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>