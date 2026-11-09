<script setup lang="ts">
import type { Project } from '../data/projects'

defineProps<{ project: Project; large?: boolean }>()
</script>

<template>
  <RouterLink :to="`/work/${project.slug}`" class="group block">
    <div class="relative overflow-hidden rounded-2xl border border-line bg-[radial-gradient(120%_90%_at_70%_0%,#16212c_0%,#0b0f14_55%)]" :class="large ? 'aspect-[16/10] md:aspect-[16/8]' : 'aspect-[16/11]'">
      <div class="absolute inset-x-[6%] top-14 md:top-[9%] md:inset-x-[7%] overflow-hidden rounded-t-lg border border-b-0 border-line-2 shadow-[0_40px_90px_-20px_rgb(0_0_0/0.9)] transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:scale-[1.015]">
        <div class="flex h-6 items-center gap-1.5 border-b border-line bg-panel px-2.5" aria-hidden="true">
          <i v-for="n in 3" :key="n" class="size-1.5 rounded-full bg-white/15" />
          <span class="ml-2 truncate font-mono text-[10px] text-faint">{{ project.cover.bar }}</span>
        </div>
        <img :src="project.cover.src" :alt="`${project.title}, ${project.kind.toLowerCase()} screen`" loading="lazy" decoding="async" class="block w-full" />
      </div>
      <span class="label absolute top-4 left-4 rounded-full border border-line bg-ink/60 px-2.5 py-1 text-[11px] backdrop-blur">{{ project.index }}</span>
      <span class="absolute top-4 right-4 grid size-9 place-items-center rounded-full border border-line bg-ink/60 text-fg backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:border-fg group-hover:bg-fg group-hover:text-ink" aria-hidden="true">
        <svg viewBox="0 0 16 16" class="size-3.5"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
      </span>
    </div>
    <div class="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
      <h3 class="text-xl font-medium tracking-tight md:text-2xl">{{ project.title }}</h3>
      <span class="label">{{ project.years }}</span>
    </div>
    <p class="mt-1.5 text-dim">{{ project.tagline }}</p>
    <ul class="mt-4 flex flex-wrap gap-2">
      <li v-for="t in project.tags" :key="t" class="label rounded-full border border-line px-2.5 py-1 text-[11px]">{{ t }}</li>
    </ul>
  </RouterLink>
</template>
