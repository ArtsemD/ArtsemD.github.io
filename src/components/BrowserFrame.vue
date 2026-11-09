<script setup lang="ts">
defineProps<{ src: string; bar: string; alt: string; eager?: boolean }>()
</script>

<template>
  <figure class="overflow-hidden rounded-xl border border-line bg-panel shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8)]">
    <div class="flex h-8 items-center gap-3 border-b border-line px-3">
      <span class="flex gap-1.5" aria-hidden="true"><i v-for="n in 3" :key="n" class="size-2 rounded-full bg-white/15" /></span>
      <span class="label truncate text-[11px] text-faint">{{ bar }}</span>
    </div>
    <img :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" class="block w-full" />
  </figure>
</template>
