<script setup lang="ts">
import type { Project } from '../data/projects'

defineProps<{ project: Project; flip?: boolean }>()
</script>

<template>
  <RouterLink :to="`/work/${project.slug}`" class="group grid items-center gap-8 md:grid-cols-12 md:gap-10">
    <div class="md:col-span-7" :class="flip ? 'md:order-2' : ''">
      <div v-tilt="5" class="relative aspect-[16/11] overflow-hidden rounded-[22px] bg-bg-2">
        <div class="absolute inset-x-[7%] top-14 md:top-[11%] overflow-hidden rounded-t-xl border border-b-0 border-line-2 bg-card shadow-[0_40px_70px_-30px_rgb(23_21_15/0.45)] transition-transform duration-700 ease-out-soft group-hover:-translate-y-3">
          <div class="flex h-6 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
            <i v-for="n in 3" :key="n" class="size-1.5 rounded-full bg-fg/15" />
            <span class="ml-2 truncate font-mono text-[10px] text-faint">{{ project.cover.bar }}</span>
          </div>
          <img :src="project.cover.src" :alt="`${project.title}, ${project.kind.toLowerCase()} screen`" loading="lazy" decoding="async" class="block w-full" />
        </div>
        <span class="absolute top-4 left-4 rounded-full bg-card/85 px-2.5 py-1 font-mono text-[11px] text-dim backdrop-blur">{{ project.kind }}</span>
      </div>
    </div>
    <div class="md:col-span-5" :class="flip ? 'md:order-1' : ''">
      <p class="serif text-[clamp(3.5rem,7vw,6.5rem)] leading-none text-accent">{{ project.index }}</p>
      <h3 class="mt-4 text-[clamp(1.75rem,3vw,2.6rem)] leading-[1.05] font-medium tracking-[-0.025em]">{{ project.title }}</h3>
      <p class="mt-3 max-w-md text-lg text-dim">{{ project.tagline }}</p>
      <div class="mt-6 flex flex-wrap items-center gap-2">
        <span v-for="t in project.tags" :key="t" class="rounded-full border border-line-2 px-3 py-1 text-[13px] text-fg-2">{{ t }}</span>
        <span class="label ml-1">{{ project.years }}</span>
      </div>
      <span class="mt-8 inline-flex items-center gap-3 text-[15px] font-medium">
        <span class="relative">Read the case<span class="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-fg transition-transform duration-500 group-hover:scale-x-100" /></span>
        <span class="grid size-9 place-items-center rounded-full bg-fg text-card transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent" aria-hidden="true">
          <svg viewBox="0 0 16 16" class="size-3.5"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.6" /></svg>
        </span>
      </span>
    </div>
  </RouterLink>
</template>
