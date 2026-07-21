<script setup lang="ts">
import type { Recipe } from '@/types/Recipe'
import ImageUploadField from '@/components/editor/ImageUploadField.vue'
import RecipeTagsField from '@/components/editor/RecipeTagsField.vue'

const recipe = defineModel<Recipe>('recipe', {
  required: true,
})
</script>

<template>
  <section class="form-section first-section">
    <h2>Informations</h2>

    <div class="form-group">
      <label for="title">Titre</label>
      <input id="title" v-model="recipe.title" type="text" placeholder="Ex : Moelleux au chocolat" />
    </div>

    <div class="form-group">
      <label for="description">Description courte</label>
      <textarea id="description" v-model="recipe.description" rows="3"
        placeholder="Ex : Une recette simple, rapide et bien aérée." />
    </div>
    <RecipeTagsField v-model:tags="recipe.tags" />
    <ImageUploadField v-model:image="recipe.coverImage" label="Image de présentation"
      :preview-alt="recipe.title || 'Image de présentation'" />

    <div class="form-grid">
      <div class="form-group">
        <label for="servings">Personnes</label>
        <input id="servings" v-model.number="recipe.servings" type="number" min="1" />
      </div>

      <div class="form-group">
        <label for="preparationTime">Préparation</label>
        <input id="preparationTime" v-model="recipe.preparationTime" type="text" placeholder="15 min" />
      </div>

      <div class="form-group">
        <label for="cookingTime">Cuisson</label>
        <input id="cookingTime" v-model="recipe.cookingTime" type="text" placeholder="20 min" />
      </div>
    </div>
  </section>
</template>
