<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useRoute,
  useRouter,
} from 'vue-router'
import RecipePreview from '@/components/RecipePreview.vue'
import RecipeInfoForm from '@/components/editor/RecipeInfoForm.vue'
import RecipeIngredientsForm from '@/components/editor/RecipeIngredientsForm.vue'
import RecipeStepsForm from '@/components/editor/RecipeStepsForm.vue'
import { useRecipeStore } from '@/stores/recipeStore'

const route = useRoute()
const router = useRouter()


const recipeStore = useRecipeStore()
const {
  currentRecipe,
  isLoading,
  error,
} = storeToRefs(recipeStore)

const initializeEditor = async (): Promise<void> => {
  if (route.name === 'recipe-edit') {
    const recipeId = Array.isArray(route.params.id)
      ? route.params.id[0]
      : route.params.id

    if (!recipeId) {
      await router.push({
        name: 'home',
      })

      return
    }

    const recipeFound = await recipeStore.loadRecipe(
      recipeId,
    )

    if (!recipeFound) {
      await router.push({
        name: 'home',
      })
    }

    return
  }

  recipeStore.createRecipe()
}

const validateRecipe = async () => {
  const savedRecipe = await recipeStore.saveCurrentRecipe()

  if (!savedRecipe) {
    return
  }

  await router.push({
    name: 'recipe-show',
    params: {
      id: savedRecipe.id,
    },
  })
}

const resetRecipe = async (): Promise<void> => {
  await initializeEditor()
}


watch(
  () => route.fullPath,
  () => {
    void initializeEditor()
  },
  {
    immediate: true,
  },
)
</script>

<template v-if="currentRecipe">
  <main class="editor-page">
    <div class="toolbar no-print">
      <button type="button" class="secondary-button" @click="resetRecipe">
        Réinitialiser
      </button>

      <button type="button" @click="validateRecipe">
        Valider
      </button>
    </div>
    <p v-if="isLoading">
      Chargement...
    </p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>
    <template v-if="currentRecipe">
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
    </template>
  </main>
</template>
