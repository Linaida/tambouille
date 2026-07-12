import type { Recipe } from '@/types/Recipe'

export const createEmptyRecipe = (): Recipe => {
  const now = new Date().toISOString()

  return {
    id: crypto.randomUUID(),

    title: '',
    description: '',
    coverImage: undefined,

    servings: undefined,
    preparationTime: '',
    cookingTime: '',

    ingredients: [],
    steps: [],

    createdAt: now,
    updatedAt: now,
  }
}
