<script setup lang="ts">
import {inject, ref, watch} from "vue";

const ingredients = ref<Record<string, any>>({})
const open = ref<boolean>(false);
const name = ref<string>()
const quantity = ref<number>()
const unit = ref<string>()
const title = ref<string>()
const notes = ref<string>()

const recipeState: any = inject('recipeState')

const closeModal = () => {
  recipeState.modalOpen.value = false

  setTimeout(() => {
    name.value = quantity.value = unit.value = title.value = notes.value = undefined
  }, 300)
}

const addIngredient = () => {
  if (name.value && quantity.value && unit.value) {
    const key = Object.keys(ingredients.value).length.toString();
    ingredients.value[key] = { "name": name.value, "quantity": quantity.value, "unit": unit.value }
    name.value = quantity.value = unit.value = undefined
  }
}

const removeIngredient = (key: string) => {
  delete ingredients.value[key]
}

const saveRecipe = () => {
  if (ingredients.value && title.value && notes.value) {
    recipeState.saveRecipe(title.value, ingredients.value, notes.value)
    closeModal()
  }
}

watch(recipeState.modalOpen, () => {
  open.value = recipeState.modalOpen.value
})
</script>

<template>
  <div>
    <div v-show="open" class="backdrop"></div>
    <Transition
        tag="div"
        appear
        name="fade"
    >
      <div v-show="open" class="add-recipe-container">
        Add new recipe
        <div class="inputs">
          <div class="title">
            Title
            <input type="text" v-model="title">
          </div>
          <div class="ingredients">
            <span>Ingredients</span>
            <div class="ingredient-inputs">
              <input type="text" v-model="name" placeholder="name">
              <input type="number" v-model="quantity" placeholder="quantity">
              <input type="text" v-model="unit" placeholder="unit">
              <button @click="addIngredient">+</button>
            </div>
            <span v-for="(ingredient, key) in ingredients" :key="key">
              <button @click="removeIngredient(key)" class="remove-button">-</button>{{ ingredient.quantity }} {{ ingredient.unit }} of {{ ingredient.name }}
            </span>
          </div>
          <div class="notes">
            Notes
            <textarea type="text" v-model="notes" />
          </div>
        </div>
        <button @click="closeModal" class="close-button">close</button>
        <button class="save-button" @click="saveRecipe">save</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.backdrop {
  width: 100dvw;
  height: 100dvh;
  background: rgba(31, 29, 29, 0.7);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.add-recipe-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(31, 29, 29, 1);
  border: 1px solid white;
  border-radius: 5px;
  z-index: 11;
  padding: 1rem;
  width: 90dvw;

  @media (min-width: 1024px) {
    width: auto;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .save-button {
    margin-top: 1rem;
    margin-left: .25rem;
  }

  input {
    border-radius: 5px;
    padding: .25rem;
  }

  .inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;

    .title {
      display: flex;
      flex-direction: column;
    }

    .ingredients {
      display: flex;
      flex-direction: column;

      .remove-button {
        margin: 0 1rem 0 .25rem;
        border: 1px solid white;
        border-radius: 5px;
        padding: 0 .5rem
      }

      .ingredient-inputs {
        display: flex;
        gap: .5rem;
        margin-bottom: .5rem;

        input {
          width: 25dvw;

          @media (min-width: 1024px) {
            width: auto;
          }
        }
      }
    }

    .notes {
      display: flex;
      flex-direction: column;
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>