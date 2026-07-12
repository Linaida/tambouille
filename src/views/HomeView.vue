<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import RecipeCard from '@/components/recipe/RecipeCard.vue'
import { useRecipeStore } from '@/stores/recipeStore'
import type { Recipe } from '@/types/Recipe'

const router = useRouter()

const recipeStore = useRecipeStore()

const {
  recipes,
  isLoading,
  error,
} = storeToRefs(recipeStore)

onMounted(() => {
  void recipeStore.loadRecipes()
})

const createRecipe = () => {
  router.push({
    name: 'recipe-new',
  })
}

const editRecipe = (recipeId: string) => {
  router.push({
    name: 'recipe-edit',
    params: {
      id: recipeId,
    },
  })
}

const removeRecipe = async (recipe: Recipe) => {
  const recipeTitle = recipe.title || 'cette recette'

  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer « ${recipeTitle} » ?`,
  )

  if (!confirmed) {
    return
  }

  await recipeStore.deleteRecipe(recipe.id)
}
</script>

<template>
  <main class="recipes-page">
    <header class="recipes-page-header">
      <div>
        <h1>Mes recettes</h1>

        <p>
          Créez, modifiez et conservez vos recettes.
        </p>
      </div>

      <button
        type="button"
        @click="createRecipe"
      >
        Nouvelle recette
      </button>
    </header>

    <p
      v-if="error"
      class="form-error"
    >
      {{ error }}
    </p>

    <p
      v-if="isLoading && recipes.length === 0"
      class="recipes-loading"
    >
      Chargement des recettes...
    </p>

    <section
      v-else-if="recipes.length === 0"
      class="recipes-empty"
    >
      <h2>Aucune recette</h2>

      <p>
        Commencez par créer votre première recette.
      </p>

      <button
        type="button"
        @click="createRecipe"
      >
        Créer une recette
      </button>
    </section>

    <section
      v-else
      class="recipes-grid"
    >
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        @edit="editRecipe"
        @remove="removeRecipe"
      />
    </section>
  </main>
</template>
