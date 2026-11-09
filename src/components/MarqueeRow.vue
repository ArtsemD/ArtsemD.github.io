<script setup lang="ts">
defineProps<{ items: string[]; reverse?: boolean; duration?: number }>()
</script>

<template>
  <div class="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
    <div class="marquee-track flex w-max" :class="{ rev: reverse }" :style="{ '--dur': `${duration ?? 45}s` }">
      <ul v-for="n in 2" :key="n" class="flex shrink-0 items-center" :aria-hidden="n === 2 ? 'true' : undefined">
        <li v-for="item in items" :key="item" class="flex items-center gap-6 pr-6 text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium tracking-tight text-fg/85">
          {{ item }}
          <span class="size-1.5 rounded-full bg-ice/60" />
        </li>
      </ul>
    </div>
  </div>
</template>
