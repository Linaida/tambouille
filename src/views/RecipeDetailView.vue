<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import RecipePreview from '@/components/RecipePreview.vue'
import { useRecipeStore } from '@/stores/recipeStore'

const route = useRoute()
const router = useRouter()

const recipeStore = useRecipeStore()

const {
  currentRecipe,
  isLoading,
  error,
} = storeToRefs(recipeStore)

const getRecipeId = (): string | null => {
  const recipeId = route.params.id

  if (Array.isArray(recipeId)) {
    return recipeId[0] ?? null
  }

  return typeof recipeId === 'string'
    ? recipeId
    : null
}

const loadRecipe = async (): Promise<void> => {
  const recipeId = getRecipeId()

  if (!recipeId) {
    return
  }

  await recipeStore.loadRecipe(recipeId)
}

const goBack = (): void => {
  router.push({
    name: 'home',
  })
}

const editRecipe = (): void => {
  const recipeId = getRecipeId()

  if (!recipeId) {
    return
  }

  router.push({
    name: 'recipe-edit',
    params: {
      id: recipeId,
    },
  })
}

const clearPrintMode = (): void => {
  document.body.classList.remove('print-compact')
}

const printRecipe = (): void => {
  clearPrintMode()
  window.print()
}

const printCompactRecipe = (): void => {
  document.body.classList.add('print-compact')

  window.addEventListener(
    'afterprint',
    clearPrintMode,
    {
      once: true,
    },
  )

  window.print()
}

onBeforeUnmount(() => {
  clearPrintMode()
})

watch(
  () => route.params.id,
  () => {
    void loadRecipe()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <main class="page">
    <div class="toolbar no-print">
      <button type="button" class="secondary-button" @click="goBack">
        Retour aux recettes
      </button>

      <button type="button" class="secondary-button" :disabled="!currentRecipe" @click="editRecipe">
        Modifier
      </button>

      <button type="button" :disabled="!currentRecipe" @click="printRecipe">
        Imprimer
      </button>
      <button type="button" :disabled="!currentRecipe" @click="printCompactRecipe">
        Imprimer sans images
      </button>
    </div>

    <p v-if="isLoading" class="recipes-loading">
      Chargement de la recette...
    </p>

    <p v-else-if="error" class="form-error">
      {{ error }}
    </p>

    <RecipePreview v-else-if="currentRecipe" :recipe="currentRecipe" />
  </main>
</template>
