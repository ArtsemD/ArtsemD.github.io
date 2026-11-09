<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ready } from '../state'

const canvas = ref<HTMLCanvasElement>()
const failed = ref(false)
let api: { grow(): void; dispose(): void } | undefined

onMounted(async () => {
  try {
    const { createTree } = await import('../three/tree')
    api = createTree(canvas.value!)
    if (ready.value) api.grow()
  } catch {
    failed.value = true
  }
})
watch(ready, (r) => r && setTimeout(() => api?.grow(), 250))
onBeforeUnmount(() => api?.dispose())
</script>

<template>
  <div class="relative size-full">
    <canvas v-if="!failed" ref="canvas" class="size-full" aria-label="A project's file structure growing as a 3D tree" role="img" />
    <p class="label absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-faint">tree ./atrium<span class="hidden [@media(hover:hover)]:inline"> · hover a file</span><span class="[@media(hover:hover)]:hidden"> · tap a file</span></p>
  </div>
</template>
