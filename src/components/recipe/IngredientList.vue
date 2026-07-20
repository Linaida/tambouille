<script setup lang="ts">
import type { RecipeIngredient } from '@/types/Recipe'
import { Icon } from '@iconify/vue'

defineProps<{
  ingredients: RecipeIngredient[]
}>()
</script>

<template>
  <section class="recipe-section">
    <h2>Ingrédients</h2>

    <ul class="ingredients-list">
      <li v-for="ingredient in ingredients" :key="ingredient.id">
        <span class="ingredient-icon">
          <Icon v-if="ingredient.icon" :icon="ingredient.icon" />
        </span>

        <span class="ingredient-quantity">
          {{ ingredient.quantity }}
        </span>

        <span>
          {{ ingredient.name }}
        </span>
      </li>
    </ul>
  </section>
</template>
