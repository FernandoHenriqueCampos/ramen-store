<script setup lang="ts">
import { ref, provide, onBeforeUnmount } from 'vue'
import UniversalMenu from '@/components/UniversalMenu.vue'
import AppToastAlerts, { type AlertType, type UiAlert } from '@/components/AppToastAlerts.vue'
import AppFooter from '@/components/AppFooter.vue'

const alerts = ref<UiAlert[]>([])
let alertId = 0
const alertTimeouts = new Map<number, ReturnType<typeof setTimeout>>()

function notify(type: AlertType, title: string, message: string) {
  const id = ++alertId
  alerts.value.push({ id, type, title, message })

  const timeout = setTimeout(() => {
    alerts.value = alerts.value.filter((a) => a.id !== id)
    alertTimeouts.delete(id)
  }, 3200)
  alertTimeouts.set(id, timeout)
}

provide('notify', notify)

onBeforeUnmount(() => {
  alertTimeouts.forEach((t) => clearTimeout(t))
  alertTimeouts.clear()
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface">
    <UniversalMenu />
    <main>
      <RouterView />
    </main>
    <AppFooter />
    <AppToastAlerts :alerts="alerts" />
  </div>
</template>
