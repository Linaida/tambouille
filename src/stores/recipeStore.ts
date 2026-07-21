import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Recipe } from '@/types/Recipe'
import { createEmptyRecipe } from '@/factories/recipeFactory'
import { recipeRepository } from '@/repositories/recipeRepository'

export type ImportRecipesResult = {
  importedCount: number
  ignoredCount: number
}
const normalizeTextForComparison = (value: string | undefined): string => {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const createRecipeSignature = (recipe: Recipe): string => {
  const ingredients = recipe.ingredients.map((ingredient) => ({
    name: normalizeTextForComparison(ingredient.name),
    quantity: normalizeTextForComparison(ingredient.quantity),
  }))

  const steps = recipe.steps.map((step) => ({
    title: normalizeTextForComparison(step.title),
    description: normalizeTextForComparison(step.description),
  }))

  return JSON.stringify({
    title: normalizeTextForComparison(recipe.title),
    description: normalizeTextForComparison(recipe.description),
    ingredients,
    steps,
  })
}

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message
  }

  return defaultMessage
}

const sortRecipes = (recipes: Recipe[]): Recipe[] => {
  return [...recipes].sort((recipeA, recipeB) => {
    return new Date(recipeB.updatedAt).getTime() - new Date(recipeA.updatedAt).getTime()
  })
}

const cloneRecipe = (recipe: Recipe): Recipe => {
  return JSON.parse(JSON.stringify(recipe)) as Recipe
}

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref<Recipe[]>([])

  const currentRecipe = ref<Recipe | null>(null)

  const isLoading = ref(false)

  const error = ref<string | null>(null)

  const loadRecipes = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      recipes.value = await recipeRepository.getAll()
    } catch (exception) {
      error.value = getErrorMessage(exception, 'Impossible de charger les recettes.')
    } finally {
      isLoading.value = false
    }
  }

  const createRecipe = (): void => {
    currentRecipe.value = createEmptyRecipe()
    error.value = null
  }

  const loadRecipe = async (recipeId: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const recipe = await recipeRepository.getById(recipeId)

      if (!recipe) {
        currentRecipe.value = null
        error.value = 'Cette recette est introuvable.'

        return false
      }

      /*
       * On édite une copie.
       *
       * Cela évite que les modifications du formulaire changent
       * directement la recette présente dans la liste.
       */
      currentRecipe.value = structuredClone(recipe)

      return true
    } catch (exception) {
      currentRecipe.value = null

      error.value = getErrorMessage(exception, 'Impossible de charger cette recette.')

      return false
    } finally {
      isLoading.value = false
    }
  }

  const saveCurrentRecipe = async (): Promise<Recipe | null> => {
    if (!currentRecipe.value) {
      error.value = 'Aucune recette à enregistrer.'

      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const savedRecipe = await recipeRepository.save(currentRecipe.value)

      currentRecipe.value = structuredClone(savedRecipe)

      const recipeIndex = recipes.value.findIndex((recipe: Recipe) => recipe.id === savedRecipe.id)

      if (recipeIndex === -1) {
        recipes.value.push(savedRecipe)
      } else {
        recipes.value[recipeIndex] = savedRecipe
      }

      recipes.value = sortRecipes(recipes.value)

      return savedRecipe
    } catch (exception) {
      error.value = getErrorMessage(exception, 'Impossible d’enregistrer la recette.')

      console.error('Impossible d’enregistrer la recette.', exception)

      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteRecipe = async (recipeId: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      await recipeRepository.delete(recipeId)

      recipes.value = recipes.value.filter((recipe: Recipe) => recipe.id !== recipeId)

      if (currentRecipe.value?.id === recipeId) {
        currentRecipe.value = null
      }

      return true
    } catch (exception) {
      error.value = getErrorMessage(exception, 'Impossible de supprimer la recette.')

      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearCurrentRecipe = (): void => {
    currentRecipe.value = null
    error.value = null
  }

  const exportRecipes = async (): Promise<Recipe[]> => {
    await loadRecipes()

    return recipes.value
  }

  const importRecipes = async (recipesToImport: Recipe[]): Promise<ImportRecipesResult | null> => {
    isLoading.value = true
    error.value = null

    try {
      const existingRecipes = await recipeRepository.getAll()

      const existingRecipeIds = new Set(existingRecipes.map((recipe) => recipe.id))

      const existingRecipeSignatures = new Set(existingRecipes.map(createRecipeSignature))

      const recipesToSave: Recipe[] = []

      for (const recipeToImport of recipesToImport) {
        const recipeSignature = createRecipeSignature(recipeToImport)

        const alreadyExists =
          existingRecipeIds.has(recipeToImport.id) || existingRecipeSignatures.has(recipeSignature)

        if (alreadyExists) {
          continue
        }

        recipesToSave.push(recipeToImport)

        existingRecipeIds.add(recipeToImport.id)
        existingRecipeSignatures.add(recipeSignature)
      }

      if (recipesToSave.length > 0) {
        await recipeRepository.saveMany(recipesToSave)
      }

      await loadRecipes()

      return {
        importedCount: recipesToSave.length,
        ignoredCount: recipesToImport.length - recipesToSave.length,
      }
    } catch (exception) {
      error.value = getErrorMessage(exception, 'Impossible d’importer les recettes.')

      return null
    } finally {
      isLoading.value = false
    }
  }

  const duplicateRecipe = async (recipeId: string): Promise<Recipe | null> => {
    isLoading.value = true
    error.value = null

    try {
      const recipeToDuplicate =
        recipes.value.find((recipe) => recipe.id === recipeId) ??
        (await recipeRepository.getById(recipeId))

      if (!recipeToDuplicate) {
        error.value = 'La recette à dupliquer est introuvable.'
        return null
      }

      const now = new Date().toISOString()

      const duplicatedRecipe: Recipe = {
        ...cloneRecipe(recipeToDuplicate),
        id: crypto.randomUUID(),
        title: `${recipeToDuplicate.title || 'Recette'} - copie`,
        createdAt: now,
        updatedAt: now,
        ingredients: recipeToDuplicate.ingredients.map((ingredient) => ({
          ...ingredient,
          id: crypto.randomUUID(),
        })),
        steps: recipeToDuplicate.steps.map((step) => ({
          ...step,
          id: crypto.randomUUID(),
        })),
      }

      const savedRecipe = await recipeRepository.save(duplicatedRecipe)

      recipes.value.unshift(savedRecipe)
      recipes.value = sortRecipes(recipes.value)

      currentRecipe.value = cloneRecipe(savedRecipe)

      return savedRecipe
    } catch (exception) {
      error.value = getErrorMessage(exception, 'Impossible de dupliquer la recette.')

      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    recipes,
    currentRecipe,
    isLoading,
    error,

    loadRecipes,
    createRecipe,
    loadRecipe,
    saveCurrentRecipe,
    deleteRecipe,
    duplicateRecipe,
    clearCurrentRecipe,

    exportRecipes,
    importRecipes,
  }
})
