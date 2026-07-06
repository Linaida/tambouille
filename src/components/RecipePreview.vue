<script setup lang="ts">
import type { Recipe } from '@/types/Recipe'
import RecipeMeta from '@/components/recipe/RecipeMeta.vue'
import IngredientList from '@/components/recipe/IngredientList.vue'
import PreparationSteps from '@/components/recipe/PreparationSteps.vue'

defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <article class="recipe-page">
    <header class="recipe-header">
      <div class="recipe-intro">
        <h1>{{ recipe.title }}</h1>

        <p v-if="recipe.description" class="recipe-description">
          {{ recipe.description }}
        </p>

        <RecipeMeta :recipe="recipe" />
      </div>

      <img
        v-if="recipe.coverImage"
        :src="recipe.coverImage"
        :alt="recipe.title"
        class="cover-image"
      />
    </header>

    <IngredientList :ingredients="recipe.ingredients" />

    <PreparationSteps :steps="recipe.steps" />
  </article>
</template>