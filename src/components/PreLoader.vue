<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ready } from '../state'

const PATHS = [
  'atrium/',
  'src/tokens/colors.css',
  'src/tokens/themes.css',
  'src/components/RunTimeline.vue',
  'src/components/ApprovalDiff.vue',
  'src/composables/useAgentRun.ts',
  'stories/Button.stories.ts',
  'figma/Library.fig',
  'package.json',
]

const shown = ref(0)
const path = ref(PATHS[0])
const leaving = ref(false)
const gone = ref(false)

const finish = () => {
  document.documentElement.classList.add('is-ready')
  ready.value = true
}

onMounted(async () => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gone.value = true
    finish()
    return
  }
  document.documentElement.style.overflow = 'hidden'
  let target = 12
  let done = false
  const tasks = [
    document.fonts?.ready,
    import('../three/layers'),
    new Promise((r) => setTimeout(r, 1300)), // long enough to read, short enough not to annoy
  ]
  tasks.forEach((t) => Promise.resolve(t).then(() => (target += 88 / tasks.length)).catch(() => (target += 88 / tasks.length)))
  Promise.allSettled(tasks).then(() => (done = true))
  setTimeout(() => (done = true), 3500) // never hold the page longer than this

  const start = performance.now()
  let last = start
  const tick = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000)
    last = now
    const goal = done ? 100 : Math.min(target, 96)
    shown.value += (goal - shown.value) * (1 - Math.pow(0.004, dt))
    if (done && shown.value > 99.4) shown.value = 100
    path.value = PATHS[Math.min(PATHS.length - 1, Math.floor((shown.value / 100) * PATHS.length))]
    if (shown.value < 100 || now - start < 900) return requestAnimationFrame(tick)
    leaving.value = true
    document.documentElement.style.overflow = ''
    setTimeout(finish, 350) // hero starts while the panel is still sliding away
    setTimeout(() => (gone.value = true), 1200)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <div v-if="!gone" class="fixed inset-0 z-[100] flex flex-col justify-between bg-fg p-4 text-card transition-[transform,border-radius] duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)] md:p-10" :class="leaving ? '-translate-y-full rounded-b-[48px]' : ''" role="status" aria-live="polite">
    <div class="flex justify-between font-mono text-xs text-card/50">
      <span>Artsem D. · Design Engineer</span>
      <span>Portfolio 2026</span>
    </div>
    <div class="transition-opacity duration-500" :class="leaving ? 'opacity-0' : ''">
      <p class="font-mono text-xs text-card/60">
        <span class="text-accent">→</span> {{ path }}
      </p>
      <div class="mt-4 flex items-end justify-between gap-6">
        <p class="text-[clamp(4rem,16vw,13rem)] leading-[0.8] font-medium tracking-[-0.05em] tabular-nums">{{ Math.floor(shown).toString().padStart(3, '0') }}</p>
        <p class="serif mb-2 hidden text-[clamp(1.5rem,3vw,2.5rem)] text-card/70 md:block">assembling the interface…</p>
      </div>
      <div class="mt-6 h-px w-full bg-card/15">
        <div class="h-px bg-accent" :style="{ width: `${shown}%` }" />
      </div>
    </div>
  </div>
</template>
