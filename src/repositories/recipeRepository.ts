import { recipeDatabase } from '@/database/recipeDatabase'
import type { Recipe } from '@/types/Recipe'

const cloneRecipe = (recipe: Recipe): Recipe => {
  return JSON.parse(JSON.stringify(recipe)) as Recipe
}

export const recipeRepository = {
  async getAll(): Promise<Recipe[]> {
    return recipeDatabase.recipes.orderBy('updatedAt').reverse().toArray()
  },

  async getById(id: string): Promise<Recipe | undefined> {
    return recipeDatabase.recipes.get(id)
  },

  async save(recipe: Recipe): Promise<Recipe> {
    const recipeToSave: Recipe = {
      ...cloneRecipe(recipe),
      updatedAt: new Date().toISOString(),
    }

    await recipeDatabase.recipes.put(recipeToSave)

    return recipeToSave
  },
  async saveMany(recipes: Recipe[]): Promise<void> {
    const recipesToSave = recipes.map((recipe) => ({
      ...recipe,
      updatedAt: recipe.updatedAt || new Date().toISOString(),
      createdAt: recipe.createdAt || new Date().toISOString(),
    }))

    await recipeDatabase.recipes.bulkPut(recipesToSave)
  },

  async delete(id: string): Promise<void> {
    await recipeDatabase.recipes.delete(id)
  },
}
