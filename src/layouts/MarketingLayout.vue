<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <div class="app-shell">
    <SiteHeader />
    <main class="page-enter">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
