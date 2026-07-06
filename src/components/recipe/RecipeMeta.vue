<script setup lang="ts">
import type { Recipe } from '@/types/Recipe'

defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <div class="recipe-meta">
    <span v-if="recipe.servings">Pour {{ recipe.servings }} personnes</span>
    <span v-if="recipe.preparationTime">Préparation : {{ recipe.preparationTime }}</span>
    <span v-if="recipe.cookingTime">Cuisson : {{ recipe.cookingTime }}</span>
  </div>
</template>