<script setup lang="ts">
import { RouterView } from 'vue-router'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import NotificationToast from '@/components/ui/NotificationToast.vue'
</script>

<template>
  <RouterView />

  <NotificationToast />
  <ConfirmDialog />
</template>
