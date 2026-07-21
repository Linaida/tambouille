import { ref } from 'vue'
import { defineStore } from 'pinia'

type NotificationType = 'success' | 'error' | 'info'

export const useNotificationStore = defineStore('notification', () => {
  const message = ref<string | null>(null)
  const type = ref<NotificationType>('success')

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const clearNotification = (): void => {
    message.value = null

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const showNotification = (
    text: string,
    notificationType: NotificationType = 'success',
    duration = 3000,
  ): void => {
    clearNotification()

    message.value = text
    type.value = notificationType

    timeoutId = setTimeout(() => {
      clearNotification()
    }, duration)
  }

  return {
    message,
    type,
    showNotification,
    clearNotification,
  }
})
