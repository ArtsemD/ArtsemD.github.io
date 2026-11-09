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
        <ul class="flex items-center gap-5 text-[15px] text-dim md:gap-7">
          <li v-for="l in links" :key="l.to">
            <RouterLink :to="l.to" class="transition-colors hover:text-fg">{{ l.label }}</RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
