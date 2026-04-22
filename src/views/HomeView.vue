<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { formatMoney } from '@/utils/format'
import nebulaImage from '@/assets/images/home-spec-nebula.png'
import cinematicBowlVideo from '@/assets/videos/cinematic-bowl-of-ramen.mp4'
import { defaultUserCatalogItems, type UserCatalogItem } from '@/data/userMenuItems'
import type { RootState } from '@/store'
import { getItemStock } from '@/utils/inventory'

const heroSection = ref<HTMLElement | null>(null)
const heroOffsetY = ref(0)
const scrollVideoSection = ref<HTMLElement | null>(null)
const scrollVideoElement = ref<HTMLVideoElement | null>(null)
const scrollVideoDuration = ref(0)
const scrollVideoTravelDistance = ref(1)
const scrollVideoProgress = ref(0)
const store = useStore<RootState>()
const router = useRouter()
type NotifyFn = (type: 'success' | 'error' | 'info', title: string, message: string) => void
const notify = inject<NotifyFn>('notify', () => {})
const RELEASE_WINDOW_SECONDS = 180
const limitedReleaseItem = ref<UserCatalogItem | null>(null)
const limitedReleaseSecondsLeft = ref(RELEASE_WINDOW_SECONDS)
let limitedReleaseTimer: ReturnType<typeof setInterval> | null = null
let scrollSyncFrame: number | null = null

type StoryTopic = {
  title: string
  description: string
}

type StoryStage = {
  topics: [StoryTopic, StoryTopic]
}

const storyStages: StoryStage[] = [
  {
    topics: [
      {
        title: 'Thermal Control',
        description:
          'Our broth is calibrated at a constant 92 C for 36 hours. Every gram of collagen is extracted through rigorous temperature cycles to ensure peak molecular density.',
      },
      {
        title: 'Noodle Geometry',
        description:
          'Designed with specific hydration levels to maintain tensile strength. The surface area is calculated to maximize broth adherence for a perfect flavor payload.',
      },
    ],
  },
  {
    topics: [
      {
        title: 'Aroma Layering',
        description:
          'Aromatic oils are introduced in controlled micro-doses to create top notes first, then deeper roasted notes as the bowl evolves.',
      },
      {
        title: 'Umami Stack',
        description:
          'Kombu, shiitake, and tare are balanced in timed reductions so each sip hits sweet, saline, and savory in sequence.',
      },
    ],
  },
  {
    topics: [
      {
        title: 'Final Calibration',
        description:
          'Before plating, we run final checks for density, aroma projection, and serving temperature to keep the experience precise.',
      },
      {
        title: 'Serving Rhythm',
        description:
          'Assembly timing is synchronized to seconds, ensuring toppings, noodles, and broth reach the guest at peak performance.',
      },
    ],
  },
]

const heroParallaxStyle = computed(() => ({
  transform: `translate3d(0, ${heroOffsetY.value}px, 0) scale(1.08)`,
}))
const cartItems = computed(() => store.getters['cart/items'] as Array<{ id: string; quantity: number }>)
const activeStoryStageIndex = computed(() =>
  Math.min(storyStages.length - 1, Math.floor(scrollVideoProgress.value * storyStages.length)),
)
const activeStoryTopics = computed(() => storyStages[activeStoryStageIndex.value]?.topics ?? storyStages[0]!.topics)
const storyTransitionName = ref<'story-forward' | 'story-backward'>('story-forward')

const limitedReleaseOriginalPrice = computed(() => {
  if (!limitedReleaseItem.value) return 0
  return parsePriceToNumber(limitedReleaseItem.value.price)
})

const limitedReleaseDiscountedPrice = computed(() => {
  return Number((limitedReleaseOriginalPrice.value * 0.9).toFixed(2))
})

const limitedReleaseCartId = computed(() => {
  if (!limitedReleaseItem.value) return ''
  return `limited-release-${limitedReleaseItem.value.id}`
})

const isLimitedReleaseInCart = computed(() => {
  if (!limitedReleaseCartId.value) return false
  return cartItems.value.some((item) => item.id === limitedReleaseCartId.value)
})

function getCartQuantity(itemId: string): number {
  return cartItems.value.find((item) => item.id === itemId)?.quantity ?? 0
}

const nebulaRemainingStock = computed(() => Math.max(0, getItemStock('spec-nebula') - getCartQuantity('spec-nebula')))
const limitedReleaseRemainingStock = computed(() => {
  if (!limitedReleaseCartId.value) return 0
  return Math.max(0, getItemStock(limitedReleaseCartId.value) - getCartQuantity(limitedReleaseCartId.value))
})

const limitedReleaseCountdownLabel = computed(() => {
  const minutes = Math.floor(limitedReleaseSecondsLeft.value / 60)
  const seconds = limitedReleaseSecondsLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const updateHeroParallax = () => {
  if (!heroSection.value) return

  const sectionTop = heroSection.value.getBoundingClientRect().top
  heroOffsetY.value = Math.round(sectionTop * -0.2)
}

const updateScrollVideoMetrics = () => {
  if (!scrollVideoSection.value) return

  scrollVideoTravelDistance.value = Math.max(
    scrollVideoSection.value.offsetHeight - window.innerHeight,
    1,
  )
}

const syncScrollVideoCurrentTime = () => {
  const video = scrollVideoElement.value
  const section = scrollVideoSection.value
  if (!video || !section || scrollVideoDuration.value <= 0) return

  const sectionTop = section.getBoundingClientRect().top
  const clampedDistance = Math.min(
    Math.max(-sectionTop, 0),
    scrollVideoTravelDistance.value,
  )
  const progress = clampedDistance / scrollVideoTravelDistance.value
  scrollVideoProgress.value = progress

  const targetTime = progress * scrollVideoDuration.value
  if (Math.abs(video.currentTime - targetTime) > 1 / 60) {
    video.currentTime = targetTime
  }
}

const queueViewportSync = () => {
  if (scrollSyncFrame !== null) return
  scrollSyncFrame = window.requestAnimationFrame(() => {
    scrollSyncFrame = null
    updateHeroParallax()
    updateScrollVideoMetrics()
    syncScrollVideoCurrentTime()
  })
}

const handleViewportScroll = () => {
  queueViewportSync()
}

const handleViewportResize = () => {
  queueViewportSync()
}

const handleScrollVideoLoadedMetadata = () => {
  const video = scrollVideoElement.value
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return

  scrollVideoDuration.value = video.duration
  video.currentTime = 0
  video.pause()
  queueViewportSync()
}

watch(activeStoryStageIndex, (next, previous) => {
  if (next === previous) return
  storyTransitionName.value = next > previous ? 'story-forward' : 'story-backward'
})

const addNebulaToCart = async () => {
  if (nebulaRemainingStock.value <= 0) {
    notify('error', 'Out of stock', 'THE NEBULA is currently unavailable.')
    return
  }

  const didAdd = (await store.dispatch('cart/addItemToCart', {
    item: {
      id: 'spec-nebula',
      name: 'THE NEBULA',
      price: '$24.00',
      category: 'Ramen',
      image: nebulaImage,
    },
    quantity: 1,
  })) as boolean

  if (!didAdd) {
    notify('info', 'Stock limit reached', 'You already reached the available stock in your cart.')
    return
  }

  notify('success', 'Added to cart', 'THE NEBULA has been added to your cart.')
}

function parsePriceToNumber(price: string): number {
  const normalized = price.replace(/[^0-9.]/g, '')
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function pickRandomLimitedReleaseItem(): UserCatalogItem {
  if (defaultUserCatalogItems.length <= 1) {
    return defaultUserCatalogItems[0]!
  }

  let item = defaultUserCatalogItems[Math.floor(Math.random() * defaultUserCatalogItems.length)]!
  while (item.id === limitedReleaseItem.value?.id) {
    item = defaultUserCatalogItems[Math.floor(Math.random() * defaultUserCatalogItems.length)]!
  }

  return item
}

function resetLimitedRelease() {
  limitedReleaseItem.value = pickRandomLimitedReleaseItem()
  limitedReleaseSecondsLeft.value = RELEASE_WINDOW_SECONDS
}

function startLimitedReleaseTimer() {
  if (limitedReleaseTimer) return

  limitedReleaseTimer = setInterval(() => {
    if (limitedReleaseSecondsLeft.value <= 1) {
      resetLimitedRelease()
      return
    }

    limitedReleaseSecondsLeft.value -= 1
  }, 1000)
}

function stopLimitedReleaseTimer() {
  if (!limitedReleaseTimer) return
  clearInterval(limitedReleaseTimer)
  limitedReleaseTimer = null
}

function goToCardapioItem(itemId: string): void {
  router.push({
    path: '/cardapio',
    query: { item: itemId },
  })
}

async function addLimitedReleaseToCart() {
  if (!limitedReleaseItem.value) return

  if (isLimitedReleaseInCart.value) {
    notify('info', 'Limit reached', 'You can only buy 1 unit of this limited release.')
    return
  }

  if (limitedReleaseRemainingStock.value <= 0) {
    notify('error', 'Out of stock', 'This limited release is currently unavailable.')
    return
  }

  const didAdd = (await store.dispatch('cart/addItemToCart', {
    item: {
      id: limitedReleaseCartId.value,
      name: `${limitedReleaseItem.value.name} - Limited Release`,
      price: formatMoney(limitedReleaseDiscountedPrice.value),
      category: limitedReleaseItem.value.category,
      image: limitedReleaseItem.value.image,
    },
    quantity: 1,
  })) as boolean

  if (!didAdd) {
    notify('info', 'Stock limit reached', 'You already reached the available stock in your cart.')
    return
  }

  notify('success', 'Limited release added', `${limitedReleaseItem.value.name} with 10% OFF is in your cart.`)
}

onMounted(() => {
  updateHeroParallax()
  updateScrollVideoMetrics()
  syncScrollVideoCurrentTime()
  resetLimitedRelease()
  startLimitedReleaseTimer()
  window.addEventListener('scroll', handleViewportScroll, { passive: true })
  window.addEventListener('resize', handleViewportResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleViewportScroll)
  window.removeEventListener('resize', handleViewportResize)
  if (scrollSyncFrame !== null) {
    window.cancelAnimationFrame(scrollSyncFrame)
    scrollSyncFrame = null
  }
  stopLimitedReleaseTimer()
})
</script>

<template>
  <div class="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-fixed">
    <main>
      <section ref="heroSection" class="relative flex h-screen flex-col items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img :style="heroParallaxStyle" class="h-full w-full object-cover opacity-60 brightness-75 grayscale-[20%] will-change-transform" data-alt="top-down dramatic photo of a steaming ramen bowl with rich dark broth and golden eggs on a matte black ceramic background" src="../assets/images/home-hero.png">
          <div class="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background"></div>
        </div>
        <div class="relative z-10 space-y-4 px-4 text-center">
          <h1 class="font-headline text-6xl font-black uppercase leading-[0.8] tracking-tighter text-on-surface md:text-[8rem]">
            RAMEN<br><span class="text-primary-container">MONOLITH</span>
          </h1>
          <p class="font-label text-sm uppercase tracking-[0.4em] text-secondary/60">The Engineering of Flavor</p>
        </div>
        <div class="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4">
          <div class="h-16 w-px bg-gradient-to-b from-primary-container to-transparent"></div>
        </div>
      </section>

      <section ref="scrollVideoSection" class="relative h-[420vh]">
        <div class="sticky top-0 flex min-h-screen items-center bg-background/70">
          <div class="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-16 px-8 py-16 md:grid-cols-12">
            <div class="space-y-12 md:col-span-7">
              <div class="space-y-4">
                <span class="font-label text-xs font-bold uppercase tracking-widest text-primary-container">The Philosophy</span>
                <h2 class="font-headline text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl">CRAFTED WITH<br>PRECISION.</h2>
              </div>
              <div class="relative overflow-hidden">
                <Transition :name="storyTransitionName">
                  <div :key="activeStoryStageIndex" class="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div class="space-y-4">
                      <h3 class="font-headline text-xl font-bold text-on-surface">{{ activeStoryTopics[0]?.title }}</h3>
                      <p class="font-body leading-relaxed text-on-surface-variant">{{ activeStoryTopics[0]?.description }}</p>
                    </div>
                    <div class="space-y-4">
                      <h3 class="font-headline text-xl font-bold text-on-surface">{{ activeStoryTopics[1]?.title }}</h3>
                      <p class="font-body leading-relaxed text-on-surface-variant">{{ activeStoryTopics[1]?.description }}</p>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            <div class="md:col-span-5 md:mt-24">
              <div class="relative aspect-square overflow-hidden rounded-lg bg-surface-container shadow-2xl">
                <video
                  ref="scrollVideoElement"
                  class="h-full w-full object-cover"
                  :src="cinematicBowlVideo"
                  muted
                  playsinline
                  preload="auto"
                  disablepictureinpicture
                  disableremoteplayback
                  @loadedmetadata="handleScrollVideoLoadedMetadata"
                ></video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-surface-container-low px-8 py-32">
        <div class="mx-auto max-w-7xl space-y-16">
          <div class="flex flex-col items-end justify-between gap-6 md:flex-row">
            <div class="space-y-4">
              <h2 class="font-headline text-3xl font-extrabold tracking-tighter">TECHNICAL SPECIFICATIONS</h2>
              <p class="font-body text-on-surface-variant">Limited quantity daily batches for absolute quality assurance.</p>
            </div>
            <RouterLink class="border-b border-outline-variant/40 pb-1 text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary-container" to="/cardapio">View All Specs</RouterLink>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div class="group relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-lg bg-surface-container p-8 md:col-span-2 md:row-span-2" :class="nebulaRemainingStock <= 0 ? 'opacity-45 saturate-0' : ''">
              <img class="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105" data-alt="dramatic lighting on a black bowl of spicy tonkotsu ramen with vibrant red chili oil swirls and green scallions" src="../assets/images/home-spec-nebula.png">
              <div class="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span class="rounded-full bg-primary-container px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-primary-fixed">Spec 01</span>
                  <h3 class="mt-4 font-headline text-4xl font-black leading-none">THE NEBULA</h3>
                </div>
                <div class="space-y-4 rounded-lg border border-outline-variant/20 bg-surface-container-lowest/40 p-6 backdrop-blur-md">
                  <p class="font-body text-sm text-on-surface/80">Black garlic infused tonkotsu, 48-hour cured chashu, smoked wood ear mushrooms.</p>
                  <div class="flex items-center justify-between">
                    <span class="font-headline text-lg font-bold text-primary-container">$24.00</span>
                  <button
                    class="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/40 transition-colors hover:bg-primary-container hover:text-on-primary-fixed"
                    :class="nebulaRemainingStock <= 0 ? 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-current' : ''"
                    :disabled="nebulaRemainingStock <= 0"
                    @click="addNebulaToCart"
                  >
                    <span class="material-symbols-outlined text-lg">add</span>
                  </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="group flex flex-col justify-between rounded-lg bg-surface-container p-6 transition-colors hover:bg-surface-container-high">
              <h4 class="font-headline font-bold text-on-surface">CORE TONKOTSU</h4>
              <div class="space-y-4">
                <div class="h-32 w-full overflow-hidden rounded-DEFAULT">
                  <img class="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" data-alt="minimalist overhead shot of a classic ramen bowl with simple garnishes on a dark textured table" src="../assets/images/home-core-tonkotsu.png">
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-headline font-bold text-primary-container">$18.00</span>
                  <button
                    class="rounded-full p-1 text-outline/70 transition-colors hover:text-primary-container"
                    type="button"
                    aria-label="Open Core Tonkotsu details on menu"
                    @click="goToCardapioItem('ramen-monolith-tonkotsu')"
                  >
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="group flex flex-col justify-between rounded-lg bg-surface-container p-6 transition-colors hover:bg-surface-container-high">
              <h4 class="font-headline font-bold text-on-surface">KINETIC MISO</h4>
              <div class="space-y-4">
                <div class="h-32 w-full overflow-hidden rounded-DEFAULT">
                  <img class="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" data-alt="macro shot of ramen toppings like bamboo shoots and marinated egg with soft cinematic bokeh" src="../assets/images/home-kinetic-miso.png">
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-headline font-bold text-primary-container">$19.50</span>
                  <button
                    class="rounded-full p-1 text-outline/70 transition-colors hover:text-primary-container"
                    type="button"
                    aria-label="Open Kinetic Miso details on menu"
                    @click="goToCardapioItem('ramen-thermal-miso')"
                  >
                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-8 rounded-lg border border-primary-container/25 bg-gradient-to-br from-surface-container-high to-surface-container-highest p-8 md:col-span-2" :class="limitedReleaseRemainingStock <= 0 ? 'opacity-45 saturate-0' : ''">
              <div class="space-y-4">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full border border-primary-container/45 bg-primary-container/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-container">
                    Limited Release
                  </span>
                  <span class="rounded-full border border-outline-variant/25 bg-surface-container px-3 py-1 font-headline text-[11px] font-bold tracking-wider text-on-surface">
                    Resets in {{ limitedReleaseCountdownLabel }}
                  </span>
                </div>
                <h3 class="font-headline text-2xl font-black tracking-tighter">
                  {{ limitedReleaseItem?.name ?? 'Loading release...' }}
                </h3>
                <p class="font-body text-xs leading-relaxed text-on-surface-variant">
                  Oferta randômica com 10% OFF por tempo limitado. Ao acabar o contador, outro item entra em promoção.
                </p>
                <div class="flex items-center gap-3">
                  <span class="font-headline text-sm font-bold text-on-surface-variant line-through">
                    {{ formatMoney(limitedReleaseOriginalPrice) }}
                  </span>
                  <span class="font-headline text-xl font-black text-primary-container">
                    {{ formatMoney(limitedReleaseDiscountedPrice) }}
                  </span>
                </div>
                <button
                  class="rounded-DEFAULT px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                  :class="isLimitedReleaseInCart
                    ? 'cursor-not-allowed bg-outline-variant/35 text-on-surface-variant'
                    : limitedReleaseRemainingStock <= 0
                      ? 'cursor-not-allowed bg-outline-variant/35 text-on-surface-variant'
                      : 'bg-on-surface text-surface-container-lowest hover:bg-primary-container'"
                  :disabled="isLimitedReleaseInCart || limitedReleaseRemainingStock <= 0"
                  @click="addLimitedReleaseToCart"
                >
                  {{ isLimitedReleaseInCart ? 'Limit Reached (1/1)' : limitedReleaseRemainingStock <= 0 ? 'Out Of Stock' : 'Add Limited Release' }}
                </button>
              </div>
              <div class="flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary-container/30 bg-surface-container-lowest">
                <img
                  v-if="limitedReleaseItem"
                  :src="limitedReleaseItem.image"
                  :alt="limitedReleaseItem.name"
                  class="h-full w-full object-cover"
                >
                <span v-else class="material-symbols-outlined text-4xl text-primary-container" data-weight="fill">science</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.tonal-shift {
  background: linear-gradient(180deg, rgba(19, 19, 19, 0) 0%, rgba(28, 27, 27, 1) 100%);
}

.story-forward-enter-active,
.story-forward-leave-active,
.story-backward-enter-active,
.story-backward-leave-active {
  transition: transform 1100ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.story-forward-leave-active,
.story-backward-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
}

.story-forward-enter-from {
  transform: translateX(115%);
}

.story-forward-leave-to {
  transform: translateX(-115%);
}

.story-backward-enter-from {
  transform: translateX(-115%);
}

.story-backward-leave-to {
  transform: translateX(115%);
}
</style>
