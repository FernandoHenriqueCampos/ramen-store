<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import UniversalMenu from '@/components/UniversalMenu.vue'

type SoldItem = {
  id: string
  name: string
  quantity: number
  unitPrice: number
  category: 'Ramen' | 'Drinks' | 'Sides'
}

type SaleOrder = {
  id: string
  createdAt: string
  total: number
  items: SoldItem[]
  channel: 'Counter' | 'Delivery' | 'App'
}

const SALES_STORAGE_KEY = 'ramen_sales_orders'

const router = useRouter()
const store = useStore()
const orders = ref<SaleOrder[]>([])
const selectedRange = ref<7 | 30 | 90>(30)

const rangeOptions: Array<{ label: string; value: 7 | 30 | 90 }> = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
]

function seedOrders(): SaleOrder[] {
  const now = new Date()
  const catalog: SoldItem[] = [
    { id: 'ramen-monolith-tonkotsu', name: 'Monolith Tonkotsu', quantity: 1, unitPrice: 24, category: 'Ramen' },
    { id: 'ramen-thermal-miso', name: 'Thermal Miso', quantity: 1, unitPrice: 21, category: 'Ramen' },
    { id: 'ramen-synthetic-clear', name: 'Synthetic Clear', quantity: 1, unitPrice: 19, category: 'Ramen' },
    { id: 'drink-yuzu-highball', name: 'Yuzu Highball', quantity: 1, unitPrice: 14, category: 'Drinks' },
    { id: 'drink-matcha-iced', name: 'Matcha Iced', quantity: 1, unitPrice: 7, category: 'Drinks' },
    { id: 'side-gyoza', name: 'Seared Gyoza', quantity: 1, unitPrice: 9, category: 'Sides' },
  ]

  const generated: SaleOrder[] = []

  for (let i = 0; i < 120; i += 1) {
    const daysAgo = Math.floor(Math.random() * 90)
    const orderDate = new Date(now)
    orderDate.setDate(now.getDate() - daysAgo)
    orderDate.setHours(11 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60), 0, 0)

    const itemCount = 1 + Math.floor(Math.random() * 4)
    const items: SoldItem[] = []
    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const randomItem = catalog[Math.floor(Math.random() * catalog.length)]!
      const quantity = 1 + Math.floor(Math.random() * 3)
      items.push({
        ...randomItem,
        quantity,
      })
    }

    const total = Number(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2))
    generated.push({
      id: `sale-${orderDate.getTime().toString(36)}-${i.toString(36)}`,
      createdAt: orderDate.toISOString(),
      total,
      items,
      channel: ['Counter', 'Delivery', 'App'][Math.floor(Math.random() * 3)] as SaleOrder['channel'],
    })
  }

  return generated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function persistOrders(value: SaleOrder[]): void {
  localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(value))
}

function loadOrders(): SaleOrder[] {
  const raw = localStorage.getItem(SALES_STORAGE_KEY)
  if (!raw) {
    const seeded = seedOrders()
    persistOrders(seeded)
    return seeded
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as SaleOrder[]
  } catch {
    return []
  }
}

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`
}

function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(new Date(value))
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const filteredOrders = computed(() => {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - selectedRange.value)
  return orders.value.filter((order) => new Date(order.createdAt) >= cutoff)
})

const totalRevenue = computed(() => filteredOrders.value.reduce((sum, order) => sum + order.total, 0))
const totalOrders = computed(() => filteredOrders.value.length)
const totalUnits = computed(() => filteredOrders.value.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0))
const averageTicket = computed(() => (totalOrders.value ? totalRevenue.value / totalOrders.value : 0))

const revenueByDay = computed(() => {
  const map = new Map<string, number>()
  filteredOrders.value.forEach((order) => {
    const key = order.createdAt.slice(0, 10)
    map.set(key, (map.get(key) ?? 0) + order.total)
  })

  const points = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({
      date,
      label: formatShortDate(date),
      value,
    }))

  const max = Math.max(1, ...points.map((point) => point.value))
  return points.slice(-14).map((point) => ({
    ...point,
    percentage: Math.max(4, Math.round((point.value / max) * 100)),
  }))
})

const topItems = computed(() => {
  const map = new Map<string, { name: string; qty: number; revenue: number }>()
  filteredOrders.value.forEach((order) => {
    order.items.forEach((item) => {
      const current = map.get(item.id) ?? { name: item.name, qty: 0, revenue: 0 }
      current.qty += item.quantity
      current.revenue += item.quantity * item.unitPrice
      map.set(item.id, current)
    })
  })

  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
})

const recentOrders = computed(() => filteredOrders.value.slice(0, 8))

function exitAdmin(): void {
  store.dispatch('adminAuth/logout')
  router.push('/login')
}

onMounted(() => {
  orders.value = loadOrders()
  window.addEventListener('focus', handleWindowFocus)
  window.addEventListener('storage', handleStorageChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('focus', handleWindowFocus)
  window.removeEventListener('storage', handleStorageChange)
})

function refreshOrders(): void {
  orders.value = loadOrders()
}

function handleWindowFocus(): void {
  refreshOrders()
}

function handleStorageChange(event: StorageEvent): void {
  if (event.key !== SALES_STORAGE_KEY) return
  refreshOrders()
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
          <router-link class="group flex items-center gap-3 rounded border-r-2 border-primary-container bg-surface-container-high px-4 py-3 text-primary-container" to="/admin/sales">
            <span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">dashboard</span>
            <span class="font-label text-sm font-bold tracking-tight">Dashboard</span>
          </router-link>
          <router-link class="group flex items-center gap-3 rounded px-4 py-3 text-on-surface/60 transition-all duration-300 hover:bg-surface-container-low hover:text-primary-container" to="/admin">
            <span class="material-symbols-outlined text-[20px]">restaurant_menu</span>
            <span class="font-label text-sm font-medium tracking-tight">Menu Items</span>
          </router-link>
          <router-link class="group flex items-center gap-3 rounded px-4 py-3 text-on-surface/60 transition-all duration-300 hover:bg-surface-container-low hover:text-primary-container" to="/admin/stock">
            <span class="material-symbols-outlined text-[20px]">inventory_2</span>
            <span class="font-label text-sm font-medium tracking-tight">Stock</span>
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
            <h2 class="monolith-header text-2xl font-bold tracking-tighter text-on-surface">SALES DASHBOARD</h2>
            <div class="mt-1 flex items-center gap-4">
              <span class="text-[10px] uppercase tracking-widest text-outline">Revenue Intelligence</span>
              <span class="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              <span class="text-[10px] font-bold uppercase tracking-widest text-green-500">Live</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-for="option in rangeOptions"
              :key="option.value"
              class="rounded-sm border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors"
              :class="selectedRange === option.value
                ? 'border-primary-container bg-primary-container text-on-primary-fixed'
                : 'border-outline-variant/30 text-outline hover:text-on-surface'"
              @click="selectedRange = option.value"
            >
              {{ option.label }}
            </button>
            <button class="rounded-sm border border-outline-variant/30 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-outline transition-colors hover:text-on-surface" @click="exitAdmin">
              Exit Admin
            </button>
          </div>
        </header>

        <div class="flex-1 space-y-10 overflow-y-auto p-10">
          <section class="grid grid-cols-4 gap-6">
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Revenue</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ formatMoney(totalRevenue) }}</span>
                <span class="text-xs font-bold text-primary-container">{{ selectedRange }}d</span>
              </div>
            </div>
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Orders</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ totalOrders }}</span>
                <span class="material-symbols-outlined text-blue-400">receipt_long</span>
              </div>
            </div>
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Avg Ticket</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ formatMoney(averageTicket) }}</span>
                <span class="material-symbols-outlined text-green-500" style="font-variation-settings: 'FILL' 1;">payments</span>
              </div>
            </div>
            <div class="rounded-lg border border-outline-variant/5 bg-surface-container-low p-6">
              <p class="mb-2 text-[10px] uppercase tracking-[0.2em] text-outline">Units Sold</p>
              <div class="flex items-end justify-between">
                <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">{{ totalUnits }}</span>
                <span class="material-symbols-outlined text-amber-400">shopping_bag</span>
              </div>
            </div>
          </section>

          <section class="grid grid-cols-3 gap-8">
            <div class="col-span-2 rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-6">
              <div class="mb-5 flex items-center justify-between">
                <h3 class="monolith-header text-sm font-black uppercase tracking-widest text-outline">Revenue Trend (Last 14 Days)</h3>
                <span class="text-[10px] uppercase tracking-[0.16em] text-outline">Daily gross</span>
              </div>
              <div class="space-y-2">
                <div v-for="point in revenueByDay" :key="point.date" class="grid grid-cols-[52px_1fr_86px] items-center gap-3">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-outline">{{ point.label }}</span>
                  <div class="h-2 overflow-hidden rounded-full bg-surface-container-high">
                    <div class="h-full bg-primary-container" :style="{ width: `${point.percentage}%` }"></div>
                  </div>
                  <span class="text-right text-xs font-bold text-on-surface">{{ formatMoney(point.value) }}</span>
                </div>
                <p v-if="revenueByDay.length === 0" class="py-8 text-center text-sm text-outline">No sales data for selected range.</p>
              </div>
            </div>

            <div class="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-6">
              <h3 class="monolith-header mb-5 text-sm font-black uppercase tracking-widest text-outline">Top Items</h3>
              <div class="space-y-3">
                <div v-for="item in topItems" :key="item.name" class="rounded-sm border border-outline-variant/15 bg-surface-container-low p-3">
                  <p class="text-[11px] font-bold uppercase tracking-tight text-on-surface">{{ item.name }}</p>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-[10px] font-bold uppercase tracking-[0.13em] text-outline">{{ item.qty }} units</span>
                    <span class="text-xs font-black text-primary-container">{{ formatMoney(item.revenue) }}</span>
                  </div>
                </div>
                <p v-if="topItems.length === 0" class="py-4 text-center text-sm text-outline">No items in selected range.</p>
              </div>
            </div>
          </section>

          <section class="rounded-lg border border-outline-variant/10 bg-surface-container-lowest p-6">
            <div class="mb-5 flex items-center justify-between">
              <h3 class="monolith-header text-sm font-black uppercase tracking-widest text-outline">Recent Orders</h3>
              <span class="text-[10px] uppercase tracking-[0.16em] text-outline">Last {{ recentOrders.length }} entries</span>
            </div>

            <div class="grid grid-cols-12 gap-4 border-b border-outline-variant/20 bg-surface-container-low px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-outline">
              <div class="col-span-3">Order</div>
              <div class="col-span-3">Date</div>
              <div class="col-span-2">Channel</div>
              <div class="col-span-2">Items</div>
              <div class="col-span-2 text-right">Total</div>
            </div>
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="grid grid-cols-12 items-center gap-4 border-b border-outline-variant/10 px-4 py-4 text-xs"
            >
              <div class="col-span-3 font-bold text-on-surface">{{ order.id.toUpperCase() }}</div>
              <div class="col-span-3 text-outline">{{ formatDateTime(order.createdAt) }}</div>
              <div class="col-span-2 text-on-surface">{{ order.channel }}</div>
              <div class="col-span-2 text-outline">{{ order.items.reduce((sum, item) => sum + item.quantity, 0) }}</div>
              <div class="col-span-2 text-right font-black text-primary-container">{{ formatMoney(order.total) }}</div>
            </div>
            <p v-if="recentOrders.length === 0" class="py-8 text-center text-sm text-outline">No orders for selected range.</p>
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
</style>
