<script setup lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import UniversalMenu from '@/components/UniversalMenu.vue'

const router = useRouter()
const store = useStore()

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
          <button class="group flex items-center gap-2 rounded-sm bg-primary-container px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-on-primary-fixed shadow-[0_0_20px_rgba(255,86,37,0.2)] transition-all hover:scale-[1.02] active:scale-95">
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
              <span class="monolith-header text-3xl font-black tracking-tighter text-on-surface">48</span>
              <span class="text-xs font-bold text-primary-container">+4 this month</span>
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

            <div class="group grid grid-cols-12 items-center gap-4 border-b border-outline-variant/5 bg-surface-container-low px-6 py-5 transition-colors hover:bg-surface-container">
              <div class="col-span-5 flex items-center gap-4">
                <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-surface-container-highest grayscale transition-all duration-500 group-hover:grayscale-0">
                  <img alt="Ramen" class="h-full w-full object-cover" data-alt="top-down close up of premium tonkotsu ramen with soft boiled egg and spring onions on dark background" src="../assets/images/admin-black-garlic-tonkotsu.png">
                </div>
                <div>
                  <p class="monolith-header text-sm font-bold tracking-tight text-on-surface">BLACK GARLIC TONKOTSU</p>
                  <p class="text-[10px] font-medium text-outline/70">SKU: MONO-001 • 18hr Broth</p>
                </div>
              </div>
              <div class="col-span-2">
                <span class="rounded-sm bg-surface-container-highest px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">Signature</span>
              </div>
              <div class="col-span-2">
                <span class="text-sm font-black tracking-tighter text-primary-container">$18.50</span>
              </div>
              <div class="col-span-1 flex justify-center">
                <div class="rounded-sm border border-green-500/30 bg-green-500/5 px-2 py-0.5">
                  <p class="text-[9px] font-black uppercase tracking-tighter text-green-500">Available</p>
                </div>
              </div>
              <div class="col-span-2 flex justify-end gap-3 opacity-30 transition-opacity group-hover:opacity-100">
                <button class="p-2 text-outline transition-colors hover:text-white"><span class="material-symbols-outlined text-lg">edit</span></button>
                <button class="p-2 text-outline transition-colors hover:text-error"><span class="material-symbols-outlined text-lg">delete</span></button>
              </div>
            </div>

            <div class="group grid grid-cols-12 items-center gap-4 border-b border-outline-variant/5 bg-surface-container-low px-6 py-5 transition-colors hover:bg-surface-container">
              <div class="col-span-5 flex items-center gap-4">
                <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-surface-container-highest grayscale transition-all duration-500 group-hover:grayscale-0">
                  <img alt="Ramen" class="h-full w-full object-cover" data-alt="dramatic lighting on spicy miso ramen with red chili threads and wood ear mushrooms" src="../assets/images/admin-volcano-miso.png">
                </div>
                <div>
                  <p class="monolith-header text-sm font-bold tracking-tight text-on-surface">VOLCANO SPICY MISO</p>
                  <p class="text-[10px] font-medium text-outline/70">SKU: MONO-002 • Triple Chili</p>
                </div>
              </div>
              <div class="col-span-2">
                <span class="rounded-sm bg-surface-container-highest px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">Seasonal</span>
              </div>
              <div class="col-span-2">
                <span class="text-sm font-black tracking-tighter text-primary-container">$19.00</span>
              </div>
              <div class="col-span-1 flex justify-center">
                <div class="rounded-sm border border-green-500/30 bg-green-500/5 px-2 py-0.5">
                  <p class="text-[9px] font-black uppercase tracking-tighter text-green-500">Available</p>
                </div>
              </div>
              <div class="col-span-2 flex justify-end gap-3 opacity-30 transition-opacity group-hover:opacity-100">
                <button class="p-2 text-outline transition-colors hover:text-white"><span class="material-symbols-outlined text-lg">edit</span></button>
                <button class="p-2 text-outline transition-colors hover:text-error"><span class="material-symbols-outlined text-lg">delete</span></button>
              </div>
            </div>

            <div class="group grid grid-cols-12 items-center gap-4 border-b border-outline-variant/5 bg-surface-container-low px-6 py-5 transition-colors hover:bg-surface-container">
              <div class="col-span-5 flex items-center gap-4">
                <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-surface-container-highest opacity-40 grayscale">
                  <img alt="Gyoza" class="h-full w-full object-cover" data-alt="crispy pan-fried gyoza dumplings served on a black ceramic plate with steam rising" src="../assets/images/admin-gyoza.png">
                </div>
                <div>
                  <p class="monolith-header text-sm font-bold tracking-tight text-on-surface opacity-50">CRISPY WAGYU GYOZA</p>
                  <p class="text-[10px] font-medium text-outline/50">SKU: SIDE-014 • Hand-Pleated</p>
                </div>
              </div>
              <div class="col-span-2">
                <span class="rounded-sm bg-surface-container-highest px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-outline/50">Sides</span>
              </div>
              <div class="col-span-2">
                <span class="text-sm font-black tracking-tighter text-primary-container/50">$12.00</span>
              </div>
              <div class="col-span-1 flex justify-center">
                <div class="rounded-sm border border-error/30 bg-error/5 px-2 py-0.5">
                  <p class="text-[9px] font-black uppercase tracking-tighter text-error">Depleted</p>
                </div>
              </div>
              <div class="col-span-2 flex justify-end gap-3 opacity-30 transition-opacity group-hover:opacity-100">
                <button class="p-2 text-outline transition-colors hover:text-white"><span class="material-symbols-outlined text-lg">edit</span></button>
                <button class="p-2 text-outline transition-colors hover:text-error"><span class="material-symbols-outlined text-lg">delete</span></button>
              </div>
            </div>

            <div class="group grid grid-cols-12 items-center gap-4 border-b border-outline-variant/5 bg-surface-container-low px-6 py-5 transition-colors hover:bg-surface-container">
              <div class="col-span-5 flex items-center gap-4">
                <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-surface-container-highest grayscale transition-all duration-500 group-hover:grayscale-0">
                  <img alt="Truffle Ramen" class="h-full w-full object-cover" data-alt="luxury ramen bowl featuring shaved black truffles and gold leaf garnish in a rich creamy broth" src="../assets/images/admin-truffle-shio.png">
                </div>
                <div>
                  <p class="monolith-header text-sm font-bold tracking-tight text-on-surface">TRUFFLE SHIO RAMEN</p>
                  <p class="text-[10px] font-medium text-outline/70">SKU: MONO-009 • Himalayan Salt</p>
                </div>
              </div>
              <div class="col-span-2">
                <span class="rounded-sm bg-surface-container-highest px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface">Premium</span>
              </div>
              <div class="col-span-2">
                <span class="text-sm font-black tracking-tighter text-primary-container">$24.00</span>
              </div>
              <div class="col-span-1 flex justify-center">
                <div class="rounded-sm border border-green-500/30 bg-green-500/5 px-2 py-0.5">
                  <p class="text-[9px] font-black uppercase tracking-tighter text-green-500">Available</p>
                </div>
              </div>
              <div class="col-span-2 flex justify-end gap-3 opacity-30 transition-opacity group-hover:opacity-100">
                <button class="p-2 text-outline transition-colors hover:text-white"><span class="material-symbols-outlined text-lg">edit</span></button>
                <button class="p-2 text-outline transition-colors hover:text-error"><span class="material-symbols-outlined text-lg">delete</span></button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-outline">Displaying 4 of 48 items</p>
            <div class="flex gap-2">
              <button class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-highest text-outline transition-colors hover:text-on-surface"><span class="material-symbols-outlined text-sm">chevron_left</span></button>
              <button class="flex h-8 w-8 items-center justify-center rounded-sm bg-primary-container text-xs font-bold text-on-primary-fixed">1</button>
              <button class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-low text-xs font-bold text-outline transition-colors hover:text-on-surface">2</button>
              <button class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-low text-xs font-bold text-outline transition-colors hover:text-on-surface">3</button>
              <button class="flex h-8 w-8 items-center justify-center rounded-sm bg-surface-container-highest text-outline transition-colors hover:text-on-surface"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
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



