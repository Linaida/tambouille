<script setup lang="ts">
import type { Recipe } from '@/types/Recipe'

defineProps<{
  recipe: Recipe
}>()

const emit = defineEmits<{
  view: [recipeId: string]
  edit: [recipeId: string]
  remove: [recipe: Recipe]
}>()
</script>

<template>
  <article class="recipe-card">
    <div class="recipe-card-image">
      <img v-if="recipe.coverImage" :src="recipe.coverImage" :alt="recipe.title" />

      <div v-else class="recipe-card-image-placeholder">
        Aucune image
      </div>
    </div>

    <div class="recipe-card-content">
      <h2>
        {{ recipe.title || 'Recette sans titre' }}
      </h2>

      <p v-if="recipe.description" class="recipe-card-description">
        {{ recipe.description }}
      </p>

      <div class="recipe-card-meta">
        <span v-if="recipe.servings">
          {{ recipe.servings }} personnes
        </span>

        <span v-if="recipe.preparationTime">
          Préparation : {{ recipe.preparationTime }}
        </span>

        <span v-if="recipe.cookingTime">
          Cuisson : {{ recipe.cookingTime }}
        </span>
      </div>
    </div>

    <div class="recipe-card-actions">
      <button type="button" @click="emit('view', recipe.id)">
        Voir
      </button>
      <button type="button" class="secondary-button" @click="emit('edit', recipe.id)">
        Modifier
      </button>

      <button type="button" class="delete-button" @click="emit('remove', recipe)">
        Supprimer
      </button>
    </div>
  </article>
</template>
