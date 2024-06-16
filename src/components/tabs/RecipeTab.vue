<script setup lang="ts">
import {useRecipe} from "@/composables/useRecipe";
import {onMounted, provide, ref} from "vue";
import AddRecipeModal from "@/components/modals/AddRecipeModal.vue";

const recipeState = useRecipe()
provide('recipeState', recipeState)
const recipes = recipeState.recipes

const activeElement = ref<number | null>(null)

const toggleElement = (index: number) => {
  activeElement.value = activeElement.value === index ? null : index;
}

const openModal = () => {
  recipeState.modalOpen.value = true
}

const beforeEnter = (el: HTMLElement) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

const enter = (el: HTMLElement) => {
  el.style.height = `${el.scrollHeight}px`;
  el.style.opacity = '1';
};

const afterEnter = (el: HTMLElement) => {
  el.style.height = 'auto';
};

const leave = (el: HTMLElement) => {
  el.style.height = `${el.scrollHeight}px`;
  requestAnimationFrame(() => {
    el.style.height = '0';
    el.style.opacity = '0';
  });
};

const afterLeave = (el: HTMLElement) => {
  el.style.height = '';
  el.style.opacity = '';
};

onMounted(() => {
  recipeState.getRecipes()
})
</script>

<template>
  <div class="recipe-container">
    <ul class="recipe-list">
      <li v-for="(recipe, index) in recipes" :key="recipe.id" class="recipe">
        <span class="title">{{ recipe.title }} <button @click="toggleElement(index)">show</button></span>
        <Transition
            tag="div"
            name="slide"
            @before-enter="beforeEnter"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
        >
          <div v-show="activeElement === index" class="content">
            Ingredients
            <div class="ingredients">
              <span v-for="ingredient in recipe.ingredients">
              {{ ingredient.quantity }} {{ ingredient.unit }} of {{ ingredient.name }}
            </span>
            </div>
            <div class="notes">
              Notes
              <span>{{ recipe.notes }}</span>
            </div>
          </div>
        </Transition>
      </li>
    </ul>
    <div class="modal">
      <button class="modal-toggle" @click="openModal">add new recipe</button>
      <AddRecipeModal />
    </div>
  </div>
</template>

<style scoped lang="scss">
.recipe-container {
  display: flex;
  justify-content: center;
  position: relative;

  .recipe-list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    margin-top: 3rem;

    .recipe {
      padding: .5rem 1rem;
      border: 1px solid $bg-dark;
      border-radius: 5px;
      width: 20rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      overflow: hidden;

      .title {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-weight: 600;
        color: $bg-dark;
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        border-radius: 5px;
        width: 100%;

        .ingredients {
          display: flex;
          flex-direction: column;

          span {
            color: $bg-dark;
          }
        }
        .notes {
          display: flex;
          flex-direction: column;

          span{
            color: $bg-dark;
          }
        }

      }
    }
  }

  .modal {
    .modal-toggle {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

.slide-enter-active {
  transition: height 0.5s ease, opacity .7s ease;
}

.slide-leave-active {
  transition: height 0.5s ease, opacity .3s ease;
}

.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  height: 0;
  opacity: 0;
}
</style>