export type RecipeIngredient = {
  id: string
  name: string
  quantity: string
  icon?: string
}

export type RecipeStep = {
  id: string
  title?: string
  description: string
  image?: string
}

export type Recipe = {
  id: string
  title: string
  description?: string
  coverImage?: string
  servings?: number
  preparationTime?: string
  cookingTime?: string
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  createdAt: string
  updatedAt: string
  tags?: string[]
}
