<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import LogoMark from './LogoMark.vue'

const scrolled = ref(false)
const onScroll = () => (scrolled.value = scrollY > 24)
onMounted(() => {
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => removeEventListener('scroll', onScroll))

const links = [
  { label: 'Work', to: '/#work' },
  { label: 'Approach', to: '/#approach' },
  { label: 'About', to: '/#about' },
]
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,box-shadow] duration-500" :class="scrolled ? 'bg-bg/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : ''">
    <nav class="wrap flex h-16 items-center justify-between gap-6" aria-label="Main">
      <RouterLink to="/" class="text-fg" aria-label="Artsem D., home"><LogoMark /></RouterLink>
      <div class="flex items-center gap-7">
        <ul class="hidden items-center gap-7 text-[15px] text-dim md:flex">
          <li v-for="l in links" :key="l.to">
            <RouterLink :to="l.to" class="transition-colors hover:text-fg">{{ l.label }}</RouterLink>
          </li>
        </ul>
        <RouterLink to="/#contact" class="group inline-flex items-center gap-2 rounded-full bg-fg py-2 pr-2 pl-4 text-sm text-card transition-colors hover:bg-accent">
          Let’s talk
          <span class="grid size-6 place-items-center rounded-full bg-card/15 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true">
            <svg viewBox="0 0 16 16" class="size-3"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
          </span>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
