import { ref } from 'vue'
import { defineStore } from 'pinia'

type ConfirmDialogVariant = 'default' | 'danger'

type ConfirmDialogOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmDialogVariant
}

export const useConfirmDialogStore = defineStore('confirmDialog', () => {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmLabel = ref('Confirmer')
  const cancelLabel = ref('Annuler')
  const variant = ref<ConfirmDialogVariant>('default')

  let resolver: ((confirmed: boolean) => void) | null = null

  const resetDialog = (): void => {
    isOpen.value = false
    title.value = ''
    message.value = ''
    confirmLabel.value = 'Confirmer'
    cancelLabel.value = 'Annuler'
    variant.value = 'default'
  }

  const showConfirm = (
    options: ConfirmDialogOptions,
  ): Promise<boolean> => {
    if (resolver) {
      resolver(false)
    }

    title.value = options.title
    message.value = options.message
    confirmLabel.value = options.confirmLabel ?? 'Confirmer'
    cancelLabel.value = options.cancelLabel ?? 'Annuler'
    variant.value = options.variant ?? 'default'
    isOpen.value = true

    return new Promise((resolve) => {
      resolver = resolve
    })
  }

  const confirm = (): void => {
    resolver?.(true)
    resolver = null
    resetDialog()
  }

  const cancel = (): void => {
    resolver?.(false)
    resolver = null
    resetDialog()
  }

  return {
    isOpen,
    title,
    message,
    confirmLabel,
    cancelLabel,
    variant,

    showConfirm,
    confirm,
    cancel,
  }
})
