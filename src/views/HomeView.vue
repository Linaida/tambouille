<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import RecipeCard from '@/components/recipe/RecipeCard.vue'
import { useRecipeStore } from '@/stores/recipeStore'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Recipe } from '@/types/Recipe'

import {
  downloadRecipesBackup,
  readRecipesBackupFile,
} from '@/utils/recipeBackup'

const router = useRouter()

const recipeStore = useRecipeStore()
const notificationStore = useNotificationStore()

const {
  recipes,
  isLoading,
  error,
} = storeToRefs(recipeStore)

onMounted(() => {
  void recipeStore.loadRecipes()
})


const createRecipe = () => {
  router.push({
    name: 'recipe-new',
  })
}

const viewRecipe = (recipeId: string): void => {
  router.push({
    name: 'recipe-show',
    params: {
      id: recipeId,
    },
  })
}

const editRecipe = (recipeId: string) => {
  router.push({
    name: 'recipe-edit',
    params: {
      id: recipeId,
    },
  })
}

const duplicateRecipe = async (recipeId: string): Promise<void> => {
  const duplicatedRecipe = await recipeStore.duplicateRecipe(recipeId)

  if (!duplicatedRecipe) {
    return
  }

  notificationStore.showNotification('Recette dupliquée.')

  await router.push({
    name: 'recipe-edit',
    params: {
      id: duplicatedRecipe.id,
    },
  })
}

const removeRecipe = async (recipe: Recipe) => {
  const recipeTitle = recipe.title || 'cette recette'

  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer « ${recipeTitle} » ?`,
  )

  if (!confirmed) {
    return
  }

  const deleted = await recipeStore.deleteRecipe(recipe.id)

  if (deleted) {
    notificationStore.showNotification('Recette supprimée.')
  }
}

const backupInput = ref<HTMLInputElement | null>(null)

const searchQuery = ref('')

const selectedTag = ref<string | null>(null)

const availableTags = computed(() => {
  const tags = recipes.value.flatMap((recipe) => recipe.tags ?? [])

  return [...new Set(tags)].sort((tagA, tagB) => {
    return tagA.localeCompare(tagB)
  })
})

const normalizeSearchText = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const normalizedSearchQuery = computed(() => {
  return normalizeSearchText(searchQuery.value)
})

const filteredRecipes = computed(() => {
  return recipes.value.filter((recipe) => {
    const matchesTag = selectedTag.value
      ? recipe.tags?.includes(selectedTag.value)
      : true

    if (!matchesTag) {
      return false
    }

    if (!normalizedSearchQuery.value) {
      return true
    }

    const searchableText = [
      recipe.title,
      recipe.description,
      ...(recipe.tags ?? []),
      ...recipe.ingredients.map((ingredient) => ingredient.name),
    ]
      .filter(Boolean)
      .join(' ')

    return normalizeSearchText(searchableText).includes(
      normalizedSearchQuery.value,
    )
  })
})
const clearSearch = (): void => {
  searchQuery.value = ''
}

const selectTag = (tag: string | null): void => {
  selectedTag.value = tag
}

const clearFilters = (): void => {
  searchQuery.value = ''
  selectedTag.value = null
}

const exportAllRecipes = async (): Promise<void> => {
  const recipesToExport = await recipeStore.exportRecipes()

  downloadRecipesBackup(recipesToExport)
}

const openImportFilePicker = (): void => {
  backupInput.value?.click()
}

const importRecipesBackup = async (event: Event): Promise<void> => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    const recipesToImport = await readRecipesBackupFile(file)

    const confirmed = window.confirm(
      `Importer ${recipesToImport.length} recette(s) ?`,
    )

    if (!confirmed) {
      return
    }

    await recipeStore.importRecipes(recipesToImport)
    notificationStore.showNotification(
      `Import terminé : ${recipesToImport.length} recette(s) importée(s) !`,
    )
  } catch {
    notificationStore.showNotification('Le fichier sélectionné est invalide.', 'error')
  } finally {
    input.value = ''
  }
}
</script>

<template>
  <main class="recipes-page">
    <header class="recipes-page-header">
      <div>
        <h1>Mes recettes</h1>

        <p>
          Créez, modifiez et conservez vos recettes.
        </p>
      </div>
      <div class="recipes-page-header-actions">
        <button type="button" class="secondary-button" @click="exportAllRecipes">
          Exporter
        </button>

        <button type="button" class="secondary-button" @click="openImportFilePicker">
          Importer
        </button>

        <button type="button" @click="createRecipe">
          Nouvelle recette
        </button>
      </div>
      <input ref="backupInput" type="file" accept="application/json" class="visually-hidden"
        @change="importRecipesBackup" />
    </header>

    <section v-if="recipes.length > 0" class="recipes-search no-print">
      <label for="recipe-search">
        Rechercher une recette
      </label>

      <div class="recipes-search-row">
        <input id="recipe-search" v-model="searchQuery" type="search" placeholder="Ex : chocolat, tomate, farine..." />

        <button v-if="searchQuery" type="button" class="secondary-button" @click="clearSearch">
          Effacer
        </button>
      </div>

      <p v-if="normalizedSearchQuery || selectedTag" class="recipes-search-results">
        {{ filteredRecipes.length }} résultat(s) trouvé(s)
      </p>
    </section>
    <section v-if="availableTags.length > 0" class="recipes-tag-filter no-print">
      <span class="recipes-tag-filter-label">
        Filtrer par tag
      </span>

      <div class="recipes-tag-filter-list">
        <button type="button" class="recipes-tag-filter-option" :class="{ 'is-selected': selectedTag === null }"
          @click="selectTag(null)">
          Tous
        </button>

        <button v-for="tag in availableTags" :key="tag" type="button" class="recipes-tag-filter-option"
          :class="{ 'is-selected': selectedTag === tag }" @click="selectTag(tag)">
          {{ tag }}
        </button>
      </div>
    </section>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <p v-if="isLoading && recipes.length === 0" class="recipes-loading">
      Chargement des recettes...
    </p>

    <section v-else-if="recipes.length === 0" class="recipes-empty">
      <h2>Aucune recette</h2>

      <p>
        Commencez par créer votre première recette.
      </p>

      <button type="button" @click="createRecipe">
        Créer une recette
      </button>
    </section>

    <section v-else-if="filteredRecipes.length === 0" class="recipes-empty">
      <h2>Aucun résultat</h2>

      <p>
        Aucune recette ne correspond à votre recherche ou au tag sélectionné.
      </p>

      <button type="button" class="secondary-button" @click="clearFilters">
        Effacer les filtres
      </button>
    </section>

    <section v-else class="recipes-grid">
      <RecipeCard v-for="recipe in filteredRecipes" :key="recipe.id" :recipe="recipe" @view="viewRecipe"
        @edit="editRecipe" @remove="removeRecipe" @duplicate="duplicateRecipe" />
    </section>
  </main>
</template>

