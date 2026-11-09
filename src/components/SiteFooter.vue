<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import LogoMark from './LogoMark.vue'

const time = ref('')
const tick = () => (time.value = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: profile.timeZone }).format(new Date()))
let timer = 0
onMounted(() => {
  tick()
  timer = window.setInterval(tick, 20_000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <footer class="bg-fg text-card">
    <div class="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <LogoMark />
        <p class="mt-5 max-w-xs text-sm text-card/60">{{ profile.role }} at {{ profile.company }}. Product design, design systems and the code behind them.</p>
      </div>
      <nav aria-label="Work">
        <p class="label mb-4 text-card/40">Work</p>
        <ul class="space-y-2 text-sm">
          <li v-for="p in projects" :key="p.slug">
            <RouterLink :to="`/work/${p.slug}`" class="text-card/70 transition-colors hover:text-accent">{{ p.title }}</RouterLink>
          </li>
        </ul>
      </nav>
      <nav aria-label="Elsewhere">
        <p class="label mb-4 text-card/40">Elsewhere</p>
        <ul class="space-y-2 text-sm">
          <li v-for="l in profile.links" :key="l.href">
            <a :href="l.href" target="_blank" rel="noopener" class="text-card/70 transition-colors hover:text-accent">{{ l.label }} ↗</a>
          </li>
        </ul>
      </nav>
      <div>
        <p class="label mb-4 text-card/40">Local time</p>
        <p class="font-mono text-sm text-card/70">{{ time }} · {{ profile.location }}</p>
      </div>
    </div>
    <div class="wrap flex flex-wrap justify-between gap-4 border-t border-card/10 py-6">
      <span class="label text-card/40">© {{ new Date().getFullYear() }} {{ profile.name }}</span>
      <span class="label text-card/40">Built with Vue 3, Three.js and Tailwind</span>
    </div>
  </footer>
</template>
