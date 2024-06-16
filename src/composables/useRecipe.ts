import {ref} from "vue";
// @ts-ignore
import {supabase} from "../../supabase";

type Ingredient = {
    name: string;
    quantity: number;
    unit: string;
}

type Recipe = {
    id: number;
    created_at: Date;
    title: string;
    ingredients: Record<string, Ingredient>;
    notes: string;
}

export function useRecipe() {
    const recipes = ref<Recipe[]>([])
    const modalOpen = ref<boolean>(false)

    const saveRecipe = async (title: string, ingredients: Record<string, any>, notes: string) => {
        try {
            await supabase
                .from("recipes")
                .upsert({
                    title: title,
                    ingredients: ingredients,
                    notes: notes,
                })
        } catch(e) {
            console.error(e);
        } finally {
            await getRecipes()
        }
    }

    const updateRecipe = () => {

    }

    const deleteRecipe = () => {

    }

    const getRecipes = async () => {
        try {
            let { data, error, status } = await supabase
                .from("recipes")
                .select('*');

            if (error && status !== 406) {
                console.error(error)
            }

            if (data) {
                recipes.value = data;
            }
        } catch (e) {
            console.error(e)
        }
    }

    return {modalOpen, recipes, saveRecipe, updateRecipe, deleteRecipe, getRecipes}
}