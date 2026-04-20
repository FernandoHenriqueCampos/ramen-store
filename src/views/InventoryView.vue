<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import UniversalMenu from '@/components/UniversalMenu.vue'
import { defaultUserCatalogItems, type CatalogCategory, type UserCatalogItem } from '@/data/userMenuItems'

const router = useRouter()
const store = useStore()
const USER_MENU_STORAGE_KEY = 'ramen_user_menu_items'
const INVENTORY_STORAGE_KEY = 'ramen_inventory_records'

type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'
type CategoryFilterOption = 'All' | CatalogCategory

type InventoryItem = UserCatalogItem & {
  stock: number
  minStock: number
}

type InventoryRecord = {
  stock: number
  minStock: number
}

const items = ref<InventoryItem[]>([])
const searchQuery = ref('')
const selectedCategory = ref<CategoryFilterOption>('All')
const pageSizeOptions = [5, 10, 20, 30] as const
const itemsPerPage = ref(5)
const currentPage = ref(1)
const isStockModalOpen = ref(false)
const editItemId = ref('')
const editStock = ref<number | null>(null)
const editMinStock = ref<number | null>(null)
const stockModalError = ref('')

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return items.value.filter((item) => {
    const matchesCategory = selectedCategory.value === 'All' || item.category === selectedCategory.value
    if (!matchesCategory) return false
    if (!query) return true
    return `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query)
  })
})

const totalItems = computed(() => items.value.length)
const inStockCount = computed(() => items.value.filter((item) => getInventoryStatus(item.stock, item.minStock) === 'In Stock').length)
const lowStockCount = computed(() => items.value.filter((item) => getInventoryStatus(item.stock, item.minStock) === 'Low Stock').length)
const outOfStockCount = computed(() => items.value.filter((item) => getInventoryStatus(item.stock, item.minStock) === 'Out of Stock').length)
const avgVisibleStock = computed(() => {
  if (!filteredItems.value.length) return 0
  const total = filteredItems.value.reduce((sum, item) => sum + item.stock, 0)
  return total / filteredItems.value.length
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / itemsPerPage.value)))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredItems.value.slice(start, start + itemsPerPage.value)
})
const showingFrom = computed(() => {
  if (!filteredItems.value.length) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})
const showingTo = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredItems.value.length))
const visiblePageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

function isValidCategory(value: unknown): value is CatalogCategory {
  return value === 'Ramen' || value === 'Drinks' || value === 'Sides'
}

function parseUserItems(raw: string | null): UserCatalogItem[] | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const normalized = parsed.filter((item): item is UserCatalogItem => {
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

function parseInventoryRecords(raw: string | null): Record<string, InventoryRecord> {
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw) as Record<string, InventoryRecord>
    const normalized: Record<string, InventoryRecord> = {}
    Object.entries(parsed).forEach(([id, record]) => {
      if (
        record &&
        typeof record.stock === 'number' &&
        typeof record.minStock === 'number' &&
        record.stock >= 0 &&
        record.minStock >= 0
      ) {
        normalized[id] = {
          stock: Math.floor(record.stock),
          minStock: Math.floor(record.minStock),
        }
      }
    })
    return normalized
  } catch {
    return {}
  }
}

function getInventoryStatus(stock: number, minStock: number): InventoryStatus {
  if (stock <= 0) return 'Out of Stock'
  if (stock <= minStock) return 'Low Stock'
  return 'In Stock'
}

function setItemsPerPage(size: number): void {
  itemsPerPage.value = size
  currentPage.value = 1
}

function goToPage(page: number): void {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function goToPreviousPage(): void {
  goToPage(currentPage.value - 1)
}

function goToNextPage(): void {
  goToPage(currentPage.value + 1)
}

function persistInventoryRecords(): void {
  const records: Record<string, InventoryRecord> = {}
  items.value.forEach((item) => {
    records[item.id] = { stock: item.stock, minStock: item.minStock }
  })
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(records))
}

function adjustStock(itemId: string, delta: number): void {
  items.value = items.value.map((item) => {
    if (item.id !== itemId) return item
    return {
      ...item,
      stock: Math.max(0, item.stock + delta),
    }
  })
  persistInventoryRecords()
}

function openStockModal(item: InventoryItem): void {
  editItemId.value = item.id
  editStock.value = item.stock
  editMinStock.value = item.minStock
  stockModalError.value = ''
  isStockModalOpen.value = true
}

function closeStockModal(): void {
  isStockModalOpen.value = false
}

function saveStockSettings(): void {
  const id = editItemId.value
  const stock = Number(editStock.value)
  const minStock = Number(editMinStock.value)
  if (!id || !Number.isFinite(stock) || !Number.isFinite(minStock) || stock < 0 || minStock < 0) {
    stockModalError.value = 'Enter valid values for stock and minimum stock.'
    return
  }

  items.value = items.value.map((item) => {
    if (item.id !== id) return item
    return {
      ...item,
      stock: Math.floor(stock),
      minStock: Math.floor(minStock),
    }
  })
  persistInventoryRecords()
  closeStockModal()
}

function formatSku(id: string): string {
  return id.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 10) || 'ITEM'
}

function exitAdmin(): void {
  store.dispatch('adminAuth/logout')
  router.push('/login')
}

onMounted(() => {
  const storedMenuItems = parseUserItems(localStorage.getItem(USER_MENU_STORAGE_KEY)) ?? defaultUserCatalogItems
  const records = parseInventoryRecords(localStorage.getItem(INVENTORY_STORAGE_KEY))

  items.value = storedMenuItems.map((item) => {
    const record = records[item.id]
    return {
      ...item,
      stock: record?.stock ?? 20,
      minStock: record?.minStock ?? 5,
    }
  })

  persistInventoryRecords()
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages
})

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="bg-background">
    <UniversalMenu />
    <div class="flex min-h-screen overflow-hidden bg-background pt-20">
      <aside class="fixed left-0 top-20 z-50 flex h-[calc(100vh-5rem)] w-64 flex-col border-r border-outline-variant/10 bg-surface-container-lowest">
        <div class="p-8">
          <h1 class="monolith-header text-xl font-black tracking-tight text-on-surface">RAMEN <span class="text-primary-container">MONOLITH</span></h1>
          <p class="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-outline">Core Control System</p>
        </div>
        <nav class="mt-4 flex-1 space-y-2 px-4">
          <router-link class="group flex items-center gap-3 rounded px-4 py-3 text-on-surface/60 transition-all duration-300 hover:bg-surface-container-low hover:text-primary-container" to="/admin/sales">
            <span class="material-symbols-outlined text-[20px]">dashboard</span>
            <span class="font-label text-sm font-medium tracking-tight">Dashboard</span>
          </router-link>
          <router-link class="group flex items-center gap-3 rounded px-4 py-3 text-on-surface/60 transition-all duration-300 hover:bg-surface-container-low hover:text-primary-container" to="/admin">
            <span class="material-symbols-outlined text-[20px]">restaurant_menu</span>
            <span class="font-label text-sm font-medium tracking-tight">Menu Items</span>
          </router-link>
          <router-link class="group flex items-center gap-3 rounded border-r-2 border-primary-container bg-surface-container-high px-4 py-3 text-primary-container" to="/admin/stock">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">inventory_2</span>
            <span class="font-label text-sm font-bold tracking-tight">Stock</span>
          </router-link>
        </nav>
        <div class="mt-auto p-4">
          <div class="flex items-center gap-3 rounded-lg bg-surface-container p-4">
            <div class="h-10 w-10 overflow-hidden rounded-full bg-surface-container-highest">
              <img alt="Admin Avatar" class="h-full w-full object-cover" src="../assets/images/admin-avatar.png">
            </div>
            <div>
              <p class="text-xs font-bold text-on-surface">K. Yamamoto</p>
              <p class="text-[10px] uppercase tracking-wider text-outline">Executive Admin</p>
            </div>
            <button class="ml-auto text-outline transition-colors hover:text-primary-container" @click="exitAdmin">
              <span class="material-symbols-outlined text-sm">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main class="relative ml-64 flex h-[calc(100vh-5rem)] flex-1 flex-col bg-surface">
        <header class="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-outline-variant/10 bg-surface/80 px-10 backdrop-blur-xl">
          <div>
            <h2 class="monolith-header text-2xl font-bold tracking-tighter text-on-surface">STOCK MANAGEMENT</h2>
            <div class="mt-1 flex items-center gap-4">
              <span class="text-[10px] uppercase tracking-widest text-outline">Inventory Live Control</span>
              <span class="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-green-500">Realtime</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <router-link class="rounded-sm border border-outline-variant/30 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-outline transition-colors hover:text-on-surface" to="/admin">
              Back To Menu Admin
            </router-link>
            <button class="rounded-sm border border-outline-variant/30 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-outline transition-colors hover:text-on-surface" @click="exitAdmin">
              Exit Admin
            </button>
          </div>
        </header>

        <div class="flex-1 space-y-10 overflow-y-auto p-10">
          <section class="grid grid-cols-4 gap-6">
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Products</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ totalItems }}</span>
                <span class="text-xs font-bold text-primary-container">tracked</span>
              </div>
            </div>
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">In Stock</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ inStockCount }}</span>
                <span class="material-symbols-outlined text-green-500" style="font-variation-settings: 'FILL' 1;">check_circle</span>
              </div>
            </div>
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Low Stock</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ lowStockCount }}</span>
                <span class="material-symbols-outlined text-amber-400">warning</span>
              </div>
            </div>
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Avg Visible Stock</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ avgVisibleStock.toFixed(1) }}</span>
                <span class="text-xs font-bold text-outline">units</span>
              </div>
            </div>
          </section>

          <section class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="monolith-header text-lg font-extrabold uppercase tracking-tighter text-on-surface">Inventory Table</h3>
              <div class="flex flex-wrap items-center justify-end gap-3">
                <div class="search-shell">
                  <span class="material-symbols-outlined search-icon">search</span>
                  <input v-model="searchQuery" class="search-input" placeholder="Search items..." type="text">
                </div>
                <div class="flex items-center gap-2">
                  <button class="filter-pill" :class="selectedCategory === 'All' ? 'filter-pill-active' : ''" @click="selectedCategory = 'All'">All</button>
                  <button class="filter-pill" :class="selectedCategory === 'Ramen' ? 'filter-pill-active' : ''" @click="selectedCategory = 'Ramen'">Ramen</button>
                  <button class="filter-pill" :class="selectedCategory === 'Drinks' ? 'filter-pill-active' : ''" @click="selectedCategory = 'Drinks'">Drinks</button>
                  <button class="filter-pill" :class="selectedCategory === 'Sides' ? 'filter-pill-active' : ''" @click="selectedCategory = 'Sides'">Sides</button>
                </div>
              </div>
            </div>

            <div class="w-full">
              <div class="grid grid-cols-12 gap-4 border-b border-outline-variant/20 bg-surface-container-lowest px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-outline">
                <div class="col-span-4">Product</div>
                <div class="col-span-2">Category</div>
                <div class="col-span-1 text-center">Stock</div>
                <div class="col-span-1 text-center">Min</div>
                <div class="col-span-2">Status</div>
                <div class="col-span-2 text-right">Actions</div>
              </div>

              <div v-for="item in paginatedItems" :key="item.id" class="group grid grid-cols-12 items-center gap-4 border-b border-outline-variant/5 bg-surface-container-low px-6 py-5 transition-colors hover:bg-surface-container">
                <div class="col-span-4 flex items-center gap-4">
                  <div class="h-12 w-12 overflow-hidden rounded bg-surface-container-highest">
                    <img :alt="item.name" class="h-full w-full object-cover" :src="item.image">
                  </div>
                  <div>
                    <p class="monolith-header text-sm font-bold tracking-tight text-on-surface">{{ item.name.toUpperCase() }}</p>
                    <p class="text-[10px] font-medium text-outline/70">SKU: {{ formatSku(item.id) }}</p>
                  </div>
                </div>
                <div class="col-span-2">
                  <span class="rounded-sm bg-surface-container-highest px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">{{ item.category }}</span>
                </div>
                <div class="col-span-1 text-center">
                  <span class="text-sm font-black text-on-surface">{{ item.stock }}</span>
                </div>
                <div class="col-span-1 text-center">
                  <span class="text-sm font-black text-outline">{{ item.minStock }}</span>
                </div>
                <div class="col-span-2">
                  <span
                    class="rounded-sm border px-2 py-1 text-[10px] font-black uppercase tracking-widest"
                    :class="getInventoryStatus(item.stock, item.minStock) === 'In Stock'
                      ? 'border-green-500/40 bg-green-500/10 text-green-400'
                      : getInventoryStatus(item.stock, item.minStock) === 'Low Stock'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                        : 'border-error/40 bg-error/10 text-error'"
                  >
                    {{ getInventoryStatus(item.stock, item.minStock) }}
                  </span>
                </div>
                <div class="col-span-2 flex justify-end gap-2">
                  <button class="h-8 w-8 rounded-sm border border-outline-variant/20 text-outline transition-colors hover:text-on-surface" @click="adjustStock(item.id, -1)">
                    <span class="material-symbols-outlined text-base">remove</span>
                  </button>
                  <button class="h-8 w-8 rounded-sm border border-outline-variant/20 text-outline transition-colors hover:text-on-surface" @click="adjustStock(item.id, 1)">
                    <span class="material-symbols-outlined text-base">add</span>
                  </button>
                  <button class="h-8 rounded-sm border border-outline-variant/20 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-outline transition-colors hover:text-on-surface" @click="openStockModal(item)">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4">
              <div class="flex items-center gap-6">
                <p class="text-[10px] font-bold uppercase tracking-widest text-outline">Displaying {{ showingFrom }}-{{ showingTo }} of {{ filteredItems.length }} items</p>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-outline">Per page</span>
                  <button
                    v-for="size in pageSizeOptions"
                    :key="size"
                    class="flex h-8 min-w-8 items-center justify-center rounded-sm border px-2 text-[10px] font-bold transition-colors"
                    :class="itemsPerPage === size ? 'border-primary-container bg-primary-container text-on-primary-fixed' : 'border-outline-variant/20 bg-surface-container-low text-outline hover:text-on-surface'"
                    @click="setItemsPerPage(size)"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-highest text-outline transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40" :disabled="currentPage === 1" @click="goToPreviousPage">
                  <span class="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button
                  v-for="page in visiblePageNumbers"
                  :key="page"
                  class="flex h-8 w-8 items-center justify-center rounded-sm text-xs font-bold transition-colors"
                  :class="currentPage === page ? 'bg-primary-container text-on-primary-fixed' : 'bg-surface-container-low text-outline hover:text-on-surface'"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-highest text-outline transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40" :disabled="currentPage === totalPages" @click="goToNextPage">
                  <span class="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer class="flex h-12 items-center justify-between border-t border-outline-variant/5 bg-surface-container-lowest px-10">
          <p class="text-[9px] font-medium uppercase tracking-[0.2em] text-outline/50">© 2024 RAMEN MONOLITH. PRECISION CRAFTED. V1.0.4-BETA</p>
          <div class="flex gap-6">
            <a class="text-[9px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary-container" href="#">Protocol</a>
            <a class="text-[9px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary-container" href="#">Diagnostics</a>
            <a class="text-[9px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-primary-container" href="#">Support</a>
          </div>
        </footer>

        <div v-if="isStockModalOpen" class="modal-overlay" @click.self="closeStockModal">
          <div class="modal-panel w-full max-w-lg overflow-hidden">
            <div class="modal-top-accent"></div>
            <div class="p-7 sm:p-8">
              <div class="mb-6 flex items-center justify-between">
                <div>
                  <h4 class="modal-title monolith-header text-xl font-extrabold uppercase tracking-tight">Edit Stock</h4>
                  <p class="modal-subtitle mt-1 text-[10px] uppercase tracking-[0.18em]">Update stock and minimum stock</p>
                </div>
                <button class="modal-icon-btn" @click="closeStockModal">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>

              <form class="space-y-5" @submit.prevent="saveStockSettings">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="modal-label mb-2 block text-[10px] font-bold uppercase tracking-[0.16em]">Current Stock</label>
                    <input v-model.number="editStock" class="modal-input no-number-spin" min="0" step="1" type="number">
                  </div>
                  <div>
                    <label class="modal-label mb-2 block text-[10px] font-bold uppercase tracking-[0.16em]">Min Stock</label>
                    <input v-model.number="editMinStock" class="modal-input no-number-spin" min="0" step="1" type="number">
                  </div>
                </div>
                <p v-if="stockModalError" class="modal-error px-3 py-2 text-xs font-semibold">{{ stockModalError }}</p>
                <div class="flex justify-end gap-3 pt-3">
                  <button class="modal-btn-secondary px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em]" type="button" @click="closeStockModal">
                    Cancel
                  </button>
                  <button class="modal-btn-primary px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em]" type="submit">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
}

.monolith-header {
  font-family: 'Manrope', sans-serif;
  letter-spacing: -0.02em;
}

.search-shell {
  position: relative;
  width: 22rem;
  max-width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: rgba(245, 245, 245, 0.62);
}

.search-input {
  width: 100%;
  border-radius: 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.78);
  background: transparent;
  color: #f2f2f2;
  padding: 0.66rem 0.9rem 0.66rem 2.45rem;
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  transition: border-color 0.16s ease, color 0.16s ease;
}

.search-input::placeholder {
  color: rgba(245, 245, 245, 0.68);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
}

.search-input:focus {
  outline: none;
  border-color: #ffffff;
}

.filter-pill {
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.26);
  color: rgba(245, 245, 245, 0.75);
  background: transparent;
  padding: 0.44rem 0.72rem;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: color 0.16s ease, border-color 0.16s ease, background-color 0.16s ease;
}

.filter-pill:hover {
  color: rgba(255, 255, 255, 0.94);
  border-color: rgba(255, 255, 255, 0.5);
}

.filter-pill-active {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.85);
  background: transparent;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(3, 3, 3, 0.78);
  backdrop-filter: blur(4px);
}

.modal-panel {
  border-radius: 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #0b0b0b;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.65);
}

.modal-top-accent {
  height: 1px;
  width: 100%;
  background: rgba(255, 122, 58, 0.9);
}

.modal-title {
  color: #f4f4f4;
}

.modal-subtitle {
  color: rgba(232, 232, 232, 0.62);
}

.modal-label {
  color: rgba(236, 236, 236, 0.78);
}

.modal-icon-btn {
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(240, 240, 240, 0.62);
  padding: 0.45rem;
  transition: color 0.16s ease, border-color 0.16s ease;
}

.modal-icon-btn:hover {
  color: #fff;
  border-color: rgba(255, 122, 58, 0.8);
}

.modal-input {
  width: 100%;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: transparent;
  color: #f4f4f4;
  padding: 0.7rem 0.85rem;
  font-size: 0.88rem;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}

.modal-input:focus {
  border-color: rgba(255, 122, 58, 0.95);
  box-shadow: 0 0 0 1px rgba(255, 122, 58, 0.35);
  outline: none;
}

.modal-btn-secondary {
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: rgba(240, 240, 240, 0.8);
  background: transparent;
}

.modal-btn-secondary:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.52);
}

.modal-btn-primary {
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 122, 58, 0.85);
  color: #fff;
  background: rgba(255, 122, 58, 0.14);
}

.modal-btn-primary:hover {
  background: rgba(255, 122, 58, 0.2);
  border-color: rgba(255, 122, 58, 1);
}

.modal-error {
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 122, 58, 0.45);
  background: rgba(255, 122, 58, 0.08);
  color: #ffd3bf;
}

.no-number-spin::-webkit-outer-spin-button,
.no-number-spin::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-number-spin[type='number'] {
  -moz-appearance: textfield;
}
</style>
