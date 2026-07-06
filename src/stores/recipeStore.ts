import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Recipe } from '@/types/Recipe'
import { demoRecipe } from '@/data/demoRecipe'

const STORAGE_KEY = 'recipe-generator-current-recipe'

const cloneRecipe = (recipe: Recipe): Recipe => {
  return JSON.parse(JSON.stringify(recipe)) as Recipe
}

const getInitialRecipe = (): Recipe => {
  const savedRecipe = localStorage.getItem(STORAGE_KEY)

  if (!savedRecipe) {
    return cloneRecipe(demoRecipe)
  }

  try {
    return JSON.parse(savedRecipe) as Recipe
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return cloneRecipe(demoRecipe)
  }
}

export const useRecipeStore = defineStore('recipe', () => {
  const currentRecipe = ref<Recipe>(getInitialRecipe())

  const saveRecipe = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentRecipe.value))
  }

  const resetRecipe = () => {
    currentRecipe.value = cloneRecipe(demoRecipe)
    saveRecipe()
  }

  return {
    currentRecipe,
    saveRecipe,
    resetRecipe,
  }
})