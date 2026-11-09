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
  <header class="fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500" :class="scrolled ? 'border-b border-line bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'">
    <nav class="wrap grid h-16 grid-cols-[1fr_auto_1fr] items-center" aria-label="Main">
      <ul class="hidden items-center gap-6 text-sm text-dim md:flex">
        <li v-for="l in links" :key="l.to">
          <RouterLink :to="l.to" class="transition-colors hover:text-fg">{{ l.label }}</RouterLink>
        </li>
      </ul>
      <RouterLink to="/" class="col-start-1 justify-self-start text-fg md:col-start-2 md:justify-self-center" aria-label="Artsem D., home">
        <LogoMark />
      </RouterLink>
      <div class="col-start-3 flex items-center justify-end gap-4">
        <span class="label hidden lg:inline">Open to new projects</span>
        <RouterLink to="/#contact" class="rounded-full border border-line-2 px-4 py-2 text-sm text-fg transition-colors hover:border-fg hover:bg-fg hover:text-ink">Let’s talk</RouterLink>
      </div>
    </nav>
  </header>
</template>
