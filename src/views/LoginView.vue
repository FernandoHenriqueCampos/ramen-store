<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { loginAdmin } from '@/services/adminAuth'
import UniversalMenu from '@/components/UniversalMenu.vue'

const route = useRoute()
const router = useRouter()

function enterAdmin() {
  loginAdmin()
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
  router.push(redirect)
}
</script>

<template>
  <div>
    <UniversalMenu />
    <section class="login-screen">
      <div class="login-visual"></div>

      <div class="login-panel glass-panel">
        <span class="kicker">Access Portal</span>
        <h1>Welcome Back.</h1>
        <p>Please authenticate to access culinary preferences and reservations.</p>

        <form class="login-form" @submit.prevent="enterAdmin">
          <label>
            Email Identity
            <input type="email" placeholder="name@monolith.com" />
          </label>

          <label>
            Access Key
            <input type="password" placeholder="........" />
          </label>

          <button type="submit" class="btn btn-primary wide">Authenticate</button>
          <button type="button" class="btn btn-secondary wide">Biometric Login</button>
          <button type="button" class="btn btn-secondary wide" @click="enterAdmin">Enter Admin Panel</button>
        </form>

        <p class="muted-line">New to the Monolith? <a href="#">Request Membership</a></p>
      </div>
    </section>
  </div>
</template>
