<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import AppToastAlerts from '@/components/AppToastAlerts.vue'
import UniversalMenu from '@/components/UniversalMenu.vue'
import { defaultUserCatalogItems, type CatalogCategory, type UserCatalogItem } from '@/data/userMenuItems'
import type { RootState } from '@/store'

const USER_MENU_STORAGE_KEY = 'ramen_user_menu_items'
const categories: Array<CatalogCategory | 'All'> = ['All', 'Ramen', 'Drinks', 'Sides']
const store = useStore<RootState>()
const route = useRoute()

const searchTerm = ref('')
const selectedCategory = ref<CatalogCategory | 'All'>('All')
const menuItems = ref<UserCatalogItem[]>(defaultUserCatalogItems)
const selectedItem = ref<UserCatalogItem | null>(null)
const selectedQuantity = ref(1)

type AlertType = 'success' | 'error' | 'info'
type UiAlert = {
  id: number
  type: AlertType
  title: string
  message: string
}

const alerts = ref<UiAlert[]>([])
let alertId = 0
const alertTimeouts = new Map<number, ReturnType<typeof setTimeout>>()

const puzzlePattern = [
  'md:col-span-6 lg:col-span-4',
  'md:col-span-6 lg:col-span-3',
  'md:col-span-6 lg:col-span-5',
  'md:col-span-6 lg:col-span-3',
  'md:col-span-6 lg:col-span-4',
  'md:col-span-6 lg:col-span-5',
]

function isValidCategory(value: unknown): value is CatalogCategory {
  return value === 'Ramen' || value === 'Drinks' || value === 'Sides'
}

function parseUserItems(raw: string | null): UserCatalogItem[] | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null

    const normalized = parsed
      .filter((item): item is UserCatalogItem => {
        return (
          typeof item?.id === 'string' &&
          typeof item?.name === 'string' &&
          typeof item?.description === 'string' &&
          typeof item?.price === 'string' &&
          typeof item?.image === 'string' &&
          isValidCategory(item?.category)
        )
      })

    return normalized.length ? normalized : null
  } catch {
    return null
  }
}

function parsePriceToNumber(price: string): number {
  const normalized = price.replace(/[^0-9.]/g, '')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`
}

function openItemModal(item: UserCatalogItem): void {
  selectedItem.value = item
  selectedQuantity.value = 1
}

function closeItemModal(): void {
  selectedItem.value = null
  selectedQuantity.value = 1
}

function decreaseQuantity(): void {
  selectedQuantity.value = Math.max(1, selectedQuantity.value - 1)
}

function increaseQuantity(): void {
  selectedQuantity.value = Math.min(99, selectedQuantity.value + 1)
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

function addToCart(): void {
  if (!selectedItem.value) {
    showAlert('error', 'Unable to add', 'Select a valid item to continue.')
    return
  }

  try {
    store.dispatch('cart/addItemToCart', {
      item: {
        id: selectedItem.value.id,
        name: selectedItem.value.name,
        price: selectedItem.value.price,
        category: selectedItem.value.category,
        image: selectedItem.value.image,
      },
      quantity: selectedQuantity.value,
    })

    showAlert('success', 'Added to cart', `${selectedQuantity.value} item(s) of ${selectedItem.value.name}.`)
  } catch {
    showAlert('error', 'Unable to add', 'We could not update your cart right now.')
  }
}

function handleEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && selectedItem.value) {
    closeItemModal()
  }
}

function getRequestedItemId(): string | null {
  const raw = route.query.item
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim()
  }

  if (Array.isArray(raw) && typeof raw[0] === 'string' && raw[0].trim().length > 0) {
    return raw[0].trim()
  }

  return null
}

function openRequestedItemModal(): void {
  const requestedItemId = getRequestedItemId()
  if (!requestedItemId) return

  const item = menuItems.value.find((menuItem) => menuItem.id === requestedItemId)
  if (!item) return

  selectedCategory.value = item.category
  openItemModal(item)
}

onMounted(() => {
  const storedItems = parseUserItems(localStorage.getItem(USER_MENU_STORAGE_KEY))
  if (storedItems) {
    menuItems.value = storedItems
  }

  openRequestedItemModal()
  window.addEventListener('keydown', handleEscape)
})

watch(
  () => route.query.item,
  () => {
    openRequestedItemModal()
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
  alertTimeouts.forEach((timeout) => clearTimeout(timeout))
  alertTimeouts.clear()
})

const filteredItems = computed(() => {
  const normalizedSearch = searchTerm.value.trim().toLowerCase()

  return menuItems.value.filter((item) => {
    const matchesCategory = selectedCategory.value === 'All' || item.category === selectedCategory.value
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.description.toLowerCase().includes(normalizedSearch)

    return matchesCategory && matchesSearch
  })
})

function cardClass(index: number): string {
  return puzzlePattern[index % puzzlePattern.length] ?? puzzlePattern[0]!
}

const itemSubtotal = computed(() => {
  if (!selectedItem.value) return '$0.00'
  return formatMoney(parsePriceToNumber(selectedItem.value.price) * selectedQuantity.value)
})
</script>

<template>
  <div class="min-h-screen bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-fixed">
    <UniversalMenu />

    <main class="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pb-20 pt-32 md:px-10">
      <header class="space-y-5">
        <p class="font-label text-xs uppercase tracking-[0.35em] text-primary-container">User Menu Board</p>
        <h1 class="font-headline text-5xl font-black uppercase leading-[0.85] tracking-tighter md:text-7xl">
          Menu<br />
          <span class="text-primary-container">Dynamic Grid</span>
        </h1>
        <p class="max-w-2xl text-sm text-on-surface-variant md:text-base">
          User-added items in a puzzle-style visual board, with focus on photography and quick detail scanning.
        </p>
      </header>

      <section class="rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-4 backdrop-blur-sm md:p-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="relative w-full md:max-w-xl">
            <span class="material-symbols-outlined pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search by name or description"
              class="w-full rounded-full border border-outline-variant/25 bg-surface-container px-12 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-outline/70 focus:border-primary-container"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="category in categories"
              :key="category"
              type="button"
              class="rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
              :class="selectedCategory === category
                ? 'border-black bg-white text-black'
                : 'border-outline-variant/30 bg-surface-container text-on-surface-variant hover:text-on-surface'"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-12">
        <article
          v-for="(item, index) in filteredItems"
          :key="item.id"
          class="group overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-low shadow-[0_10px_40px_rgba(0,0,0,0.22)]"
          :class="cardClass(index)"
        >
          <div class="h-56 overflow-hidden md:h-64 lg:h-72">
            <img
              :src="item.image"
              :alt="item.name"
              class="h-full w-full object-cover grayscale-[25%] transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
          </div>

          <div class="space-y-3 p-5">
            <div class="flex items-start justify-between gap-3">
              <h2 class="font-headline text-2xl font-extrabold uppercase tracking-tight">{{ item.name }}</h2>
              <span class="whitespace-nowrap rounded-full bg-primary-container/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-container">
                {{ item.category }}
              </span>
            </div>

            <p class="text-sm leading-relaxed text-on-surface-variant">{{ item.description }}</p>

            <div class="flex items-center justify-between border-t border-outline-variant/20 pt-3">
              <span class="font-headline text-lg font-black text-primary-container">{{ item.price }}</span>
              <button
                class="rounded-full border border-outline-variant/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-outline transition-colors hover:text-on-surface"
                @click="openItemModal(item)"
              >
                View Item
              </button>
            </div>
          </div>
        </article>
      </section>

      <section
        v-if="filteredItems.length === 0"
        class="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-10 text-center"
      >
        <p class="font-headline text-2xl font-bold uppercase tracking-tight">No items found</p>
        <p class="mt-2 text-sm text-on-surface-variant">Try another search term or adjust the category filter.</p>
      </section>
    </main>

    <AppToastAlerts :alerts="alerts" />

    <div
      v-if="selectedItem"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-md"
      @click.self="closeItemModal"
    >
      <div class="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-low shadow-[0_25px_120px_rgba(0,0,0,0.5)] md:grid-cols-2">
        <div class="h-72 md:h-full">
          <img :src="selectedItem.image" :alt="selectedItem.name" class="h-full w-full object-cover" />
        </div>

        <div class="flex flex-col gap-5 p-6 md:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="rounded-full bg-primary-container/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-container">
                {{ selectedItem.category }}
              </span>
              <h2 class="mt-3 font-headline text-3xl font-black uppercase leading-tight tracking-tight">{{ selectedItem.name }}</h2>
            </div>
            <button
              class="rounded-full border border-outline-variant/25 p-2 text-outline transition-colors hover:text-on-surface"
              @click="closeItemModal"
            >
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <p class="text-sm leading-relaxed text-on-surface-variant">{{ selectedItem.description }}</p>

          <div class="rounded-xl border border-outline-variant/20 bg-surface-container p-4">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-xs uppercase tracking-widest text-outline">Unit Price</p>
              <p class="font-headline text-xl font-black text-primary-container">{{ selectedItem.price }}</p>
            </div>

            <div class="flex items-center justify-between gap-4">
              <p class="text-xs uppercase tracking-widest text-outline">Quantity</p>
              <div class="flex items-center gap-2">
                <button
                  class="h-9 w-9 rounded-full border border-outline-variant/30 text-sm font-bold text-on-surface transition-colors hover:border-primary-container"
                  @click="decreaseQuantity"
                >
                  -
                </button>
                <span class="min-w-8 text-center font-headline text-lg font-black">{{ selectedQuantity }}</span>
                <button
                  class="h-9 w-9 rounded-full border border-outline-variant/30 text-sm font-bold text-on-surface transition-colors hover:border-primary-container"
                  @click="increaseQuantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-outline-variant/20 pt-4">
            <p class="text-xs uppercase tracking-widest text-outline">Subtotal</p>
            <p class="font-headline text-2xl font-black text-primary-container">{{ itemSubtotal }}</p>
          </div>

          <button
            class="rounded-full border border-primary-container/40 bg-gradient-to-r from-primary to-primary-container px-7 py-3.5 text-xs font-black uppercase tracking-[0.22em] text-on-primary-fixed shadow-[0_10px_30px_rgba(255,255,255,0.26)] transition-all hover:scale-[1.02] hover:shadow-[0_14px_36px_rgba(255,255,255,0.38)]"
            @click="addToCart"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
