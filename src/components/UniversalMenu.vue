<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { isAdminAuthenticated, logoutAdmin } from '@/services/adminAuth'

const route = useRoute()
const router = useRouter()

function isAuthed() {
  return isAdminAuthenticated()
}

function exitAdmin() {
  logoutAdmin()
  router.push('/')
}
</script>

<template>
  <nav class="fixed top-0 z-50 w-full bg-neutral-900/60 backdrop-blur-2xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
      <RouterLink class="font-headline text-xl font-black uppercase tracking-tight text-[#e5e2e1]" to="/">
        RAMEN MONOLITH
      </RouterLink>

      <div class="hidden items-center gap-12 md:flex">
        <RouterLink
          class="font-headline text-xs font-bold uppercase tracking-tighter transition-colors transition-transform duration-300 ease-out hover:scale-105"
          :class="route.path === '/' ? 'border-b-2 border-[#ff5625] pb-1 text-[#ff5625]' : 'text-[#e5e2e1] hover:text-[#ff5625]'"
          to="/"
        >
          Home
        </RouterLink>
        <RouterLink
          class="font-headline text-xs font-bold uppercase tracking-tighter transition-colors transition-transform duration-300 ease-out hover:scale-105"
          :class="route.path === '/menu' ? 'border-b-2 border-[#ff5625] pb-1 text-[#ff5625]' : 'text-[#e5e2e1] hover:text-[#ff5625]'"
          to="/menu"
        >
          Menu
        </RouterLink>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink
          v-if="!isAuthed()"
          class="scale-95 font-headline text-xs font-bold uppercase tracking-tighter text-[#e5e2e1] transition-all duration-200 hover:text-[#ff5625]"
          to="/login"
        >
          Login
        </RouterLink>
        <RouterLink
          v-else
          class="scale-95 font-headline text-xs font-bold uppercase tracking-tighter text-[#e5e2e1] transition-all duration-200 hover:text-[#ff5625]"
          to="/admin"
        >
          Admin
        </RouterLink>

        <button
          v-if="isAuthed()"
          class="rounded-DEFAULT border border-outline-variant/30 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-on-surface"
          @click="exitAdmin"
        >
          Exit
        </button>
        <RouterLink
          v-else
          class="rounded-DEFAULT bg-gradient-to-br from-primary to-primary-container px-6 py-2 text-xs font-bold uppercase tracking-widest text-on-primary-fixed transition-transform duration-300 hover:scale-105"
          to="/menu"
        >
          Reserve
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
