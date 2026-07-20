<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { storeToRefs } from 'pinia'
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from 'vue-router'

import RecipePreview from '@/components/RecipePreview.vue'
import RecipeInfoForm from '@/components/editor/RecipeInfoForm.vue'
import RecipeIngredientsForm from '@/components/editor/RecipeIngredientsForm.vue'
import RecipeStepsForm from '@/components/editor/RecipeStepsForm.vue'

import { useRecipeStore } from '@/stores/recipeStore'
import type { Recipe } from '@/types/Recipe'

const recipeStore = useRecipeStore()

const {
  currentRecipe,
  isLoading,
  error,
} = storeToRefs(recipeStore)

const route = useRoute()
const router = useRouter()

const initialRecipeSnapshot = ref<string | null>(null)
const isLeavingAfterSave = ref(false)

const serializeRecipe = (recipe: Recipe | null): string => {
  return JSON.stringify(recipe)
}

const updateInitialSnapshot = (): void => {
  initialRecipeSnapshot.value = serializeRecipe(currentRecipe.value)
}

const hasUnsavedChanges = computed(() => {
  if (!currentRecipe.value || initialRecipeSnapshot.value === null) {
    return false
  }

  return serializeRecipe(currentRecipe.value) !== initialRecipeSnapshot.value
})

const confirmLoseChanges = (): boolean => {
  if (!hasUnsavedChanges.value || isLeavingAfterSave.value) {
    return true
  }

  return window.confirm(
    'Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?',
  )
}

const validationError = ref<string | null>(null)

const displayedError = computed(() => {
  return validationError.value || error.value
})

const normalizeRecipeBeforeSave = (): void => {
  if (!currentRecipe.value) {
    return
  }

  currentRecipe.value.title = currentRecipe.value.title.trim()
  currentRecipe.value.description = currentRecipe.value.description?.trim()
  currentRecipe.value.preparationTime = currentRecipe.value.preparationTime?.trim()
  currentRecipe.value.cookingTime = currentRecipe.value.cookingTime?.trim()

  currentRecipe.value.ingredients = currentRecipe.value.ingredients.map(
    (ingredient) => ({
      ...ingredient,
      name: ingredient.name.trim(),
      quantity: ingredient.quantity.trim(),
    }),
  )

  currentRecipe.value.steps = currentRecipe.value.steps.map(
    (step) => ({
      ...step,
      title: step.title?.trim(),
      description: step.description.trim(),
    }),
  )
}

const initializeEditor = async (): Promise<void> => {
  isLeavingAfterSave.value = false

  if (route.name === 'recipe-edit') {
    const recipeId = Array.isArray(route.params.id)
      ? route.params.id[0]
      : route.params.id

    if (!recipeId) {
      await router.push({
        name: 'home',
      })

      return
    }

    const recipeFound = await recipeStore.loadRecipe(recipeId)

    if (!recipeFound) {
      await router.push({
        name: 'home',
      })

      return
    }

    updateInitialSnapshot()

    return
  }

  recipeStore.createRecipe()
  updateInitialSnapshot()
}

watch(
  () => currentRecipe.value?.title,
  () => {
    if (
      validationError.value
      && currentRecipe.value?.title.trim()
    ) {
      validationError.value = null
    }
  },
)

const resetRecipe = async (): Promise<void> => {
  if (
    hasUnsavedChanges.value
    && !window.confirm('Annuler les modifications en cours ?')
  ) {
    return
  }

  await initializeEditor()
}

const validateCurrentRecipe = (): boolean => {
  validationError.value = null

  if (!currentRecipe.value) {
    validationError.value = 'Aucune recette à enregistrer.'
    return false
  }

  if (!currentRecipe.value.title.trim()) {
    validationError.value = 'Le titre de la recette est obligatoire.'
    return false
  }

  const invalidIngredientIndex = currentRecipe.value.ingredients.findIndex(
    (ingredient) => {
      return !ingredient.name.trim() || !ingredient.quantity.trim()
    },
  )

  if (currentRecipe.value.ingredients.length === 0) {
    validationError.value = 'La recette doit contenir au moins un ingrédient.'
    return false
  }

  if (invalidIngredientIndex !== -1) {
    validationError.value = `L’ingrédient ${invalidIngredientIndex + 1} doit avoir une quantité et un nom.`
    return false
  }

  if (currentRecipe.value.steps.length === 0) {
    validationError.value = 'La recette doit contenir au moins une étape.'
    return false
  }

  const invalidStepIndex = currentRecipe.value.steps.findIndex(
    (step) => {
      return !step.description.trim() || !step.title?.trim()
    },
  )

  if (invalidStepIndex !== -1) {
    validationError.value = `L’étape ${invalidStepIndex + 1} doit avoir un titre et une description.`
    return false
  }

  return true
}

const validateRecipe = async (): Promise<void> => {
  normalizeRecipeBeforeSave()

  if (!validateCurrentRecipe()) {
    return
  }

  const savedRecipe = await recipeStore.saveCurrentRecipe()

  if (!savedRecipe) {
    return
  }

  updateInitialSnapshot()
  isLeavingAfterSave.value = true

  await router.push({
    name: 'recipe-show',
    params: {
      id: savedRecipe.id,
    },
  })
}

onBeforeRouteLeave(() => {
  return confirmLoseChanges()
})

onBeforeRouteUpdate(() => {
  return confirmLoseChanges()
})

const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
  if (!hasUnsavedChanges.value || isLeavingAfterSave.value) {
    return
  }

  event.preventDefault()
  event.returnValue = ''
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template v-if="currentRecipe">
  <main class="editor-page">
    <div class="toolbar no-print">
      <button type="button" class="secondary-button" :disabled="isLoading" @click="resetRecipe">
        Annuler les modifications
      </button>

      <button type="button" :disabled="isLoading" @click="validateRecipe">
        {{ isLoading ? 'Enregistrement...' : 'Valider' }}
      </button>
    </div>
    <p v-if="hasUnsavedChanges" class="editor-unsaved-warning no-print">
      Modifications non enregistrées
    </p>
    <p v-if="isLoading">
      Chargement...
    </p>

    <p v-if="displayedError" class="form-error">
      {{ displayedError }}
    </p>
    <template v-if="currentRecipe">
      <div class="editor-layout">
        <section class="editor-panel no-print">
          <h1>Modifier la recette</h1>

          <RecipeInfoForm v-model:recipe="currentRecipe" />

          <RecipeIngredientsForm v-model:ingredients="currentRecipe.ingredients" />

          <RecipeStepsForm v-model:steps="currentRecipe.steps" />
        </section>

        <section class="editor-preview">
          <RecipePreview :recipe="currentRecipe" />
        </section>
      </div>
    </template>
  </main>
</template>
