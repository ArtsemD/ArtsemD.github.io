<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ value: number; suffix?: string }>()
const el = ref<HTMLElement>()
const shown = ref(0)
let io: IntersectionObserver | undefined

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    shown.value = props.value
    return
  }
  io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return
    io?.disconnect()
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 1200)
      shown.value = Math.round(props.value * (1 - Math.pow(1 - t, 3)))
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })
  io.observe(el.value!)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <span ref="el" class="tabular-nums">{{ shown }}{{ suffix }}</span>
</template>
