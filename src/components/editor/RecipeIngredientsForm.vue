<script setup lang="ts">
import type { RecipeIngredient } from '@/types/Recipe'

const ingredients = defineModel<RecipeIngredient[]>('ingredients', {
    required: true,
})

const addIngredient = () => {
    ingredients.value.push({
        id: crypto.randomUUID(),
        name: '',
        quantity: '',
    })
}

const removeIngredient = (ingredientId: string) => {
    ingredients.value = ingredients.value.filter(
        (ingredient) => ingredient.id !== ingredientId,
    )
}
</script>

<template>
    <section class="form-section">
        <div class="form-section-header">
            <h2>Ingrédients</h2>

            <button type="button" class="small-button" @click="addIngredient">
                Ajouter
            </button>
        </div>

        <div v-for="ingredient in ingredients" :key="ingredient.id" class="ingredient-form-row">
            <div class="form-group">
                <label>Quantité</label>
                <input v-model="ingredient.quantity" type="text" placeholder="200 g" />
            </div>

            <div class="form-group">
                <label>Ingrédient</label>
                <input v-model="ingredient.name" type="text" placeholder="Chocolat noir" />
            </div>

            <button type="button" class="icon-button danger-button" title="Supprimer l’ingrédient"
                @click="removeIngredient(ingredient.id)">
                ×
            </button>
        </div>
    </section>
</template>