<script setup lang="ts">
import { RouterLink } from 'vue-router'

import RecipePreview from '@/components/RecipePreview.vue'
import { useRecipeStore } from '@/stores/recipeStore'


const recipeStore = useRecipeStore()

const printRecipe = () => {
  window.print()
}
</script>

<template>
  <main class="page">
    <div class="toolbar no-print">
      <RouterLink to="/edit" class="secondary-button">
        Modifier
      </RouterLink>

      <button type="button" @click="printRecipe">
        Imprimer la recette
      </button>
    </div>

    <RecipePreview :recipe="recipeStore.currentRecipe" />
  </main>
</template>