<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import AppToastAlerts, { type AlertType, type UiAlert } from '@/components/AppToastAlerts.vue'
import UniversalMenu from '@/components/UniversalMenu.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const alerts = ref<UiAlert[]>([])
let alertId = 0
const alertTimeouts = new Map<number, ReturnType<typeof setTimeout>>()

function showAlert(type: AlertType, title: string, message: string): void {
  const id = ++alertId
  alerts.value.push({
    id,
    type,
    title,
    message,
  })

  const timeout = setTimeout(() => {
    alerts.value = alerts.value.filter((alert) => alert.id !== id)
    alertTimeouts.delete(id)
  }, 3200)
  alertTimeouts.set(id, timeout)
}

function handleApplyClick(): void {
  showAlert(
    'info',
    'Recruitment Closed',
    'This site has only 1 account: admin/admin. Our HR team is currently just a noodle.'
  )
}

function handleBiometricClick(): void {
  showAlert(
    'info',
    'Biometric Offline',
    'Biometric login is unavailable. The budget was fully invested in noodles and dramatic lighting.'
  )
}

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

onBeforeUnmount(() => {
  alertTimeouts.forEach((timeout) => clearTimeout(timeout))
  alertTimeouts.clear()
})
</script>

<template>
  <div class="login-page">
    <UniversalMenu />
    <section class="login-screen">
      <div class="login-visual" aria-hidden="true"></div>
      <span class="status-dot" aria-hidden="true"></span>

      <div class="login-panel">
        <div class="login-head">
          <h1>Welcome</h1>
          <p>Enter your credentials to continue.</p>
        </div>

        <form class="login-form" @submit.prevent="enterAdmin">
          <label class="field-group">
            <span class="field-caption">Identity</span>
            <input
              v-model="username"
              type="text"
              class="field-input"
              placeholder="email@domain.com"
              autocomplete="username"
              required
            />
          </label>

          <label class="field-group">
            <span class="field-row">
              <span class="field-caption">Security Key</span>
              <button
                type="button"
                class="field-action"
                :aria-label="showPassword ? 'Hide security key' : 'Show security key'"
                :title="showPassword ? 'Hide security key' : 'Show security key'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </span>
            <div class="password-wrap">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="••••••••"
                autocomplete="current-password"
                required
              />
            </div>
          </label>

          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
          <button type="submit" class="authorize-btn">Authorize</button>
          <button type="button" class="biometric-btn" @click="handleBiometricClick">
            <span class="bio-icon" aria-hidden="true"></span>
            Biometric
          </button>
        </form>

        <p class="signup-line">New member? <a href="#" @click.prevent="handleApplyClick">Apply</a></p>
      </div>
    </section>
    <AppToastAlerts :alerts="alerts" />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #131313;
}

.login-screen {
  position: relative;
  min-height: calc(100vh - 72px);
  display: grid;
  place-items: center;
  padding: 2.5rem 1rem;
  overflow: hidden;
}

.login-visual {
  position: absolute;
  inset: 0;
  background: #131313;
}

.status-dot {
  position: absolute;
  top: 0.95rem;
  left: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #f66234;
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgb(246 98 52 / 55%);
}

.login-panel {
  position: relative;
  width: min(430px, 100%);
  border-radius: 12px;
  border: 1px solid rgb(255 255 255 / 8%);
  background: #131313;
  padding: clamp(2rem, 6vw, 2.9rem) clamp(1.35rem, 5vw, 1.85rem) 1.7rem;
  box-shadow:
    0 25px 60px -42px rgb(0 0 0 / 95%),
    0 0 0 1px rgb(255 255 255 / 2%) inset,
    0 2px 8px rgb(255 255 255 / 7%);
  backdrop-filter: blur(5px);
}

.login-head {
  text-align: center;
  margin-bottom: 1.9rem;
}

.login-head h1 {
  margin: 0;
  font-weight: 500;
  font-size: clamp(1.85rem, 5vw, 2.2rem);
  line-height: 1.05;
  color: rgb(241 243 248 / 92%);
}

.login-head p {
  margin: 0.45rem auto 0;
  max-width: 28ch;
  color: rgb(200 205 215 / 48%);
  font-size: 0.9rem;
  line-height: 1.45;
}

.field-input::placeholder {
  color: rgb(145 152 165 / 36%);
}

.login-form {
  display: grid;
  gap: 1.18rem;
}

.field-group {
  display: grid;
  gap: 0.55rem;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-caption {
  font-size: 0.57rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 700;
  color: rgb(170 179 195 / 62%);
}

.field-action {
  border: 0;
  padding: 0;
  background: transparent;
  color: rgb(128 136 150 / 54%);
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-weight: 700;
  cursor: pointer;
  transition: color 170ms ease;
}

.field-action:hover {
  color: rgb(232 236 246 / 72%);
}

.field-action:focus-visible {
  outline: none;
  color: rgb(241 245 252 / 82%);
}

.password-wrap {
  position: relative;
}

.field-input {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 18%);
  background: rgb(255 255 255 / 1.5%);
  padding: 0.66rem 0.74rem;
  border-radius: 10px;
  font-size: 0.85rem;
  color: rgb(234 238 246 / 82%);
  transition: none;
}

.field-input:focus {
  outline: none;
  border-color: rgb(255 255 255 / 52%);
  box-shadow: none;
}

.error-text {
  margin: -0.1rem 0 0;
  font-size: 0.7rem;
  color: #f08f8f;
}

.authorize-btn {
  margin-top: 0.5rem;
  border: 0;
  width: 100%;
  border-radius: 10px;
  padding: 0.88rem 0.95rem;
  background: linear-gradient(180deg, #f7f8fb, #dde1e8);
  color: #141a24;
  font-size: 0.57rem;
  letter-spacing: 0.28em;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 180ms ease, filter 180ms ease;
}

.authorize-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.02);
}

.biometric-btn {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 10px;
  padding: 0.78rem 0.95rem;
  background: transparent;
  color: rgb(195 203 217 / 58%);
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.54rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: border-color 170ms ease, color 170ms ease;
}

.biometric-btn:hover {
  border-color: rgb(255 255 255 / 19%);
  color: rgb(223 229 239 / 78%);
}

.bio-icon {
  width: 0.72rem;
  height: 0.72rem;
  border-radius: 999px;
  border: 1px solid rgb(160 172 190 / 45%);
  position: relative;
}

.bio-icon::before,
.bio-icon::after {
  content: '';
  position: absolute;
  inset: 2px;
  border: 1px solid rgb(160 172 190 / 42%);
  border-radius: 999px;
}

.bio-icon::after {
  inset: 4px;
}

.signup-line {
  margin: 1.65rem 0 0;
  text-align: center;
  font-size: 0.52rem;
  text-transform: uppercase;
  letter-spacing: 0.21em;
  color: rgb(157 166 180 / 46%);
}

.signup-line a {
  margin-left: 0.38rem;
  color: rgb(231 236 245 / 78%);
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 480px) {
  .login-panel {
    border-radius: 11px;
    padding: 1.7rem 1.15rem 1.4rem;
  }

  .login-head h1 {
    font-size: 1.65rem;
  }

  .login-form {
    gap: 1rem;
  }
}
</style>
