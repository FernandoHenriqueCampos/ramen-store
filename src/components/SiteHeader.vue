<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Login', to: '/login' }
]

const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <header v-if="!isAdmin" class="top-nav glass-panel">
    <div class="container nav-content">
      <RouterLink class="brand" to="/">RAMEN <span>MONOLITH</span></RouterLink>

      <nav class="nav-links" aria-label="Primary">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          class="nav-link"
          :class="{ active: route.path === link.to }"
          :to="link.to"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <RouterLink class="btn btn-primary" to="/menu">Reserve</RouterLink>
    </div>
  </header>
</template>
