<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfirmDialogStore } from '@/stores/confirmDialogStore'

const confirmDialogStore = useConfirmDialogStore()

const {
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant,
} = storeToRefs(confirmDialogStore)
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-dialog">
      <div
        v-if="isOpen"
        class="confirm-dialog-overlay no-print"
        @click.self="confirmDialogStore.cancel"
      >
        <section
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="'confirm-dialog-title'"
        >
          <h2 id="confirm-dialog-title">
            {{ title }}
          </h2>

          <p>
            {{ message }}
          </p>

          <div class="confirm-dialog-actions">
            <button
              type="button"
              class="secondary-button"
              @click="confirmDialogStore.cancel"
            >
              {{ cancelLabel }}
            </button>

            <button
              type="button"
              :class="{
                'delete-button': variant === 'danger',
              }"
              @click="confirmDialogStore.confirm"
            >
              {{ confirmLabel }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;
  background: rgba(45, 42, 38, 0.45);
}

.confirm-dialog {
  width: min(440px, 100%);
  padding: 24px;

  border-radius: 18px;
  background: white;
  color: #2d2a26;

  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.25);
}

.confirm-dialog h2 {
  margin: 0 0 10px;
  font-size: 22px;
}

.confirm-dialog p {
  margin: 0;
  color: #5f574f;
  line-height: 1.5;
}

.confirm-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.confirm-dialog-enter-active,
.confirm-dialog-leave-active {
  transition: opacity 0.18s ease;
}

.confirm-dialog-enter-active .confirm-dialog,
.confirm-dialog-leave-active .confirm-dialog {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.confirm-dialog-enter-from,
.confirm-dialog-leave-to {
  opacity: 0;
}

.confirm-dialog-enter-from .confirm-dialog,
.confirm-dialog-leave-to .confirm-dialog {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

@media (max-width: 700px) {
  .confirm-dialog {
    padding: 20px;
  }

  .confirm-dialog-actions {
    flex-direction: column-reverse;
  }

  .confirm-dialog-actions button {
    width: 100%;
  }
}
</style>
