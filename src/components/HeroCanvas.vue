<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { HeroReadout } from '../three/hero'

const canvas = ref<HTMLCanvasElement>()
const readout = ref<HeroReadout>({ pointer: [0.5, 0.5], morph: 0, fps: 60 })
const failed = ref(false)
let dispose: (() => void) | undefined

onMounted(async () => {
  try {
    const { createHero } = await import('../three/hero')
    dispose = createHero(canvas.value!, (r) => (readout.value = r))
  } catch {
    failed.value = true // no WebGL: the CSS gradient below stays as the background
  }
})
onBeforeUnmount(() => dispose?.())

const f = (n: number) => n.toFixed(4)
</script>

<template>
  <div class="absolute inset-0 bg-[radial-gradient(60%_60%_at_66%_50%,#1a2a38_0%,#06080b_70%)]">
    <canvas v-show="!failed" ref="canvas" class="size-full" aria-hidden="true" />
    <div class="label pointer-events-none absolute right-4 bottom-6 hidden text-right text-[11px] leading-5 text-faint md:right-10 md:block" aria-hidden="true">
      <div>[pointer] {{ f(readout.pointer[0]) }} {{ f(readout.pointer[1]) }}</div>
      <div>[radius] {{ f(readout.morph) }}</div>
      <div>{{ readout.fps }} fps</div>
    </div>
  </div>
</template>
