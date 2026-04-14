<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import UniversalMenu from '@/components/UniversalMenu.vue'

const store = useStore()
const router = useRouter()

const cartItems = computed(() => store.getters['cart/items'] as Array<{ id: string; name: string; price: string; quantity: number }>)
const cartTotalItems = computed(() => store.getters['cart/totalItems'] as number)
const cartTotalAmount = computed(() => store.getters['cart/totalAmount'] as number)

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`
}

function backToMenu() {
  router.push('/cardapio')
}
</script>

<template>
  <div class="min-h-screen bg-[#101010] text-zinc-100">
    <UniversalMenu />

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
          <h2 class="mb-4 font-headline text-xl font-bold uppercase">Items</h2>

          <div class="space-y-3">
            <article
              v-for="item in cartItems"
              :key="item.id"
              class="rounded-xl border border-white/10 bg-black/30 p-3"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="font-headline text-sm font-bold uppercase text-zinc-100">{{ item.name }}</p>
                  <p class="mt-1 text-xs uppercase tracking-widest text-zinc-400">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-headline text-sm font-bold text-zinc-200">{{ item.price }}</p>
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
            <div class="flex items-center justify-between border-t border-white/10 pt-3">
              <span class="text-zinc-400">Total</span>
              <span class="font-headline text-2xl font-black text-zinc-100">{{ formatMoney(cartTotalAmount) }}</span>
            </div>
          </div>

          <button
            class="mt-6 w-full rounded-full border border-white/30 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-100 transition-colors hover:border-white hover:bg-white/5"
          >
            Complete payment
          </button>
        </aside>
      </section>
    </main>
  </div>
</template>
