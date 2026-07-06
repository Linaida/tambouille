<script setup lang="ts">
import type { RecipeIngredient } from '@/types/Recipe'

defineProps<{
  ingredients: RecipeIngredient[]
}>()
</script>

<template>
  <section class="recipe-section">
    <h2>Ingrédients</h2>

    <ul class="ingredients-list">
      <li v-for="ingredient in ingredients" :key="ingredient.id">
        <span class="ingredient-quantity">{{ ingredient.quantity }}</span>
        <span>{{ ingredient.name }}</span>

        <img
          v-if="ingredient.image"
          :src="ingredient.image"
          :alt="ingredient.name"
          class="ingredient-image"
        />
      </li>
    </ul>
  </section>
</template>