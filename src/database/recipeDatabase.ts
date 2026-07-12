import Dexie, { type EntityTable } from 'dexie'
import type { Recipe } from '@/types/Recipe'

export const recipeDatabase = new Dexie(
  'recipe-generator',
) as Dexie & {
  recipes: EntityTable<Recipe, 'id'>
}

recipeDatabase.version(1).stores({
  recipes: 'id, title, createdAt, updatedAt',
})
