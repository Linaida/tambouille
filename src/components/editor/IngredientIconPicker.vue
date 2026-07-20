<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ingredientIcons } from '@/data/ingredientIcons'

const selectedIcon = defineModel<string | undefined>('icon')

const selectIcon = (icon: string): void => {
  selectedIcon.value = icon
}

const removeIcon = (): void => {
  selectedIcon.value = undefined
}
</script>

<template>
  <div class="ingredient-icon-picker">
    <div class="ingredient-icon-picker-header">
      <label>Icône</label>

      <button
        v-if="selectedIcon"
        type="button"
        class="ingredient-icon-remove-button"
        @click="removeIcon"
      >
        Retirer
      </button>
    </div>

    <div class="ingredient-icon-picker-grid">
      <button
        v-for="iconOption in ingredientIcons"
        :key="iconOption.icon"
        type="button"
        class="ingredient-icon-picker-option"
        :class="{
          'is-selected': selectedIcon === iconOption.icon,
        }"
        :title="iconOption.label"
        @click="selectIcon(iconOption.icon)"
      >
        <Icon
          :icon="iconOption.icon"
          class="ingredient-icon-picker-icon"
        />

        <span>
          {{ iconOption.label }}
        </span>
      </button>
    </div>
  </div>
</template>
