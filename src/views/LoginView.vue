<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import UniversalMenu from '@/components/UniversalMenu.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function enterAdmin() {
  const isValid = (await store.dispatch('adminAuth/login', {
    username: username.value.trim(),
    password: password.value,
  })) as boolean

  if (!isValid) {
    errorMessage.value = 'Invalid credentials. Use admin/admin.'
    return
  }

  errorMessage.value = ''
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
        <p>Please authenticate to access the admin panel.</p>

        <form class="login-form" @submit.prevent="enterAdmin">
          <label>
            Name
            <input v-model="username" type="text" placeholder="admin" autocomplete="username" required />
          </label>

          <label>
            Password
            <input v-model="password" type="password" placeholder="admin" autocomplete="current-password" required />
          </label>

          <p v-if="errorMessage" class="text-sm text-error">{{ errorMessage }}</p>
          <button type="submit" class="btn btn-primary wide">Authenticate</button>
        </form>

        <p class="muted-line">New to the Monolith? <a href="#">Request Membership</a></p>
      </div>
    </section>
  </div>
</template>
