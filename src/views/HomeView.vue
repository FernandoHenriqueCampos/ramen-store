<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import UniversalMenu from '@/components/UniversalMenu.vue'

const heroSection = ref<HTMLElement | null>(null)
const heroOffsetY = ref(0)

const heroParallaxStyle = computed(() => ({
  transform: `translate3d(0, ${heroOffsetY.value}px, 0) scale(1.08)`,
}))

const updateHeroParallax = () => {
  if (!heroSection.value) return

  const sectionTop = heroSection.value.getBoundingClientRect().top
  heroOffsetY.value = Math.round(sectionTop * -0.2)
}

onMounted(() => {
  updateHeroParallax()
  window.addEventListener('scroll', updateHeroParallax, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateHeroParallax)
})
</script>

<template>
  <div class="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-fixed">
    <UniversalMenu />

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

      <section class="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-8 py-32 md:grid-cols-12">
        <div class="space-y-12 md:col-span-7">
          <div class="space-y-4">
            <span class="font-label text-xs font-bold uppercase tracking-widest text-primary-container">The Philosophy</span>
            <h2 class="font-headline text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl">CRAFTED WITH<br>PRECISION.</h2>
          </div>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div class="space-y-4">
              <h3 class="font-headline text-xl font-bold text-on-surface">Thermal Control</h3>
              <p class="font-body leading-relaxed text-on-surface-variant">Our broth is calibrated at a constant 92&deg;C for 36 hours. Every gram of collagen is extracted through rigorous temperature cycles to ensure peak molecular density.</p>
            </div>
            <div class="space-y-4">
              <h3 class="font-headline text-xl font-bold text-on-surface">Noodle Geometry</h3>
              <p class="font-body leading-relaxed text-on-surface-variant">Designed with specific hydration levels to maintain tensile strength. The surface area is calculated to maximize broth adherence for a perfect flavor payload.</p>
            </div>
          </div>
        </div>
        <div class="md:col-span-5 md:mt-24">
          <div class="group relative aspect-square overflow-hidden rounded-lg bg-surface-container shadow-2xl">
            <img class="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110" data-alt="close-up of artisan ramen noodles being lifted from a steaming pot with dramatic rim lighting and water droplets" src="../assets/images/home-philosophy-noodles.png">
            <div class="absolute inset-0 bg-primary-container/10 mix-blend-overlay"></div>
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
            <a class="border-b border-outline-variant/40 pb-1 text-xs font-bold uppercase tracking-widest transition-colors hover:text-primary-container" href="#">View All Specs</a>
          </div>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div class="group relative flex min-h-[500px] flex-col justify-between overflow-hidden rounded-lg bg-surface-container p-8 md:col-span-2 md:row-span-2">
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
                    <button class="rounded-full border border-outline-variant/40 p-2 transition-colors hover:bg-primary-container hover:text-on-primary-fixed">
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
                  <span class="material-symbols-outlined text-sm opacity-40">arrow_forward</span>
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
                  <span class="material-symbols-outlined text-sm opacity-40">arrow_forward</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-8 rounded-lg border border-outline-variant/10 bg-gradient-to-br from-surface-container-high to-surface-container-highest p-8 md:col-span-2">
              <div class="space-y-4">
                <h3 class="font-headline text-2xl font-black tracking-tighter">CHEF'S SIGNATURE OVERLAY</h3>
                <p class="font-body text-xs leading-relaxed text-on-surface-variant">A rotating limited release exploring experimental flavor architectures. Available only during twilight hours.</p>
                <button class="rounded-DEFAULT bg-on-surface px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-surface-container-lowest transition-colors hover:bg-primary-container">Explore R&amp;D</button>
              </div>
              <div class="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full border border-primary-container/30 bg-surface-container-lowest">
                <span class="material-symbols-outlined text-4xl text-primary-container" data-weight="fill">science</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="w-full border-t border-[#5d4038]/20 bg-[#0e0e0e]">
      <div class="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-12 py-16 md:flex-row">
        <div class="flex flex-col gap-4">
          <div class="font-headline text-lg font-bold text-[#e5e2e1]">RAMEN MONOLITH</div>
          <div class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#ff5625]">&copy; 2024 RAMEN MONOLITH. PRECISION CRAFTED.</div>
        </div>
        <div class="flex gap-8">
          <a class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#e5e2e1]/60 transition-all duration-300 ease-in-out hover:text-[#ff5625]" href="#">Location</a>
          <a class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#e5e2e1]/60 transition-all duration-300 ease-in-out hover:text-[#ff5625]" href="#">Instagram</a>
          <a class="font-['Inter'] text-xs uppercase tracking-[0.1em] text-[#e5e2e1]/60 transition-all duration-300 ease-in-out hover:text-[#ff5625]" href="#">Hours</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.tonal-shift {
  background: linear-gradient(180deg, rgba(19, 19, 19, 0) 0%, rgba(28, 27, 27, 1) 100%);
}
</style>
