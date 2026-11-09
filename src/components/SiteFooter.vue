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
  <footer class="border-t border-line">
    <div class="wrap grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <LogoMark class="text-fg" />
        <p class="mt-5 max-w-xs text-sm text-dim">{{ profile.role }} at {{ profile.company }}. Product design, design systems and the code behind them.</p>
      </div>
      <nav aria-label="Work">
        <p class="label mb-4 text-faint">Work</p>
        <ul class="space-y-2 text-sm">
          <li v-for="p in projects" :key="p.slug">
            <RouterLink :to="`/work/${p.slug}`" class="text-dim transition-colors hover:text-fg">{{ p.title }}</RouterLink>
          </li>
        </ul>
      </nav>
      <nav aria-label="Elsewhere">
        <p class="label mb-4 text-faint">Elsewhere</p>
        <ul class="space-y-2 text-sm">
          <li v-if="profile.email"><a :href="`mailto:${profile.email}`" class="text-dim transition-colors hover:text-fg">Email</a></li>
          <li v-for="l in profile.links" :key="l.href">
            <a :href="l.href" target="_blank" rel="noopener" class="text-dim transition-colors hover:text-fg">{{ l.label }} ↗</a>
          </li>
        </ul>
      </nav>
      <div>
        <p class="label mb-4 text-faint">Local time</p>
        <p class="font-mono text-sm text-dim">{{ time }} · {{ profile.location }}</p>
      </div>
    </div>
    <div class="wrap flex flex-wrap justify-between gap-4 border-t border-line py-6">
      <span class="label text-faint">© {{ new Date().getFullYear() }} {{ profile.name }}</span>
      <span class="label text-faint">Built with Vue 3, Three.js and Tailwind</span>
    </div>
  </footer>
</template>
