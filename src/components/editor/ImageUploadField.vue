<script setup lang="ts">
import { ref } from 'vue'
import { resizeImageFile } from '@/utils/image'

const image = defineModel<string | undefined>('image')

defineProps<{
    label: string
    previewAlt?: string
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const error = ref('')
const isLoading = ref(false)

const onFileChange = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    error.value = ''

    if (!file) {
        return
    }

    if (!file.type.startsWith('image/')) {
        error.value = 'Le fichier sélectionné doit être une image.'
        return
    }

    try {
        isLoading.value = true

        image.value = await resizeImageFile(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.82,
        })
    } catch {
        error.value = 'Impossible de charger cette image.'
    } finally {
        isLoading.value = false
        input.value = ''
    }
}

const removeImage = () => {
    image.value = undefined
    error.value = ''

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}
</script>

<template>
    <div class="image-upload-field">
        <label class="image-upload-label">
            {{ label }}
        </label>

        <div v-if="image" class="image-upload-preview">
            <img :src="image" :alt="previewAlt || label" />

            <button type="button" class="secondary-button" @click="removeImage">
                Supprimer l’image
            </button>
        </div>

        <div v-else class="image-upload-empty">
            <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" />

            <p v-if="isLoading">Chargement de l’image...</p>
        </div>

        <p v-if="error" class="form-error">
            {{ error }}
        </p>
    </div>
</template>