<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useStore } from 'vuex'

import AppToastAlerts, { type AlertType, type UiAlert } from '@/components/AppToastAlerts.vue'
import UniversalMenu from '@/components/UniversalMenu.vue'
import { defaultUserCatalogItems } from '@/data/userMenuItems'
import type { RootState } from '@/store'
import { getItemStock } from '@/utils/inventory'

const store = useStore<RootState>()
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
  }, 2800)
  alertTimeouts.set(id, timeout)
}

async function addRamenToCart(itemId: string): Promise<void> {
  if (getItemStock(itemId) <= 0) {
    showAlert('error', 'Out of stock', 'This item is currently unavailable.')
    return
  }

  const item = defaultUserCatalogItems.find((menuItem) => menuItem.id === itemId)
  if (!item) {
    showAlert('error', 'Unable to add', 'We could not find this ramen item.')
    return
  }

  try {
    const didAdd = (await store.dispatch('cart/addItemToCart', {
      item: {
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        image: item.image,
      },
      quantity: 1,
    })) as boolean

    if (!didAdd) {
      showAlert('info', 'Stock limit reached', 'You already have the maximum available quantity in your cart.')
      return
    }

    showAlert('success', 'Added to cart', `${item.name} has been added to your cart.`)
  } catch {
    showAlert('error', 'Unable to add', 'We could not update your cart right now.')
  }
}

function isOutOfStock(itemId: string): boolean {
  return getItemStock(itemId) <= 0
}

onBeforeUnmount(() => {
  alertTimeouts.forEach((timeout) => clearTimeout(timeout))
  alertTimeouts.clear()
})
</script>

<template>
  <div class="bg-[#131313] font-body text-on-surface selection:bg-primary-container selection:text-on-primary-fixed">
    <UniversalMenu />

    <main class="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12">
      <header class="mb-20 space-y-4">
        <span class="block font-label text-xs uppercase tracking-[0.3em] text-primary-container">Engineered Umami</span>
        <h1 class="mb-8 font-headline text-6xl font-extrabold uppercase leading-[0.85] tracking-tighter md:text-8xl">
          The <br>Collection
        </h1>
        <p class="max-w-xl text-lg font-light leading-relaxed text-on-surface-variant">
          Our menu is a precise calibration of traditional technique and modern gastronomy. Every bowl is an architectural build of flavor.
        </p>
      </header>

      <section class="mb-32">
        <div class="mb-12 flex items-baseline justify-between">
          <h2 class="font-headline text-4xl font-bold uppercase tracking-tight">01 / Ramen</h2>
          <span class="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-50">Signature Bowls</span>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div class="group relative overflow-hidden bg-surface-container-low md:col-span-8" :class="isOutOfStock('ramen-monolith-tonkotsu') ? 'opacity-45 saturate-0' : ''">
            <div class="aspect-[16/9] w-full overflow-hidden">
              <img alt="Signature Tonkotsu" class="h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Close-up of premium tonkotsu ramen with creamy broth, soft-boiled egg, and seared pork belly on a dark ceramic background with moody lighting" src="../assets/images/menu-monolith-tonkotsu.png">
            </div>
            <div class="flex h-full flex-col justify-between p-8">
              <div>
                <div class="mb-4 flex items-start justify-between">
                  <h3 class="font-headline text-3xl font-bold uppercase tracking-tight">The Monolith Tonkotsu</h3>
                  <span class="font-headline text-xl font-bold text-primary-container">$24.0</span>
                </div>
                <p class="max-w-md text-sm font-light leading-loose text-on-surface-variant">
                  48-hour bone marrow reduction, triple-pressed alkaline noodles, house-cured chashu, and a precise 6.5-minute organic egg.
                </p>
                <div class="mt-5">
                  <button
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/35 text-sm text-on-surface transition-colors hover:border-primary-container hover:bg-primary-container hover:text-on-primary-fixed"
                    type="button"
                    :class="isOutOfStock('ramen-monolith-tonkotsu') ? 'cursor-not-allowed opacity-40 hover:border-outline-variant/35 hover:bg-transparent hover:text-on-surface' : ''"
                    :disabled="isOutOfStock('ramen-monolith-tonkotsu')"
                    @click="addRamenToCart('ramen-monolith-tonkotsu')"
                  >
                    <span class="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              </div>
              <div class="mt-8 flex gap-3">
                <span class="bg-surface-container-highest px-3 py-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Signature</span>
                <span class="bg-surface-container-highest px-3 py-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Intense Umami</span>
              </div>
            </div>
          </div>

          <div class="group flex flex-col bg-surface-container md:col-span-4" :class="isOutOfStock('ramen-thermal-miso') ? 'opacity-45 saturate-0' : ''">
            <div class="aspect-square w-full overflow-hidden">
              <img alt="Spicy Miso" class="h-full w-full object-cover grayscale-[60%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Overhead shot of spicy red miso ramen with chili oil droplets and green scallions in a black bowl against obsidian background" src="../assets/images/menu-thermal-miso.png">
            </div>
            <div class="flex-grow p-6">
              <div class="mb-2 flex items-start justify-between">
                <h3 class="font-headline text-xl font-bold uppercase">Thermal Miso</h3>
                <span class="font-headline font-bold text-primary-container">$21.0</span>
              </div>
              <p class="mb-2 text-xs font-light leading-relaxed text-on-surface-variant">
                Fermented chili paste, charred corn, and high-tensile rye noodles. A thermal gradient of heat.
              </p>
              <div class="mt-4">
                <button
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/35 text-sm text-on-surface transition-colors hover:border-primary-container hover:bg-primary-container hover:text-on-primary-fixed"
                  type="button"
                  :class="isOutOfStock('ramen-thermal-miso') ? 'cursor-not-allowed opacity-40 hover:border-outline-variant/35 hover:bg-transparent hover:text-on-surface' : ''"
                  :disabled="isOutOfStock('ramen-thermal-miso')"
                  @click="addRamenToCart('ramen-thermal-miso')"
                >
                  <span class="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>
          </div>

          <div class="group flex flex-col bg-surface-container md:col-span-4" :class="isOutOfStock('ramen-synthetic-clear') ? 'opacity-45 saturate-0' : ''">
            <div class="aspect-square w-full overflow-hidden">
              <img alt="Vegan Ramen" class="h-full w-full object-cover grayscale-[60%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Minimalist vegan ramen with clear kombu broth, enoki mushrooms, and tofu on a dark textured table with focused top light" src="../assets/images/menu-synthetic-clear.png">
            </div>
            <div class="flex-grow p-6">
              <div class="mb-2 flex items-start justify-between">
                <h3 class="font-headline text-xl font-bold uppercase">Synthetic Clear</h3>
                <span class="font-headline font-bold text-primary-container">$19.0</span>
              </div>
              <p class="mb-2 text-xs font-light leading-relaxed text-on-surface-variant">
                Double-filtered kombu and shiitake broth. Hand-pulled wheat noodles. Minimalist aesthetic.
              </p>
              <div class="mt-4">
                <button
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/35 text-sm text-on-surface transition-colors hover:border-primary-container hover:bg-primary-container hover:text-on-primary-fixed"
                  type="button"
                  :class="isOutOfStock('ramen-synthetic-clear') ? 'cursor-not-allowed opacity-40 hover:border-outline-variant/35 hover:bg-transparent hover:text-on-surface' : ''"
                  :disabled="isOutOfStock('ramen-synthetic-clear')"
                  @click="addRamenToCart('ramen-synthetic-clear')"
                >
                  <span class="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
            </div>
          </div>

          <div class="group relative flex flex-col overflow-hidden bg-surface-container-low md:col-span-8 md:flex-row" :class="isOutOfStock('ramen-obsidian-shoyu') ? 'opacity-45 saturate-0' : ''">
            <div class="aspect-square overflow-hidden md:w-1/2 md:aspect-auto">
              <img alt="Black Garlic Ramen" class="h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Black garlic ramen with dark ink-like broth and vivid toppings, high contrast photography with deep shadows and sharp highlights" src="../assets/images/menu-obsidian-shoyu.png">
            </div>
            <div class="flex flex-col justify-center p-8 md:w-1/2">
              <div class="mb-4">
                <span class="mb-2 block font-label text-[10px] uppercase tracking-[0.2em] text-primary-container">Experimental</span>
                <div class="mb-4 flex items-start justify-between">
                  <h3 class="font-headline text-2xl font-bold uppercase tracking-tight">Obsidian Shoyu</h3>
                  <span class="font-headline text-lg font-bold text-primary-container">$22.0</span>
                </div>
                <p class="text-sm font-light leading-loose text-on-surface-variant">
                  Burnt garlic oil infusion with aged soy sauce, duck confit, and bamboo shoots. A deep, dark dive into flavor.
                </p>
                <div class="mt-5">
                  <button
                    class="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/35 text-sm text-on-surface transition-colors hover:border-primary-container hover:bg-primary-container hover:text-on-primary-fixed"
                    type="button"
                    :class="isOutOfStock('ramen-obsidian-shoyu') ? 'cursor-not-allowed opacity-40 hover:border-outline-variant/35 hover:bg-transparent hover:text-on-surface' : ''"
                    :disabled="isOutOfStock('ramen-obsidian-shoyu')"
                    @click="addRamenToCart('ramen-obsidian-shoyu')"
                  >
                    <span class="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-32">
        <div class="mb-12 flex items-baseline justify-between">
          <h2 class="font-headline text-4xl font-bold uppercase tracking-tight">02 / Small Plates</h2>
          <span class="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-50">Precision Sides</span>
        </div>
        <div class="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div class="group flex items-start space-x-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden bg-surface-container">
              <img alt="Gyoza" class="h-full w-full object-cover grayscale-[80%] transition-all duration-500 group-hover:grayscale-0" data-alt="Pan-seared gyoza dumplings with perfectly crispy bottoms and delicate steam, on a dark ceramic plate" src="../assets/images/menu-gyoza.png">
            </div>
            <div>
              <h3 class="font-headline text-lg font-bold uppercase">Seared Gyoza</h3>
              <p class="mb-2 text-xs font-light text-on-surface-variant">Pork &amp; Ginger reduction.</p>
              <span class="font-headline font-bold text-primary-container">$9.0</span>
            </div>
          </div>
          <div class="group flex items-start space-x-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden bg-surface-container">
              <img alt="Karaage" class="h-full w-full object-cover grayscale-[80%] transition-all duration-500 group-hover:grayscale-0" data-alt="Golden fried karaage chicken pieces with yuzu mayo on a dark minimalist background" src="../assets/images/menu-karaage.png">
            </div>
            <div>
              <h3 class="font-headline text-lg font-bold uppercase">Atomic Karaage</h3>
              <p class="mb-2 text-xs font-light text-on-surface-variant">Triple-fried, yuzu salt.</p>
              <span class="font-headline font-bold text-primary-container">$12.0</span>
            </div>
          </div>
          <div class="group flex items-start space-x-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden bg-surface-container">
              <img alt="Edamame" class="h-full w-full object-cover grayscale-[80%] transition-all duration-500 group-hover:grayscale-0" data-alt="Fresh green edamame pods with sea salt flakes on a dark volcanic stone plate" src="../assets/images/menu-edamame.png">
            </div>
            <div>
              <h3 class="font-headline text-lg font-bold uppercase">Smoked Edamame</h3>
              <p class="mb-2 text-xs font-light text-on-surface-variant">Charred with truffle salt.</p>
              <span class="font-headline font-bold text-primary-container">$7.0</span>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-32">
        <div class="mb-12 flex items-baseline justify-between">
          <h2 class="font-headline text-4xl font-bold uppercase tracking-tight">03 / Liquid</h2>
          <span class="font-label text-xs uppercase tracking-widest text-on-surface-variant opacity-50">Hydration Modules</span>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div class="border border-white/5 bg-surface-container-high/40 p-8 backdrop-blur-xl transition-all hover:bg-surface-container-high/60">
            <span class="mb-4 block font-label text-[10px] uppercase tracking-widest text-primary-container">Fermented</span>
            <h3 class="mb-2 font-headline text-xl font-bold uppercase">Junmai Sake</h3>
            <p class="mb-6 text-xs font-light leading-relaxed text-on-surface-variant">Ultra-dry, polished to 50% for crystalline clarity.</p>
            <span class="font-headline font-bold text-on-surface">$16.0</span>
          </div>
          <div class="border border-white/5 bg-surface-container-high/40 p-8 backdrop-blur-xl transition-all hover:bg-surface-container-high/60">
            <span class="mb-4 block font-label text-[10px] uppercase tracking-widest text-primary-container">Hops</span>
            <h3 class="mb-2 font-headline text-xl font-bold uppercase">Asahi Super Dry</h3>
            <p class="mb-6 text-xs font-light leading-relaxed text-on-surface-variant">The engineering standard. Cold-filtered, crisp finish.</p>
            <span class="font-headline font-bold text-on-surface">$9.0</span>
          </div>
          <div class="border border-white/5 bg-surface-container-high/40 p-8 backdrop-blur-xl transition-all hover:bg-surface-container-high/60">
            <span class="mb-4 block font-label text-[10px] uppercase tracking-widest text-primary-container">Botanical</span>
            <h3 class="mb-2 font-headline text-xl font-bold uppercase">Yuzu Highball</h3>
            <p class="mb-6 text-xs font-light leading-relaxed text-on-surface-variant">Japanese whisky, fresh yuzu, carbonated mineral water.</p>
            <span class="font-headline font-bold text-on-surface">$14.0</span>
          </div>
          <div class="border border-white/5 bg-surface-container-high/40 p-8 backdrop-blur-xl transition-all hover:bg-surface-container-high/60">
            <span class="mb-4 block font-label text-[10px] uppercase tracking-widest text-primary-container">Static</span>
            <h3 class="mb-2 font-headline text-xl font-bold uppercase">Matcha Iced</h3>
            <p class="mb-6 text-xs font-light leading-relaxed text-on-surface-variant">Ceremonial grade, cold-whisked to order. Zero sugar.</p>
            <span class="font-headline font-bold text-on-surface">$7.0</span>
          </div>
        </div>
      </section>

      <section class="relative flex h-[614px] w-full items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img alt="Chef Signature" class="h-full w-full object-cover opacity-40 grayscale" data-alt="Close-up of chef's hands carefully placing toppings on a bowl of ramen with steam rising in a dark industrial kitchen" src="../assets/images/menu-chef-signature.png">
        </div>
        <div class="relative z-10 max-w-2xl border border-white/5 bg-surface-bright/60 p-12 text-center backdrop-blur-[40px]">
          <span class="mb-4 block font-label text-xs uppercase tracking-[0.4em] text-primary-container">Monthly Calibration</span>
          <h2 class="mb-6 font-headline text-4xl font-extrabold uppercase leading-none tracking-tighter md:text-5xl">The Nebula Lobster Ramen</h2>
          <p class="mb-8 text-sm font-light leading-relaxed text-on-surface opacity-80">
            A limited-run experiment featuring butter-poached lobster tail, cognac-infused broth, and saffron noodles. Only 12 bowls prepared per cycle.
          </p>
          <button class="bg-primary-container px-10 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary-fixed transition-transform duration-300 hover:scale-105">
            Inquire Status
          </button>
        </div>
      </section>
    </main>

    <AppToastAlerts :alerts="alerts" />

    <footer class="w-full border-t border-[#5d4038]/20 bg-[#0e0e0e]">
      <div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-12 py-16 md:flex-row">
        <div class="mb-8 md:mb-0">
          <div class="mb-2 font-headline text-lg font-bold uppercase tracking-widest text-[#e5e2e1]">RAMEN MONOLITH</div>
          <p class="font-body text-[10px] uppercase tracking-widest text-[#e5e2e1]/60">&copy; 2024 RAMEN MONOLITH. PRECISION CRAFTED.</p>
        </div>
        <div class="flex space-x-12">
          <div class="flex flex-col space-y-2">
            <span class="font-headline text-[10px] font-bold uppercase tracking-widest text-[#ff5625]">Connect</span>
            <a class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#e5e2e1]/60 transition-all hover:text-[#ff5625]" href="#">Instagram</a>
            <a class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#e5e2e1]/60 transition-all hover:text-[#ff5625]" href="#">Twitter / X</a>
          </div>
          <div class="flex flex-col space-y-2">
            <span class="font-headline text-[10px] font-bold uppercase tracking-widest text-[#ff5625]">Logistics</span>
            <a class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#e5e2e1]/60 transition-all hover:text-[#ff5625]" href="#">Location</a>
            <a class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#e5e2e1]/60 transition-all hover:text-[#ff5625]" href="#">Hours</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

:global(body) {
  background-color: #131313;
  color: #e5e2e1;
}
</style>
