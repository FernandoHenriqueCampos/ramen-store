<script setup lang="ts">
import UniversalMenu from '@/components/UniversalMenu.vue'
</script>

<template>
  <div class="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-fixed">
    <UniversalMenu />

    <main>
      <section class="relative flex h-screen flex-col items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img class="h-full w-full object-cover opacity-60 brightness-75 grayscale-[20%]" data-alt="top-down dramatic photo of a steaming ramen bowl with rich dark broth and golden eggs on a matte black ceramic background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYL43phSUHgFBKiEyfYxplHZB6cI2jqbAeseJ4m73QVGAhN1TbzO5njhD3hUESwFPZO4Qf2BRT1Gt4cUE36AUw5LOe1g1s_4n6u5maEg5UjhXZF39L4ibnYRVDihdscvqO7ExFpeCGHXMyywyE90o6uQcX7Dg1DZkBwsGqpjxLEUqif1vbq8tJcv3I5FtmBhk215OTKBA2cFCZxlNkhsJUZNJUJYr7vvDMPBh198fgQrX42dK1CSzgEbqwMCvNQ2wW0pUxnY_a1iUw">
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
            <img class="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110" data-alt="close-up of artisan ramen noodles being lifted from a steaming pot with dramatic rim lighting and water droplets" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnVM4Ud0I5ZbeaagUopQ2tf7lOLdbPgFsrrUO_2rgiJ5ThoYkKIVModtufu61luH5xEvTmkUhvqFySTV0RLpLBsMRjKUQ9w2PI_TLZ_LeUq9tA1kwULNrJhzswDnJ8NmH4sWtURHVWuP2k99zbFNSDAoeVxaHFCxjYzipAIKxw-MCim7K3MZdjMc1VWNYdbdpqj7D-YAuk1ot2ksx4HlQgwcRnO1MpvA9fmYu1eSjIr5r1j_AX4PfTmU98iZr26IMnuEHtApRxseg7">
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
              <img class="absolute inset-0 h-full w-full object-cover opacity-40 transition-transform duration-500 group-hover:scale-105" data-alt="dramatic lighting on a black bowl of spicy tonkotsu ramen with vibrant red chili oil swirls and green scallions" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACg452f7xDe5EtFwZ6KIdRUfPGtWo5_NLOUtoYbfxm8VSnezq0bydo59Ik95_wNTW58LHEoXOz7-vd5i-qRjECLoHKGJ_OtuA434pWbrVVMi-tEM3SQY1Z6tscGRE4oY8B1nvovGVTYif2nFLDPA8WFV3Uv_Lqx0VV6vagvEg5-IvRunzup1hIgGFihRpD8PMsWf0-JMKcSoZ-5jKuI5G1-1DMjEe9o9-hNoDr_HF8tZKTSn2vLK4dtuNu9SU0DyMsIEEH-1kBkLRx">
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
                  <img class="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" data-alt="minimalist overhead shot of a classic ramen bowl with simple garnishes on a dark textured table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoe57P-C-YkIOX4fTmgsjJDAbsgHwlYUbRpPfwMmoSmvQn1b-bFKf3xt-5BuMfvQNDmWFJ1NwKgecgH-8es3CW9RPinj_DvWD2AxEmZUTZ2fpkhLBQ_ReuBcDdF6-EkEBrGqt8gd-ODj4IOMLaTzVvO4J5nqLgRRmbJsdPyx-5HNC33QVANg-fu0cvP9bHRIOvV0r02YpK57VsmWNyoeZOQm11tD5QOivL6dHjyJC0cvOb4Gf8bx0VyHz8eXRvfXL2i82BbyGL5-_b">
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
                  <img class="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" data-alt="macro shot of ramen toppings like bamboo shoots and marinated egg with soft cinematic bokeh" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRm-77a5Nu3kynNVzLdeF_r8fzvo5uaemsUgxq02Dm7-PubdWalCljbUVWOG0bg4_Q1pKdtW1OJnlHp8otJOX-e-bPMkW6WKvcdZFiKD1j3l8trk7SgeXNWihy_ScAXjm4dKXUOkZWCJR9yKpYOm7DH3ZdrBS__SxqsxehhD2RTsO-NkTNOWLFJvOkcjvg8GQv-7l7BD8G_ZuLL15YxFUabwSV6tu-qEfLuHwDOFncZu4ynuv35N1_IvR_foEihTyRYlzWRnCsHmJh">
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
