<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import AppToastAlerts, { type AlertType, type UiAlert } from '@/components/AppToastAlerts.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { getItemStock } from '@/utils/inventory'
import { consumeInventoryForCartItems } from '@/utils/inventory'
import { appendSaleOrder } from '@/utils/sales'

const store = useStore()
const router = useRouter()
const isConfirmPaymentOpen = ref(false)
const alerts = ref<UiAlert[]>([])
let alertId = 0
const alertTimeouts = new Map<number, ReturnType<typeof setTimeout>>()

const cartItems = computed(() => store.getters['cart/items'] as Array<{ id: string; name: string; price: string; quantity: number; category: 'Ramen' | 'Drinks' | 'Sides' }>)
const cartTotalItems = computed(() => store.getters['cart/totalItems'] as number)
const cartTotalAmount = computed(() => store.getters['cart/totalAmount'] as number)
const estimatedTax = computed(() => Number((cartTotalAmount.value * 0.08).toFixed(2)))
const orderTotal = computed(() => cartTotalAmount.value + estimatedTax.value)

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`
}

function parsePriceToNumber(price: string): number {
  const normalized = price.replace(/[^0-9.]/g, '')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function isLimitedReleaseItem(id: string): boolean {
  return id.startsWith('limited-release-')
}

function increaseItemQuantity(item: { id: string; quantity: number }) {
  if (isLimitedReleaseItem(item.id)) {
    showAlert('info', 'Limit reached', 'Limited release items can only be purchased once.')
    return
  }

  const stockLimit = getItemStock(item.id)
  if (item.quantity >= stockLimit || item.quantity >= 99) {
    showAlert('info', 'Stock limit reached', 'You cannot add more than available stock.')
    return
  }

  store.dispatch('cart/updateCartItemQuantity', {
    id: item.id,
    quantity: item.quantity + 1,
  })
}

function decreaseItemQuantity(item: { id: string; quantity: number }) {
  store.dispatch('cart/updateCartItemQuantity', {
    id: item.id,
    quantity: Math.max(1, item.quantity - 1),
  })
}

function removeCartItem(id: string) {
  store.dispatch('cart/removeFromCart', id)
}

function clearCart() {
  store.dispatch('cart/clearCart')
  showAlert('info', 'Cart updated', 'Your cart has been cleared.')
}

function backToMenu() {
  router.push('/cardapio')
}

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
  }, 2800)
  alertTimeouts.set(id, timeout)
}

function openPaymentConfirmation() {
  if (cartItems.value.length === 0) return
  isConfirmPaymentOpen.value = true
}

function confirmPayment() {
  const purchasedItems = cartItems.value.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unitPrice: parsePriceToNumber(item.price),
    category: item.category,
  }))

  if (!purchasedItems.length) {
    isConfirmPaymentOpen.value = false
    return
  }

  isConfirmPaymentOpen.value = false
  appendSaleOrder({
    items: purchasedItems,
    total: orderTotal.value,
    channel: 'App',
  })
  consumeInventoryForCartItems(
    cartItems.value.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    })),
  )
  store.dispatch('cart/clearCart')
  showAlert('success', 'Purchase completed', 'Your purchase was completed successfully.')
}

function cancelPaymentConfirmation() {
  isConfirmPaymentOpen.value = false
}

onMounted(() => {
  store.dispatch('cart/syncWithInventory')

  cartItems.value.forEach((item) => {
    if (isLimitedReleaseItem(item.id) && item.quantity > 1) {
      store.dispatch('cart/updateCartItemQuantity', {
        id: item.id,
        quantity: 1,
      })
    }
  })
})

onBeforeUnmount(() => {
  alertTimeouts.forEach((timeout) => clearTimeout(timeout))
  alertTimeouts.clear()
})
</script>

<template>
  <div class="min-h-screen bg-[#101010] text-zinc-100">

    <main class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 pt-32 md:px-10">
      <header class="space-y-3">
        <p class="font-label text-xs uppercase tracking-[0.3em] text-zinc-400">Checkout</p>
        <h1 class="font-headline text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl">
          Payment
        </h1>
        <p class="text-sm text-zinc-400">
          Review your order before completing payment.
        </p>
      </header>

      <section v-if="cartItems.length === 0" class="rounded-2xl border border-white/10 bg-black/35 p-6">
        <p class="font-headline text-2xl font-bold uppercase">Your cart is empty</p>
        <button
          class="mt-5 rounded-full border border-white/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:border-white hover:bg-white/5"
          @click="backToMenu"
        >
          Back to menu
        </button>
      </section>

      <section v-else class="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-2xl border border-white/10 bg-black/35 p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-headline text-xl font-bold uppercase">Items</h2>
            <button
              class="rounded-full border border-white/25 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-white hover:text-white"
              @click="clearCart"
            >
              Clear cart
            </button>
          </div>

          <div class="space-y-3">
            <article
              v-for="item in cartItems"
              :key="item.id"
              class="rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div class="flex items-start justify-between gap-5">
                <div>
                  <p class="font-headline text-sm font-bold uppercase text-zinc-100">{{ item.name }}</p>
                  <p class="mt-1 text-xs uppercase tracking-widest text-zinc-400">
                    Line total: {{ formatMoney(parsePriceToNumber(item.price) * item.quantity) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-headline text-sm font-bold text-zinc-200">{{ item.price }}</p>
                  <button
                    class="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-400 transition-colors hover:text-white"
                    @click="removeCartItem(item.id)"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <p class="text-xs uppercase tracking-widest text-zinc-400">Quantity</p>
                <div class="flex items-center gap-2">
                  <button
                    class="h-8 w-8 rounded-full border border-white/20 text-sm font-bold text-zinc-200 transition-colors hover:border-white hover:text-white"
                    @click="decreaseItemQuantity(item)"
                  >
                    -
                  </button>
                  <span class="min-w-8 text-center font-headline text-base font-black text-zinc-100">{{ item.quantity }}</span>
                  <button
                    class="h-8 w-8 rounded-full border border-white/20 text-sm font-bold text-zinc-200 transition-colors hover:border-white hover:text-white"
                    :class="isLimitedReleaseItem(item.id) || item.quantity >= getItemStock(item.id)
                      ? 'cursor-not-allowed border-white/10 text-zinc-500 hover:border-white/10 hover:text-zinc-500'
                      : ''"
                    :disabled="isLimitedReleaseItem(item.id) || item.quantity >= getItemStock(item.id)"
                    @click="increaseItemQuantity(item)"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <aside class="h-fit rounded-2xl border border-white/10 bg-black/35 p-5">
          <h2 class="mb-5 font-headline text-xl font-bold uppercase">Summary</h2>

          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-zinc-400">Items</span>
              <span class="font-bold text-zinc-100">{{ cartTotalItems }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-zinc-400">Subtotal</span>
              <span class="font-bold text-zinc-100">{{ formatMoney(cartTotalAmount) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-zinc-400">Estimated tax (8%)</span>
              <span class="font-bold text-zinc-100">{{ formatMoney(estimatedTax) }}</span>
            </div>
            <div class="flex items-center justify-between border-t border-white/10 pt-3">
              <span class="text-zinc-400">Order total</span>
              <span class="font-headline text-2xl font-black text-zinc-100">{{ formatMoney(orderTotal) }}</span>
            </div>
          </div>

          <button
            class="mt-6 w-full rounded-full border border-white/30 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-100 transition-colors hover:border-white hover:bg-white/5"
            @click="openPaymentConfirmation"
          >
            Complete payment
          </button>

          <button
            class="mt-3 w-full rounded-full border border-white/20 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
            @click="backToMenu"
          >
            Continue shopping
          </button>
        </aside>
      </section>
    </main>

    <ConfirmDialog
      :open="isConfirmPaymentOpen"
      title="Confirm payment"
      message="Do you want to place this order and complete the payment?"
      confirm-text="Complete payment"
      cancel-text="Cancel"
      @confirm="confirmPayment"
      @cancel="cancelPaymentConfirmation"
    />

    <AppToastAlerts :alerts="alerts" />
  </div>
</template>
