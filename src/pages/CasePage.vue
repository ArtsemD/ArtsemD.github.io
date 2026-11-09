<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { bySlug, projects } from '../data/projects'
import BrowserFrame from '../components/BrowserFrame.vue'
import NotFound from './NotFound.vue'

const props = defineProps<{ slug: string }>()
const project = computed(() => bySlug(props.slug))
const next = computed(() => {
  const i = projects.findIndex((p) => p.slug === props.slug)
  return projects[(i + 1) % projects.length]
})

watchEffect(() => {
  document.title = project.value ? `${project.value.title} · Artsem D.` : 'Not found · Artsem D.'
})
</script>

<template>
  <NotFound v-if="!project" />
  <article v-else>
    <header class="relative overflow-hidden border-b border-line">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,#15283a_0%,transparent_65%)]" />
      <div class="wrap relative pt-32 pb-16 md:pt-40 md:pb-20">
        <RouterLink to="/#work" class="label inline-flex items-center gap-2 transition-colors hover:text-fg">← All work</RouterLink>
        <p class="label mt-10 text-ice" v-reveal>{{ project.index }} · {{ project.kind }}</p>
        <h1 class="mt-4 max-w-[18ch] text-[clamp(2.4rem,6vw,5.25rem)] leading-[0.98] font-medium tracking-[-0.035em]" v-reveal="80">{{ project.tagline }}</h1>
        <dl class="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4" v-reveal="160">
          <div v-for="m in [
            ['Project', project.title],
            ['Role', project.role],
            ['Platforms', project.platforms],
            ['Years', project.years],
          ]" :key="m[0]" class="bg-ink p-5">
            <dt class="label">{{ m[0] }}</dt>
            <dd class="mt-1.5 text-sm">{{ m[1] }}</dd>
          </div>
        </dl>
      </div>
    </header>

    <section class="wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.4fr]">
      <div v-reveal>
        <p class="label mb-4">Overview</p>
        <ul class="flex flex-wrap gap-2">
          <li v-for="s in project.stack" :key="s" class="label rounded-full border border-line px-2.5 py-1 text-[11px]">{{ s }}</li>
        </ul>
        <div v-if="project.links" class="mt-8 flex flex-wrap gap-3">
          <a v-for="(l, i) in project.links" :key="l.href" :href="l.href" target="_blank" rel="noopener" class="rounded-full px-5 py-2.5 text-sm font-medium transition-colors" :class="i === 0 ? 'bg-fg text-ink hover:opacity-85' : 'border border-line-2 hover:border-fg'">{{ l.label }} ↗</a>
        </div>
      </div>
      <div v-reveal="100">
        <p class="text-[clamp(1.25rem,2vw,1.6rem)] leading-snug tracking-tight">{{ project.summary }}</p>
        <p class="mt-6 flex gap-3 rounded-xl border border-line bg-panel p-4 text-sm text-dim">
          <span class="font-mono text-ice">NDA</span>
          {{ project.note }}
        </p>
      </div>
    </section>

    <div class="wrap" v-reveal>
      <BrowserFrame :src="project.cover.src" :bar="project.cover.bar" :alt="`${project.title}, main screen`" eager />
    </div>

    <section class="wrap py-20 md:py-28" aria-labelledby="points-title">
      <h2 id="points-title" class="label mb-8">What I designed and built</h2>
      <ol class="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
        <li v-for="(pt, i) in project.points" :key="pt.title" class="bg-ink p-7 md:p-9" v-reveal="(i % 2) * 80">
          <span class="font-mono text-sm text-ice">0{{ i + 1 }}</span>
          <h3 class="mt-4 text-xl font-medium tracking-tight md:text-2xl">{{ pt.title }}</h3>
          <p class="mt-3 text-dim">{{ pt.text }}</p>
        </li>
      </ol>
    </section>

    <section v-if="project.shots.length" class="wrap space-y-16 pb-20 md:pb-28" aria-label="Screens">
      <figure v-for="s in project.shots" :key="s.src" v-reveal>
        <BrowserFrame :src="s.src" :bar="s.bar" :alt="s.caption ?? project.title" />
        <figcaption v-if="s.caption" class="label mt-4">{{ s.caption }}</figcaption>
      </figure>
    </section>

    <section v-if="project.hood" class="border-y border-line bg-ink-2" aria-labelledby="hood-title">
      <div class="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.3fr]">
        <div v-reveal>
          <p class="label mb-4">Under the hood</p>
          <h2 id="hood-title" class="text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.03em]">{{ project.hood.title }}</h2>
          <p class="mt-6 max-w-md text-dim">{{ project.hood.text }}</p>
        </div>
        <figure v-if="project.hood.code" class="overflow-hidden rounded-xl border border-line bg-ink" v-reveal="100">
          <figcaption class="label border-b border-line px-4 py-3 text-[11px] text-faint">{{ project.hood.file }}</figcaption>
          <pre class="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-fg/85"><code>{{ project.hood.code }}</code></pre>
        </figure>
      </div>
    </section>

    <RouterLink :to="`/work/${next.slug}`" class="group block border-b border-line">
      <div class="wrap flex items-end justify-between gap-6 py-20 md:py-28">
        <div>
          <p class="label mb-4">Next project</p>
          <p class="text-[clamp(2rem,5vw,4.5rem)] leading-none font-medium tracking-[-0.035em] transition-colors group-hover:text-ice">{{ next.title }}</p>
        </div>
        <span class="grid size-14 shrink-0 place-items-center rounded-full border border-line-2 transition-all duration-500 group-hover:rotate-45 group-hover:bg-fg group-hover:text-ink" aria-hidden="true">
          <svg viewBox="0 0 16 16" class="size-5"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
        </span>
      </div>
    </RouterLink>
  </article>
</template>
