<script setup lang="ts">
defineProps<{ src: string; bar: string; alt: string; eager?: boolean }>()
</script>

<template>
  <figure class="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_40px_80px_-40px_rgb(23_21_15/0.35)]">
    <div class="flex h-9 items-center gap-3 border-b border-line px-4">
      <span class="flex gap-1.5" aria-hidden="true"><i v-for="n in 3" :key="n" class="size-2.5 rounded-full bg-fg/10" /></span>
      <span class="label truncate text-[11px] text-faint">{{ bar }}</span>
    </div>
    <img :src="src" :alt="alt" :loading="eager ? 'eager' : 'lazy'" decoding="async" class="block w-full" />
  </figure>
</template>
