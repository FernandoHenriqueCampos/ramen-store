<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>(), {
  title: 'Confirm action',
  message: 'Are you sure you want to continue?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onEsc(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) {
    emit('cancel')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onEsc)
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[85] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
    @click.self="emit('cancel')"
  >
    <div class="w-full max-w-md rounded-2xl border border-white/20 bg-[#121212] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.55)]">
      <p class="font-headline text-2xl font-black uppercase tracking-tight text-zinc-100">{{ title }}</p>
      <p class="mt-3 text-sm text-zinc-300">{{ message }}</p>

      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          class="rounded-full border border-white/25 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-white hover:text-white"
          @click="emit('cancel')"
        >
          {{ cancelText }}
        </button>
        <button
          class="rounded-full border border-white/35 bg-white/5 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:border-white hover:bg-white/10"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
