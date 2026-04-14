<script setup lang="ts">
import UniversalMenu from '@/components/UniversalMenu.vue'
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
          <div class="group relative overflow-hidden bg-surface-container-low md:col-span-8">
            <div class="aspect-[16/9] w-full overflow-hidden">
              <img alt="Signature Tonkotsu" class="h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Close-up of premium tonkotsu ramen with creamy broth, soft-boiled egg, and seared pork belly on a dark ceramic background with moody lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtB1HJmldUjRzMDCYcyFOQiz286YcCkcv70ujKS1DY7idE9q7dHp0kMSPRyxj9WS3Ml6OqVPvo3rG4SU3_FemPlcX73IpWKVAQmflwnBzMOiMjV2Gr6fvxFBWmzbDy2rjYY6JZJFlXohUkBREWgywXZKOxQNoS9B9Nq4nlTEbxg36y3_kgQcJTsbdyYWXvh9Fdvf1zGPSKsAA5FGwcFprKq9WNobfUl4sybFGxd7Dro_BILdyem3MzhIwr9OEzADZO_E3V7VNAYC-T">
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
              </div>
              <div class="mt-8 flex gap-3">
                <span class="bg-surface-container-highest px-3 py-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Signature</span>
                <span class="bg-surface-container-highest px-3 py-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Intense Umami</span>
              </div>
            </div>
          </div>

          <div class="group flex flex-col bg-surface-container md:col-span-4">
            <div class="aspect-square w-full overflow-hidden">
              <img alt="Spicy Miso" class="h-full w-full object-cover grayscale-[60%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Overhead shot of spicy red miso ramen with chili oil droplets and green scallions in a black bowl against obsidian background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuA3W86iN724lapyqX4zJbwaHwVATapoxcZ3HOBG59260p5Ta_16O5bKnnwAaPs-znZxhvAfqIjpRS769w4lqtQtLp8sOz8dKSTEu85PN7VFIgsbZENv5tqc2KOy-VUlW05pHF8dOAYRtTYCl8pLxNAclKvaUvlg9jiqGT58iz7ufh0AHeyugDtO42JGrZuDZ1a26u1gubiGN5ADuuKfk5bG3gHigQOSkEp7KXv0LNmiTj7fAnv_lPnb35J5OoNDRR0R_av3OLNXfU">
            </div>
            <div class="flex-grow p-6">
              <div class="mb-2 flex items-start justify-between">
                <h3 class="font-headline text-xl font-bold uppercase">Thermal Miso</h3>
                <span class="font-headline font-bold text-primary-container">$21.0</span>
              </div>
              <p class="mb-2 text-xs font-light leading-relaxed text-on-surface-variant">
                Fermented chili paste, charred corn, and high-tensile rye noodles. A thermal gradient of heat.
              </p>
            </div>
          </div>

          <div class="group flex flex-col bg-surface-container md:col-span-4">
            <div class="aspect-square w-full overflow-hidden">
              <img alt="Vegan Ramen" class="h-full w-full object-cover grayscale-[60%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Minimalist vegan ramen with clear kombu broth, enoki mushrooms, and tofu on a dark textured table with focused top light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb2S_6f0bOcgNbqzDgrT7zWwtHJbUndO_PjFApeMVe3pzA9DXxKJA7IBQhvDMGoAZuyxz-YjrS2qW4b5z82CtOuyoMtAHETlDDVCYV9myHvazLdi27tm5KnPORmWQsnl6LErAOiFuyoN4LwDQGQFpbFQ_jfP_lVdvn4AnCVa6-cTi5bl3E5JWtiO79eiF1MkaMkxf3_GAgyreA57c7JTQVfO72YGLi-4V-GDXKiIXISgm9-LkyXSi_Njw4045FZkw7fBxkcKuNbK5T">
            </div>
            <div class="flex-grow p-6">
              <div class="mb-2 flex items-start justify-between">
                <h3 class="font-headline text-xl font-bold uppercase">Synthetic Clear</h3>
                <span class="font-headline font-bold text-primary-container">$19.0</span>
              </div>
              <p class="mb-2 text-xs font-light leading-relaxed text-on-surface-variant">
                Double-filtered kombu and shiitake broth. Hand-pulled wheat noodles. Minimalist aesthetic.
              </p>
            </div>
          </div>

          <div class="group relative flex flex-col overflow-hidden bg-surface-container-low md:col-span-8 md:flex-row">
            <div class="aspect-square overflow-hidden md:w-1/2 md:aspect-auto">
              <img alt="Black Garlic Ramen" class="h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" data-alt="Black garlic ramen with dark ink-like broth and vivid toppings, high contrast photography with deep shadows and sharp highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEHu6ZEpESFBgsXU3pRWksSsEV81igZaWo7WEApYEW8MFIY_8CmgHCfwQ9xUR0oVvjI1h9cd4vBRNesWP17HLHAfTh8I6feegtulkQf2w0seKmZ6bT4OxXTO9t3XZY0m7cqmGlXB9LXj1hxqZRlgU9dMsCQIQoxFe9bkUM_gZWkhtZK86OQZBH2WGNIr1vplpz-m5L9NEuxw4f3-tr_MV8jTevfmaSX-VY7xVMoSUHqTh77VdBmGPcVMP0OVJceVobpaUhe8cdLq3f">
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
              <img alt="Gyoza" class="h-full w-full object-cover grayscale-[80%] transition-all duration-500 group-hover:grayscale-0" data-alt="Pan-seared gyoza dumplings with perfectly crispy bottoms and delicate steam, on a dark ceramic plate" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7sdYm2tV7OzuamV_uTj594Iy6IHiVNTRApnhMI36SQKzv66rwnHJu4jLGxZg0AP_Qyh_WqhyjknFqLiphhqzEogQ5d2jJYD_pIqs3mj7X25_f8baij0Fx278nJxP_8CNuwbYuHWTMcZ123cX0OuxbXYbJpg8TQ8Nh0OYGjGUQVXjZx51nsxHLHmnbtX-LkovdE2NPxXm9cKFRQxdfITU9_0vaXoir843mxvSUY5s-G3X2swz4ZHNDd1LyJ51rZry0s50AUjrfgbx4">
            </div>
            <div>
              <h3 class="font-headline text-lg font-bold uppercase">Seared Gyoza</h3>
              <p class="mb-2 text-xs font-light text-on-surface-variant">Pork &amp; Ginger reduction.</p>
              <span class="font-headline font-bold text-primary-container">$9.0</span>
            </div>
          </div>
          <div class="group flex items-start space-x-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden bg-surface-container">
              <img alt="Karaage" class="h-full w-full object-cover grayscale-[80%] transition-all duration-500 group-hover:grayscale-0" data-alt="Golden fried karaage chicken pieces with yuzu mayo on a dark minimalist background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXX4iwrbVYHU1zl6QoPLQu5fEkeCdNp4jGQiV4rqFswLMYzBcRgHaUgFRIunF2YbSewtHc-vpAl9lX9bvtmtcgel-1hyVIG30eUCp50VTFEScZFZlrC8qdwy66ChBKQSArUtan-qIgNBZb9fwpnrOGPVq_v6T5ToUU2iyoapdKMUr7VJpvXGQOmDdQDfQ-DGjByXDYBk20Oix_G0OGmoj--CoNrKoR63-CjJr-RGNax3nRnXpw_ugZ3jFG0SqqDAVb2gaWICMQp6Pl">
            </div>
            <div>
              <h3 class="font-headline text-lg font-bold uppercase">Atomic Karaage</h3>
              <p class="mb-2 text-xs font-light text-on-surface-variant">Triple-fried, yuzu salt.</p>
              <span class="font-headline font-bold text-primary-container">$12.0</span>
            </div>
          </div>
          <div class="group flex items-start space-x-6">
            <div class="h-24 w-24 flex-shrink-0 overflow-hidden bg-surface-container">
              <img alt="Edamame" class="h-full w-full object-cover grayscale-[80%] transition-all duration-500 group-hover:grayscale-0" data-alt="Fresh green edamame pods with sea salt flakes on a dark volcanic stone plate" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW1UEgX_NLBAmr9Al5QJjyB2B5cW0NvVMrxjLEK59_fHRJjHHgFIYi8Sw1NvK5AVvPERWsw78YGIAWJ08KpPTd3hxjYPwe0HrSEsVnF1ljBpi0j4Z8-oEsMDiBSoz0Y1oQsUttvbj1Ch67vTubS3rLIwKZYn7jLbt415u08gVRmalE259pZ0dAvI19DC88U9UIr835cU4qo0hTpv_yvx6qtbQrdVHEDEm6evVOi41k1daBEs3zN6hD_Bq7nc0PCJrL2P8UNqW_ifwz">
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
          <img alt="Chef Signature" class="h-full w-full object-cover opacity-40 grayscale" data-alt="Close-up of chef's hands carefully placing toppings on a bowl of ramen with steam rising in a dark industrial kitchen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-YG-cB0qCtI97SKjFDYhmhY4J9ATGpuhs42dd6PIyjA3wFp-KNtbJZ2a0fXWe76lUS9yQBwpukbM6HCBRPAm9JnWGvSlQ_oILAEyZf6dg14n0mcTY0R7URN8btNLfl6iNU3KyRjRkMzuz6bBVALGJfataCjTA8YrB0eRtmS9FsLyDsHr_VGBJNubPr1k7X8GgPWIcKXWLAzgYo66ZgvhP370tbK-ydJ7LQEWgMWSv35mwmJBgnE8_Zb0O9xoHXVBZRZd-6pFbImwY">
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
