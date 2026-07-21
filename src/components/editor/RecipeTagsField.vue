<script setup lang="ts">
import { computed, ref } from 'vue'
import { recipeTags } from '@/data/recipeTags'

const tags = defineModel<string[] | undefined>('tags')

const customTag = ref('')

const selectedTags = computed(() => {
  return tags.value ?? []
})

const isSelected = (tag: string): boolean => {
  return selectedTags.value.includes(tag)
}

const toggleTag = (tag: string): void => {
  if (isSelected(tag)) {
    tags.value = selectedTags.value.filter((selectedTag) => selectedTag !== tag)
    return
  }

  tags.value = [...selectedTags.value, tag]
}

const addCustomTag = (): void => {
  const tag = customTag.value.trim()

  if (!tag) {
    return
  }

  if (!isSelected(tag)) {
    tags.value = [...selectedTags.value, tag]
  }

  customTag.value = ''
}
</script>

<template>
  <div class="recipe-tags-field">
    <label class="recipe-tags-label">
      Tags
    </label>

    <div class="recipe-tags-list">
      <button
        v-for="tag in recipeTags"
        :key="tag"
        type="button"
        class="recipe-tag-option"
        :class="{ 'is-selected': isSelected(tag) }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <div class="recipe-custom-tag-row">
      <input
        v-model="customTag"
        type="text"
        placeholder="Ajouter un tag personnalisé"
        @keyup.enter="addCustomTag"
      />

      <button
        type="button"
        class="secondary-button"
        @click="addCustomTag"
      >
        Ajouter
      </button>
    </div>
  </div>
</template>
