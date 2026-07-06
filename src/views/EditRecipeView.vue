<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import RecipePreview from '@/components/RecipePreview.vue'
import RecipeInfoForm from '@/components/editor/RecipeInfoForm.vue'
import RecipeIngredientsForm from '@/components/editor/RecipeIngredientsForm.vue'
import RecipeStepsForm from '@/components/editor/RecipeStepsForm.vue'
import { useRecipeStore } from '@/stores/recipeStore'

const recipeStore = useRecipeStore()
const { currentRecipe } = storeToRefs(recipeStore)

const router = useRouter()

const validateRecipe = () => {
    recipeStore.saveRecipe()
    router.push({ name: 'home' })
}
</script>

<template>
    <main class="editor-page">
        <div class="toolbar no-print">
            <button type="button" class="secondary-button" @click="recipeStore.resetRecipe">
                Réinitialiser
            </button>

            <button type="button" @click="validateRecipe">
                Valider
            </button>
        </div>

        <div class="editor-layout">
            <section class="editor-panel no-print">
                <h1>Modifier la recette</h1>

                <RecipeInfoForm v-model:recipe="currentRecipe" />

                <RecipeIngredientsForm v-model:ingredients="currentRecipe.ingredients" />

                <RecipeStepsForm v-model:steps="currentRecipe.steps" />
            </section>

            <section class="editor-preview">
                <RecipePreview :recipe="currentRecipe" />
            </section>
        </div>
    </main>
</template>