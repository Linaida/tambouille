<script setup lang="ts">
import type { RecipeStep } from '@/types/Recipe'
import ImageUploadField from '@/components/editor/ImageUploadField.vue'

const steps = defineModel<RecipeStep[]>('steps', {
    required: true,
})

const addStep = () => {
    steps.value.push({
        id: crypto.randomUUID(),
        title: '',
        description: '',
    })
}

const removeStep = (stepId: string) => {
    steps.value = steps.value.filter((step) => step.id !== stepId)
}
</script>

<template>
    <section class="form-section">
        <div class="form-section-header">
            <h2>Préparation</h2>

            <button type="button" class="small-button" @click="addStep">
                Ajouter
            </button>
        </div>

        <div v-for="(step, index) in steps" :key="step.id" class="step-form-card">
            <div class="step-form-header">
                <h3>Étape {{ index + 1 }}</h3>

                <button type="button" class="icon-button danger-button" title="Supprimer l’étape"
                    @click="removeStep(step.id)">
                    ×
                </button>
            </div>

            <div class="form-group">
                <label>Titre de l’étape</label>
                <input v-model="step.title" type="text" placeholder="Ex : Préparer le chocolat" />
            </div>

            <div class="form-group">
                <label>Description</label>
                <textarea v-model="step.description" rows="3" placeholder="Décris simplement cette étape." />
            </div>
            <ImageUploadField
              v-model:image="step.image"
              label="Image de l’étape — optionnelle"
              :preview-alt="step.title || `Étape ${index + 1}`"
            />

        </div>
    </section>
</template>
