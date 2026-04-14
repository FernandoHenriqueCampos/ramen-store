<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useStore()
const isAuthed = computed(() => store.getters['adminAuth/isAuthenticated'] as boolean)
const isCartModalOpen = ref(false)
const cartButtonRef = ref<HTMLElement | null>(null)
const cartPanelRef = ref<HTMLElement | null>(null)
const cartItems = computed(() => store.getters['cart/items'] as Array<{ id: string; name: string; price: string; quantity: number }>)
const cartTotalItems = computed(() => store.getters['cart/totalItems'] as number)
const cartTotalAmount = computed(() => store.getters['cart/totalAmount'] as number)

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`
}

function exitAdmin() {
  store.dispatch('adminAuth/logout')
  router.push('/')
}

function openCartModal() {
  isCartModalOpen.value = !isCartModalOpen.value
}

function closeCartModal() {
  isCartModalOpen.value = false
}

function removeCartItem(id: string) {
  store.dispatch('cart/removeFromCart', id)
}

function goToCheckout() {
  closeCartModal()
  router.push('/checkout')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && isCartModalOpen.value) {
    closeCartModal()
  }
}

function handleClickOutside(event: MouseEvent) {
  if (!isCartModalOpen.value) return

  const target = event.target as Node | null
  if (!target) return

  const clickedInsidePanel = cartPanelRef.value?.contains(target)
  const clickedCartButton = cartButtonRef.value?.contains(target)

  if (!clickedInsidePanel && !clickedCartButton) {
    closeCartModal()
  }
}

watch(
  () => route.path,
  () => {
    closeCartModal()
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
  window.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
  window.removeEventListener('mousedown', handleClickOutside)
})
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
        <RouterLink
          class="font-headline text-xs font-bold uppercase tracking-tighter transition-colors transition-transform duration-300 ease-out hover:scale-105"
          :class="route.path === '/cardapio' ? 'border-b-2 border-[#ff5625] pb-1 text-[#ff5625]' : 'text-[#e5e2e1] hover:text-[#ff5625]'"
          to="/cardapio"
        >
          Catalog
        </RouterLink>
      </div>

      <div class="flex items-center gap-3">
        <RouterLink
          v-if="!isAuthed"
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
          v-if="isAuthed"
          class="rounded-DEFAULT border border-outline-variant/30 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-on-surface"
          @click="exitAdmin"
        >
          Exit
        </button>

        <button
          ref="cartButtonRef"
          class="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-zinc-200 transition-colors hover:border-white/50 hover:text-white"
          aria-label="Open cart preview"
          @click="openCartModal"
        >
          <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
          <span
            v-if="cartTotalItems > 0"
            class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-white/50 bg-black px-1.5 text-[10px] font-bold leading-none text-white"
          >
            {{ cartTotalItems }}
          </span>
        </button>
      </div>
    </div>
  </nav>

  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <aside
      v-if="isCartModalOpen"
      ref="cartPanelRef"
      class="fixed right-4 top-20 z-[75] w-[min(94vw,460px)] rounded-2xl border border-white/15 bg-[#111111] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] md:right-8"
    >
      <div class="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p class="font-label text-[10px] uppercase tracking-[0.3em] text-zinc-400">Cart Preview</p>
          <h3 class="font-headline text-xl font-black uppercase tracking-tight text-zinc-100">Your Cart</h3>
        </div>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close cart preview"
          @click="closeCartModal"
        >
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <div v-if="cartItems.length === 0" class="rounded-xl border border-white/10 bg-black/35 p-4 text-sm text-zinc-400">
        Your cart is empty.
      </div>

      <div v-else class="space-y-3">
        <div class="max-h-72 space-y-2 overflow-auto pr-1">
          <article
            v-for="item in cartItems"
            :key="item.id"
            class="rounded-xl border border-white/10 bg-black/35 p-3"
          >
            <div class="flex items-start justify-between gap-3">
              <p class="font-headline text-sm font-bold uppercase text-zinc-100">{{ item.name }}</p>
              <p class="font-headline text-sm font-bold text-zinc-200">{{ item.price }}</p>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <p class="text-xs uppercase tracking-widest text-zinc-400">Qty: {{ item.quantity }}</p>
              <button
                class="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300 transition-colors hover:text-white"
                @click="removeCartItem(item.id)"
              >
                Remove
              </button>
            </div>
          </article>
        </div>

        <div class="flex items-center justify-between border-t border-white/10 pt-3">
          <p class="text-xs uppercase tracking-[0.2em] text-zinc-400">Total</p>
          <p class="font-headline text-xl font-black text-zinc-100">{{ formatMoney(cartTotalAmount) }}</p>
        </div>

        <button
          class="w-full rounded-full border border-white/30 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-100 transition-colors hover:border-white hover:bg-white/5"
          @click="goToCheckout"
        >
          Go to checkout
        </button>
      </div>
    </aside>
  </Transition>
</template>
