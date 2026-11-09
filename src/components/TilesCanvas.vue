<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement>()
let dispose: (() => void) | undefined

onMounted(async () => {
  try {
    const { createTiles } = await import('../three/tiles')
    dispose = createTiles(canvas.value!)
  } catch {
    /* no WebGL: the section keeps its plain background */
  }
})
onBeforeUnmount(() => dispose?.())
</script>

<template>
  <canvas ref="canvas" class="size-full" aria-hidden="true" />
</template>
