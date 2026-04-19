<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import UniversalMenu from '@/components/UniversalMenu.vue'
import { defaultUserCatalogItems, type CatalogCategory, type UserCatalogItem } from '@/data/userMenuItems'

const router = useRouter()
const store = useStore()
const USER_MENU_STORAGE_KEY = 'ramen_user_menu_items'

type InventoryStatus = 'Available' | 'Depleted'

type AdminInventoryItem = UserCatalogItem & {
  status: InventoryStatus
}

const menuItems = ref<AdminInventoryItem[]>(defaultUserCatalogItems.map(toAdminInventoryItem))
const categoryOptions: CatalogCategory[] = ['Ramen', 'Drinks', 'Sides']
const totalItems = computed(() => menuItems.value.length)
const pageSizeOptions = [5, 10, 20, 30] as const
const itemsPerPage = ref<number>(5)
const currentPage = ref(1)
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const newItemName = ref('')
const newItemDescription = ref('')
const newItemImage = ref('')
const newItemCategory = ref<CatalogCategory>('Ramen')
const newItemPriceUsd = ref<number | null>(null)
const modalError = ref('')
const editingItemId = ref('')
const editItemName = ref('')
const editItemDescription = ref('')
const editItemImage = ref('')
const editItemCategory = ref<CatalogCategory>('Ramen')
const editItemPriceUsd = ref<number | null>(null)
const editModalError = ref('')
const deletingItemId = ref('')
const deletingItemName = ref('')
const successAlertMessage = ref('')
const isSuccessAlertVisible = ref(false)
let successAlertTimeout: ReturnType<typeof setTimeout> | null = null
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return menuItems.value.slice(start, start + itemsPerPage.value)
})
const showingFrom = computed(() => {
  if (totalItems.value === 0) return 0
  return (currentPage.value - 1) * itemsPerPage.value + 1
})
const showingTo = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalItems.value))
const visiblePageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

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

function toAdminInventoryItem(item: UserCatalogItem): AdminInventoryItem {
  return {
    ...item,
    status: 'Available',
  }
}

function formatSku(id: string): string {
  return id.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 10) || 'ITEM'
}

function setItemsPerPage(size: number): void {
  itemsPerPage.value = size
  currentPage.value = 1
}

function persistUserMenuItems(): void {
  const itemsToStore: UserCatalogItem[] = menuItems.value.map(({ status: _status, ...item }) => item)
  localStorage.setItem(USER_MENU_STORAGE_KEY, JSON.stringify(itemsToStore))
}

function resetNewItemForm(): void {
  newItemName.value = ''
  newItemDescription.value = ''
  newItemImage.value = ''
  newItemCategory.value = 'Ramen'
  newItemPriceUsd.value = null
  modalError.value = ''
}

function openCreateModal(): void {
  resetNewItemForm()
  isEditModalOpen.value = false
  isCreateModalOpen.value = true
}

function closeCreateModal(): void {
  isCreateModalOpen.value = false
}

function createItemId(name: string): string {
  const normalizedName = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return `${normalizedName || 'item'}-${Date.now().toString(36)}`
}

function parseUsdPriceToNumber(priceText: string): number | null {
  const normalized = priceText.replace(/[^0-9.]/g, '')
  if (!normalized) return null
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function addNewItem(): void {
  const name = newItemName.value.trim()
  const description = newItemDescription.value.trim()
  const image = newItemImage.value.trim()
  const price = Number(newItemPriceUsd.value)

  if (!name || !description || !image || !Number.isFinite(price) || price <= 0) {
    modalError.value = 'Fill in name, description, image, type, and a valid USD price.'
    return
  }

  const newItem: AdminInventoryItem = {
    id: createItemId(name),
    name,
    description,
    price: `$${price.toFixed(2)}`,
    image,
    category: newItemCategory.value,
    status: 'Available',
  }

  menuItems.value = [newItem, ...menuItems.value]
  persistUserMenuItems()
  currentPage.value = 1
  showSuccessAlert(`"${name}" was created successfully.`)
  closeCreateModal()
}

function resetEditItemForm(): void {
  editingItemId.value = ''
  editItemName.value = ''
  editItemDescription.value = ''
  editItemImage.value = ''
  editItemCategory.value = 'Ramen'
  editItemPriceUsd.value = null
  editModalError.value = ''
}

function openEditModal(item: AdminInventoryItem): void {
  const parsedPrice = parseUsdPriceToNumber(item.price)
  editingItemId.value = item.id
  editItemName.value = item.name
  editItemDescription.value = item.description
  editItemImage.value = item.image
  editItemCategory.value = item.category
  editItemPriceUsd.value = parsedPrice
  editModalError.value = ''
  isCreateModalOpen.value = false
  isEditModalOpen.value = true
}

function closeEditModal(): void {
  isEditModalOpen.value = false
}

function openDeleteModal(item: AdminInventoryItem): void {
  deletingItemId.value = item.id
  deletingItemName.value = item.name
  isCreateModalOpen.value = false
  isEditModalOpen.value = false
  isDeleteModalOpen.value = true
}

function closeDeleteModal(): void {
  isDeleteModalOpen.value = false
  deletingItemId.value = ''
  deletingItemName.value = ''
}

function confirmDeleteItem(): void {
  const id = deletingItemId.value
  if (!id) {
    closeDeleteModal()
    return
  }

  const removedName = deletingItemName.value || 'Item'
  menuItems.value = menuItems.value.filter((item) => item.id !== id)
  persistUserMenuItems()
  showSuccessAlert(`"${removedName}" was deleted successfully.`)
  closeDeleteModal()
}

function saveEditedItem(): void {
  const id = editingItemId.value
  const name = editItemName.value.trim()
  const description = editItemDescription.value.trim()
  const image = editItemImage.value.trim()
  const price = Number(editItemPriceUsd.value)

  if (!id || !name || !description || !image || !Number.isFinite(price) || price <= 0) {
    editModalError.value = 'Fill in name, description, image, type, and a valid USD price.'
    return
  }

  menuItems.value = menuItems.value.map((item) => {
    if (item.id !== id) return item
    return {
      ...item,
      name,
      description,
      image,
      category: editItemCategory.value,
      price: `$${price.toFixed(2)}`,
    }
  })

  persistUserMenuItems()
  showSuccessAlert(`"${name}" was updated successfully.`)
  closeEditModal()
}

function showSuccessAlert(message: string): void {
  successAlertMessage.value = message
  isSuccessAlertVisible.value = true

  if (successAlertTimeout) {
    clearTimeout(successAlertTimeout)
  }

  successAlertTimeout = setTimeout(() => {
    isSuccessAlertVisible.value = false
    successAlertTimeout = null
  }, 3200)
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

onMounted(() => {
  const storedItems = parseUserItems(localStorage.getItem(USER_MENU_STORAGE_KEY))
  if (storedItems) {
    menuItems.value = storedItems.map(toAdminInventoryItem)
  }
})

onBeforeUnmount(() => {
  if (successAlertTimeout) {
    clearTimeout(successAlertTimeout)
    successAlertTimeout = null
  }
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

function exitAdmin() {
  store.dispatch('adminAuth/logout')
  router.push('/login')
}
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
        <a class="group flex items-center gap-3 rounded px-4 py-3 text-on-surface/60 transition-all duration-300 hover:bg-surface-container-low hover:text-primary-container" href="#">
          <span class="material-symbols-outlined text-[20px]">dashboard</span>
          <span class="font-label text-sm font-medium tracking-tight">Dashboard</span>
        </a>
        <a class="group flex items-center gap-3 rounded border-r-2 border-primary-container bg-surface-container-high px-4 py-3 text-primary-container" href="#">
          <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">restaurant_menu</span>
          <span class="font-label text-sm font-bold tracking-tight">Menu Items</span>
        </a>
        <a class="group flex items-center gap-3 rounded px-4 py-3 text-on-surface/60 transition-all duration-300 hover:bg-surface-container-low hover:text-primary-container" href="#">
          <span class="material-symbols-outlined text-[20px]">receipt_long</span>
          <span class="font-label text-sm font-medium tracking-tight">Orders</span>
          <span class="ml-auto rounded bg-primary-container/10 px-1.5 py-0.5 text-[10px] font-bold text-primary-container">12</span>
        </a>
        <a class="group flex items-center gap-3 rounded px-4 py-3 text-on-surface/60 transition-all duration-300 hover:bg-surface-container-low hover:text-primary-container" href="#">
          <span class="material-symbols-outlined text-[20px]">settings_suggest</span>
          <span class="font-label text-sm font-medium tracking-tight">Settings</span>
        </a>
      </nav>
      <div class="mt-auto p-4">
        <div class="flex items-center gap-3 rounded-lg bg-surface-container p-4">
          <div class="h-10 w-10 overflow-hidden rounded-full bg-surface-container-highest">
            <img alt="Admin Avatar" class="h-full w-full object-cover" data-alt="portrait of a focused professional chef wearing black uniform in a modern kitchen setting" src="../assets/images/admin-avatar.png">
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
      <transition name="success-alert">
        <div
          v-if="isSuccessAlertVisible"
          class="pointer-events-auto absolute right-8 top-6 z-[85] flex min-w-[280px] max-w-[480px] items-start gap-3 rounded-xl border border-emerald-400/35 bg-[#0f1c17]/95 px-4 py-3 text-emerald-100 shadow-[0_10px_35px_rgba(16,185,129,0.25)] backdrop-blur"
        >
          <span class="material-symbols-outlined mt-[1px] text-[20px] text-emerald-300" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          <div class="min-w-0 flex-1">
            <p class="text-xs font-black uppercase tracking-[0.15em] text-emerald-300">Success</p>
            <p class="mt-1 text-sm font-semibold text-emerald-100">{{ successAlertMessage }}</p>
          </div>
          <button class="text-emerald-300/80 transition-colors hover:text-emerald-100" @click="isSuccessAlertVisible = false">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </transition>

      <header class="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-outline-variant/10 bg-surface/80 px-10 backdrop-blur-xl">
        <div>
          <h2 class="monolith-header text-2xl font-bold tracking-tighter text-on-surface">MENU MANAGEMENT</h2>
          <div class="mt-1 flex items-center gap-4">
            <span class="text-[10px] uppercase tracking-widest text-outline">Inventory Alpha 04</span>
            <span class="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-green-500">System Online</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="rounded-sm border border-outline-variant/30 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-outline transition-colors hover:text-on-surface" @click="exitAdmin">
            Exit Admin
          </button>
          <button class="group flex items-center gap-2 rounded-sm bg-primary-container px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-on-primary-fixed shadow-[0_0_20px_rgba(255,86,37,0.2)] transition-all hover:scale-[1.02] active:scale-95" @click="openCreateModal">
            <span class="material-symbols-outlined text-sm">add</span>
            Add New Item
          </button>
        </div>
      </header>

      <div class="flex-1 space-y-12 overflow-y-auto p-10">
        <section class="grid grid-cols-4 gap-6">
          <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
            <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Total Items</p>
            <div class="flex items-end justify-between">
              <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ totalItems }}</span>
              <span class="text-xs font-bold text-primary-container">catalog loaded</span>
            </div>
          </div>
          <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
            <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Active Specials</p>
            <div class="flex items-end justify-between">
              <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">06</span>
              <div class="mb-2 h-1 w-12 overflow-hidden rounded-full bg-primary-container/20">
                <div class="h-full w-[60%] bg-primary-container"></div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
            <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Inventory Status</p>
            <div class="flex items-end justify-between">
              <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">98<span class="text-lg font-light opacity-50">%</span></span>
              <span class="material-symbols-outlined text-green-500" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
          </div>
          <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
            <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">System Health</p>
            <div class="flex items-end justify-between">
              <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">OPTIMAL</span>
              <span class="material-symbols-outlined text-blue-400">analytics</span>
            </div>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="monolith-header text-lg font-extrabold uppercase tracking-tighter text-on-surface">Active Inventory</h3>
            <div class="flex gap-4">
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
                <input class="w-64 rounded-sm border-none bg-surface-container-low py-2 pl-10 pr-4 text-[10px] uppercase tracking-widest text-on-surface placeholder-outline/50 focus:ring-1 focus:ring-primary-container" placeholder="FILTER BY NAME..." type="text">
              </div>
              <button class="bg-surface-container-high px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-outline transition-colors hover:text-on-surface">
                Category: All
              </button>
            </div>
          </div>

          <div class="w-full">
            <div class="grid grid-cols-12 gap-4 border-b border-outline-variant/20 bg-surface-container-lowest px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-outline">
              <div class="col-span-5">Product Identity</div>
              <div class="col-span-2">Category</div>
              <div class="col-span-2">Price</div>
              <div class="col-span-1 text-center">Status</div>
              <div class="col-span-2 text-right">Operations</div>
            </div>

            <div
              v-for="item in paginatedItems"
              :key="item.id"
              class="group grid grid-cols-12 items-center gap-4 border-b border-outline-variant/5 bg-surface-container-low px-6 py-5 transition-colors hover:bg-surface-container"
            >
              <div class="col-span-5 flex items-center gap-4">
                <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-surface-container-highest grayscale transition-all duration-500 group-hover:grayscale-0">
                  <img :alt="item.name" class="h-full w-full object-cover" :src="item.image">
                </div>
                <div>
                  <p class="monolith-header text-sm font-bold tracking-tight text-on-surface">{{ item.name.toUpperCase() }}</p>
                  <p class="text-[10px] font-medium text-outline/70">SKU: {{ formatSku(item.id) }} • {{ item.description }}</p>
                </div>
              </div>
              <div class="col-span-2">
                <span class="rounded-sm bg-surface-container-highest px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">{{ item.category }}</span>
              </div>
              <div class="col-span-2">
                <span class="text-sm font-black tracking-tighter text-primary-container">{{ item.price }}</span>
              </div>
              <div class="col-span-1 flex justify-center">
                <div
                  class="rounded-sm px-2 py-0.5"
                  :class="item.status === 'Available'
                    ? 'border border-green-500/30 bg-green-500/5'
                    : 'border border-error/30 bg-error/5'"
                >
                  <p
                    class="text-[9px] font-black uppercase tracking-tighter"
                    :class="item.status === 'Available' ? 'text-green-500' : 'text-error'"
                  >
                    {{ item.status }}
                  </p>
                </div>
              </div>
              <div class="col-span-2 flex justify-end gap-3 opacity-30 transition-opacity group-hover:opacity-100">
                <button class="p-2 text-outline transition-colors hover:text-white" @click="openEditModal(item)"><span class="material-symbols-outlined text-lg">edit</span></button>
                <button class="p-2 text-outline transition-colors hover:text-error" @click="openDeleteModal(item)"><span class="material-symbols-outlined text-lg">delete</span></button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4">
            <div class="flex items-center gap-6">
              <p class="text-[10px] font-bold uppercase tracking-widest text-outline">Displaying {{ showingFrom }}-{{ showingTo }} of {{ totalItems }} items</p>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-widest text-outline">Per page</span>
                <button
                  v-for="size in pageSizeOptions"
                  :key="size"
                  class="flex h-8 min-w-8 items-center justify-center rounded-sm border px-2 text-[10px] font-bold transition-colors"
                  :class="itemsPerPage === size
                    ? 'border-primary-container bg-primary-container text-on-primary-fixed'
                    : 'border-outline-variant/20 bg-surface-container-low text-outline hover:text-on-surface'"
                  @click="setItemsPerPage(size)"
                >
                  {{ size }}
                </button>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-highest text-outline transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage === 1"
                @click="goToPreviousPage"
              >
                <span class="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button
                v-for="page in visiblePageNumbers"
                :key="page"
                class="flex h-8 w-8 items-center justify-center rounded-sm text-xs font-bold transition-colors"
                :class="currentPage === page
                  ? 'bg-primary-container text-on-primary-fixed'
                  : 'bg-surface-container-low text-outline hover:text-on-surface'"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <button
                class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-highest text-outline transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
              >
                <span class="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-3 gap-8">
          <div class="group relative col-span-2 overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-8">
            <div class="absolute right-0 top-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
              <span class="material-symbols-outlined text-8xl">precision_manufacturing</span>
            </div>
            <h4 class="monolith-header mb-4 text-sm font-black uppercase tracking-widest text-primary-container">Chef's Signature Recommendation</h4>
            <div class="flex items-center gap-8">
              <div class="flex-1 space-y-4">
                <p class="text-xl font-bold leading-snug tracking-tight text-on-surface">
                  "The <span class="italic">Smoked Duck Ramen</span> is currently seeing a 40% uptick in orders. Ensure wood chip inventory is at 100% capacity for the weekend rush."
                </p>
                <p class="text-[10px] uppercase tracking-[0.2em] text-outline">— Head Chef Yamamoto, Internal Memo</p>
              </div>
              <div class="flex h-32 w-32 items-center justify-center rounded-full border border-primary-container/20 bg-surface-container-high">
                <div class="text-center">
                  <p class="text-2xl font-black text-primary-container">40%</p>
                  <p class="text-[8px] font-bold uppercase text-outline">Trend</p>
                </div>
              </div>
            </div>
          </div>
          <div class="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-6">
            <h4 class="monolith-header mb-6 text-[10px] font-black uppercase tracking-widest text-outline">Security &amp; Action Log</h4>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-container"></div>
                <div>
                  <p class="text-[11px] font-bold text-on-surface">Item Added: "Summer Yuzu Chill"</p>
                  <p class="text-[9px] uppercase tracking-wider text-outline">09:42 AM • Yamamoto</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-outline/30"></div>
                <div>
                  <p class="text-[11px] font-bold text-on-surface">Inventory Sync Complete</p>
                  <p class="text-[9px] uppercase tracking-wider text-outline">08:00 AM • Automated</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-error shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                <div>
                  <p class="text-[11px] font-bold text-on-surface">Stock Depleted: Wagyu Gyoza</p>
                  <p class="text-[9px] uppercase tracking-wider text-outline">07:22 AM • System</p>
                </div>
              </div>
            </div>
            <button class="mt-6 w-full border border-outline-variant/20 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-outline transition-all hover:bg-surface-container-high hover:text-on-surface">View All Logs</button>
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

      <div
        v-if="isCreateModalOpen"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,86,37,0.18),rgba(0,0,0,0.88)_55%)] p-6 backdrop-blur-md"
        @click.self="closeCreateModal"
      >
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#101218] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
          <div class="h-1 w-full bg-gradient-to-r from-[#ff5625] via-[#ff7d4d] to-[#ff5625]"></div>
          <div class="p-7 sm:p-8">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h4 class="monolith-header text-xl font-extrabold uppercase tracking-tight text-[#f5f7ff]">Add New Item</h4>
              <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#8f98a8]">Name, image, type and price in USD</p>
            </div>
            <button class="rounded-lg border border-white/10 p-2 text-[#8f98a8] transition-colors hover:border-white/30 hover:text-[#f5f7ff]" @click="closeCreateModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <form class="space-y-5" @submit.prevent="addNewItem">
            <div>
              <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Name</label>
              <input
                v-model="newItemName"
                class="modal-input"
                placeholder="Example: Spicy Miso"
                type="text"
              >
            </div>

            <div>
              <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Description</label>
              <textarea
                v-model="newItemDescription"
                class="modal-input min-h-[90px] resize-y"
                placeholder="Short description of the item"
              ></textarea>
            </div>

            <div>
              <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Image URL</label>
              <input
                v-model="newItemImage"
                class="modal-input"
                placeholder="https://..."
                type="url"
              >
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Type</label>
                <div class="modal-select-wrap">
                  <select v-model="newItemCategory" class="modal-select">
                    <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
                  </select>
                  <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9fa8b8]">expand_more</span>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Price (USD)</label>
                <div class="relative">
                  <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#ff7d4d]">$</span>
                  <input
                    v-model.number="newItemPriceUsd"
                    class="modal-input no-number-spin pl-9 text-right"
                    min="0.01"
                    placeholder="12.99"
                    step="0.01"
                    type="number"
                  >
                </div>
              </div>
            </div>

            <p v-if="modalError" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">{{ modalError }}</p>

            <div class="flex justify-end gap-3 pt-3">
              <button
                class="rounded-lg border border-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#adb4c1] transition-colors hover:border-white/35 hover:text-white"
                type="button"
                @click="closeCreateModal"
              >
                Cancel
              </button>
              <button
                class="rounded-lg bg-gradient-to-r from-[#ff5625] to-[#ff7d4d] px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-[0_10px_28px_rgba(255,86,37,0.4)] transition-transform hover:scale-[1.02] active:scale-95"
                type="submit"
              >
                Save Item
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-[80] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,86,37,0.18),rgba(0,0,0,0.88)_55%)] p-6 backdrop-blur-md"
        @click.self="closeEditModal"
      >
        <div class="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#101218] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
          <div class="h-1 w-full bg-gradient-to-r from-[#ff5625] via-[#ff7d4d] to-[#ff5625]"></div>
          <div class="p-7 sm:p-8">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <h4 class="monolith-header text-xl font-extrabold uppercase tracking-tight text-[#f5f7ff]">Edit Item</h4>
                <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#8f98a8]">Update name, description, image, type and USD price</p>
              </div>
              <button class="rounded-lg border border-white/10 p-2 text-[#8f98a8] transition-colors hover:border-white/30 hover:text-[#f5f7ff]" @click="closeEditModal">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form class="space-y-5" @submit.prevent="saveEditedItem">
              <div>
                <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Name</label>
                <input
                  v-model="editItemName"
                  class="modal-input"
                  placeholder="Example: Spicy Miso"
                  type="text"
                >
              </div>

              <div>
                <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Description</label>
                <textarea
                  v-model="editItemDescription"
                  class="modal-input min-h-[90px] resize-y"
                  placeholder="Short description of the item"
                ></textarea>
              </div>

              <div>
                <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Image URL</label>
                <input
                  v-model="editItemImage"
                  class="modal-input"
                  placeholder="https://..."
                  type="url"
                >
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Type</label>
                  <div class="modal-select-wrap">
                    <select v-model="editItemCategory" class="modal-select">
                      <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
                    </select>
                    <span class="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-[#9fa8b8]">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#9fa8b8]">Price (USD)</label>
                  <div class="relative">
                    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#ff7d4d]">$</span>
                    <input
                      v-model.number="editItemPriceUsd"
                      class="modal-input no-number-spin pl-9 text-right"
                      min="0.01"
                      placeholder="12.99"
                      step="0.01"
                      type="number"
                    >
                  </div>
                </div>
              </div>

              <p v-if="editModalError" class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">{{ editModalError }}</p>

              <div class="flex justify-end gap-3 pt-3">
                <button
                  class="rounded-lg border border-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#adb4c1] transition-colors hover:border-white/35 hover:text-white"
                  type="button"
                  @click="closeEditModal"
                >
                  Cancel
                </button>
                <button
                  class="rounded-lg bg-gradient-to-r from-[#ff5625] to-[#ff7d4d] px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-[0_10px_28px_rgba(255,86,37,0.4)] transition-transform hover:scale-[1.02] active:scale-95"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-[82] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.16),rgba(0,0,0,0.9)_58%)] p-6 backdrop-blur-md"
        @click.self="closeDeleteModal"
      >
        <div class="w-full max-w-lg overflow-hidden rounded-2xl border border-red-400/20 bg-[#101218] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
          <div class="h-1 w-full bg-gradient-to-r from-red-500 via-red-400 to-red-500"></div>
          <div class="p-7 sm:p-8">
            <div class="mb-5 flex items-start gap-4">
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-red-400/35 bg-red-500/10 text-red-300">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">warning</span>
              </div>
              <div class="flex-1">
                <h4 class="monolith-header text-xl font-extrabold uppercase tracking-tight text-[#f5f7ff]">Confirm Delete</h4>
                <p class="mt-1 text-sm text-[#b8c0cf]">
                  Are you sure you want to delete
                  <span class="font-bold text-red-300">"{{ deletingItemName }}"</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                class="rounded-lg border border-white/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#adb4c1] transition-colors hover:border-white/35 hover:text-white"
                type="button"
                @click="closeDeleteModal"
              >
                Cancel
              </button>
              <button
                class="rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-[0_10px_28px_rgba(220,38,38,0.35)] transition-transform hover:scale-[1.02] active:scale-95"
                type="button"
                @click="confirmDeleteItem"
              >
                Delete Item
              </button>
            </div>
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

.modal-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(13, 16, 24, 0.95);
  color: #f5f7ff;
  padding: 0.7rem 0.85rem;
  font-size: 0.92rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.modal-input::placeholder {
  color: rgba(160, 169, 184, 0.75);
}

.modal-input:focus {
  border-color: rgba(255, 125, 77, 0.9);
  background: rgba(10, 13, 20, 0.98);
  box-shadow: 0 0 0 3px rgba(255, 86, 37, 0.18);
  outline: none;
}

.modal-select-wrap {
  position: relative;
}

.modal-select {
  width: 100%;
  appearance: none;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(13, 16, 24, 0.95);
  color: #f5f7ff;
  padding: 0.7rem 2.4rem 0.7rem 0.85rem;
  font-size: 0.92rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.modal-select:focus {
  border-color: rgba(255, 125, 77, 0.9);
  background: rgba(10, 13, 20, 0.98);
  box-shadow: 0 0 0 3px rgba(255, 86, 37, 0.18);
  outline: none;
}

.modal-select option {
  background-color: #0e131d;
  color: #f5f7ff;
}

.no-number-spin::-webkit-outer-spin-button,
.no-number-spin::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-number-spin[type='number'] {
  -moz-appearance: textfield;
}

.success-alert-enter-active,
.success-alert-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.success-alert-enter-from,
.success-alert-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

:global(body) {
  background-color: #131313;
  color: #e5e2e1;
  font-family: 'Inter', sans-serif;
}

:global(::-webkit-scrollbar) {
  width: 4px;
}

:global(::-webkit-scrollbar-track) {
  background: #0e0e0e;
}

:global(::-webkit-scrollbar-thumb) {
  background: #2a2a2a;
}

:global(::-webkit-scrollbar-thumb:hover) {
  background: #ff5625;
}
</style>



