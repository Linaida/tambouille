<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notificationStore'

const notificationStore = useNotificationStore()

const {
  message,
  type,
} = storeToRefs(notificationStore)
</script>

<template>
  <Transition name="notification-toast">
    <div v-if="message" class="notification-toast no-print" :class="`notification-toast--${type}`" role="status"
      aria-live="polite">
      <span>
        {{ message }}
      </span>

      <button type="button" class="notification-toast-close" aria-label="Fermer la notification"
        @click="notificationStore.clearNotification">
        ×
      </button>
    </div>
  </Transition>
</template>

<style lang="css" scoped>
.notification-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 1000;

  display: flex;
  align-items: center;
  gap: 12px;

  width: max-content;
  max-width: min(520px, calc(100vw - 32px));
  padding: 12px 14px;

  border-radius: 12px;
  border: 1px solid #ddd5cc;
  background: white;
  color: #2d2a26;

  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
  font-size: 14px;

  transform: translateX(-50%);
}

.notification-toast--success {
  border-color: #b8d9bd;
  background: #edf8ef;
  color: #23562a;
}

.notification-toast--error {
  border-color: #e2bab4;
  background: #fff1ef;
  color: #9c2f24;
}

.notification-toast--info {
  border-color: #c8d6e5;
  background: #f0f6fb;
  color: #29455f;
}

.notification-toast-close {
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.notification-toast-enter-active,
.notification-toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.notification-toast-enter-from,
.notification-toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -8px);
}

@media (max-width: 700px) {
  .notification-toast {
    top: 16px;
    left: 16px;
    right: 16px;
    width: auto;
    max-width: none;
    transform: none;
  }

  .notification-toast-enter-from,
  .notification-toast-leave-to {
    transform: translateY(-8px);
  }
}
</style>
