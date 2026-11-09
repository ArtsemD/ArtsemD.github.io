<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ready } from '../state'
import type { LayerPoint } from '../three/layers'

const LABELS = [
  { name: 'Tokens', note: 'color · type · space' },
  { name: 'Components', note: 'Vue + Storybook' },
  { name: 'Screen', note: 'shipped to users' },
]
const LABEL_W = 150

const canvas = ref<HTMLCanvasElement>()
const points = ref<LayerPoint[]>([])
const failed = ref(false)
let api: { start(): void; dispose(): void } | undefined

onMounted(async () => {
  try {
    const { createLayers } = await import('../three/layers')
    api = createLayers(canvas.value!, (p) => (points.value = p))
    if (ready.value) api.start()
  } catch {
    failed.value = true
  }
})
watch(ready, (r) => r && setTimeout(() => api?.start(), 200))
onBeforeUnmount(() => api?.dispose())
</script>

<template>
  <div class="relative size-full">
    <canvas v-if="!failed" ref="canvas" class="size-full" role="img" aria-label="An interface taken apart into three layers: design tokens, components and the finished screen" />
    <div class="pointer-events-none absolute inset-0 max-[519px]:hidden" aria-hidden="true">
      <div v-for="(p, i) in points" :key="i" class="absolute left-0 flex items-center" :style="{ top: `${p.y}px`, opacity: p.visible, transform: 'translateY(-50%)' }">
        <div class="shrink-0" :style="{ width: `${LABEL_W}px` }">
          <p class="text-[15px] leading-tight font-medium">
            <span class="serif mr-1 text-accent">{{ i + 1 }}</span>
            {{ LABELS[i].name }}
          </p>
          <p class="label hidden text-[11px] sm:block">{{ LABELS[i].note }}</p>
        </div>
        <span v-if="p.x > LABEL_W + 24" class="h-px border-t border-dashed border-fg/35" :style="{ width: `${p.x - LABEL_W - 8}px` }" />
        <span v-if="p.x > LABEL_W + 24" class="size-2 -translate-x-1 rounded-full bg-accent" />
      </div>
    </div>
    <p class="label absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap min-[520px]:hidden" aria-hidden="true">
      tokens <span class="text-accent">→</span> components <span class="text-accent">→</span> screen
    </p>
  </div>
</template>
