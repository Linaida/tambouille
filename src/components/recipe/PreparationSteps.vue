<script setup lang="ts">
import type { RecipeStep } from '@/types/Recipe'

defineProps<{
  steps: RecipeStep[]
}>()
</script>

<template>
  <section class="recipe-section">
    <h2>Préparation</h2>

    <ol class="steps-list">
      <li v-for="step in steps" :key="step.id" class="step-item">
        <h3 v-if="step.title">{{ step.title }}</h3>
        <p>{{ step.description }}</p>

        <img
          v-if="step.image"
          :src="step.image"
          :alt="step.title || 'Étape de préparation'"
          class="step-image"
        />
      </li>
    </ol>
  </section>
</template>