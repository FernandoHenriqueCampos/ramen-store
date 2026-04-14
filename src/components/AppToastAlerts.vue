<script setup lang="ts">
export type AlertType = 'success' | 'error' | 'info'

export interface UiAlert {
  id: number
  type: AlertType
  title: string
  message: string
}

defineProps<{
  alerts: UiAlert[]
  positionClass?: string
}>()

function getAlertStyles(type: AlertType) {
  if (type === 'success') {
    return {
      border: 'border-emerald-400/40',
      accent: 'bg-emerald-400',
      title: 'text-emerald-300',
      icon: 'check_circle',
    }
  }

  if (type === 'error') {
    return {
      border: 'border-red-400/40',
      accent: 'bg-red-400',
      title: 'text-red-300',
      icon: 'cancel',
    }
  }

  return {
    border: 'border-slate-300/40',
    accent: 'bg-slate-200',
    title: 'text-slate-100',
    icon: 'info',
  }
}
</script>

<template>
  <div
    class="pointer-events-none fixed z-[90] flex w-[min(92vw,380px)] flex-col gap-3"
    :class="positionClass ?? 'right-4 top-16 md:right-8 md:top-6'"
  >
    <TransitionGroup
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-3 opacity-0"
    >
      <aside
        v-for="alert in alerts"
        :key="alert.id"
        class="pointer-events-auto rounded-2xl border bg-black/90 p-4 shadow-[0_14px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        :class="getAlertStyles(alert.type).border"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-start gap-3">
          <span class="mt-1 h-2.5 w-2.5 rounded-full" :class="getAlertStyles(alert.type).accent"></span>
          <div class="flex-1">
            <p class="font-headline text-xs font-bold uppercase tracking-[0.2em]" :class="getAlertStyles(alert.type).title">{{ alert.title }}</p>
            <p class="mt-1 text-sm text-zinc-100">{{ alert.message }}</p>
          </div>
          <span class="material-symbols-outlined text-base text-zinc-100/90">{{ getAlertStyles(alert.type).icon }}</span>
        </div>
      </aside>
    </TransitionGroup>
  </div>
</template>
