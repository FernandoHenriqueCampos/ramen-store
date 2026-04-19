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
    <div class="container nav-content site-header-shell">
      <RouterLink class="brand site-header-brand" to="/">RAMEN <span>MONOLITH</span></RouterLink>

      <nav class="nav-links site-header-nav" aria-label="Primary">
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

      <RouterLink class="btn btn-primary site-header-cta" to="/menu">Reserve</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.site-header-shell {
  width: min(1400px, calc(100vw - clamp(2rem, 4vw, 5rem)));
  min-height: 72px;
  margin-inline: auto;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  column-gap: clamp(1rem, 1.8vw, 2.4rem);
}

.site-header-brand {
  font-size: clamp(0.96rem, 0.7vw + 0.72rem, 1.15rem);
  white-space: nowrap;
}

.site-header-nav {
  justify-self: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: clamp(0.7rem, 1vw, 1.4rem);
  min-width: 0;
}

.site-header-nav .nav-link {
  white-space: nowrap;
  font-size: clamp(0.68rem, 0.25vw + 0.62rem, 0.76rem);
}

.site-header-cta {
  justify-self: end;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 1280px) {
  .site-header-shell {
    width: min(1280px, calc(100vw - 2.2rem));
    column-gap: 1rem;
  }
}

@media (max-width: 1100px) {
  .site-header-shell {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'brand cta'
      'nav nav';
    row-gap: 0.55rem;
    padding: 0.75rem 0;
  }

  .site-header-brand {
    grid-area: brand;
  }

  .site-header-cta {
    grid-area: cta;
  }

  .site-header-nav {
    grid-area: nav;
    justify-self: stretch;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.2rem;
    scrollbar-width: thin;
  }
}

@media (min-width: 1600px) {
  .site-header-shell {
    width: min(1560px, calc(100vw - 8rem));
  }
}
</style>
