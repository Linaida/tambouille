import type { Recipe } from '@/types/Recipe'

type RecipeBackup = {
  version: 1
  exportedAt: string
  recipes: Recipe[]
}

export const downloadRecipesBackup = (
  recipes: Recipe[],
): void => {
  const backup: RecipeBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    recipes,
  }

  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `recettes-${new Date().toISOString().slice(0, 10)}.json`
  link.click()

  URL.revokeObjectURL(url)
}

export const readRecipesBackupFile = async (
  file: File,
): Promise<Recipe[]> => {
  const content = await file.text()
  const parsed = JSON.parse(content) as RecipeBackup

  if (
    parsed.version !== 1
    || !Array.isArray(parsed.recipes)
  ) {
    throw new Error('Le fichier de sauvegarde est invalide.')
  }

  return parsed.recipes
}
