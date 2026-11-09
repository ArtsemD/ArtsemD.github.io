<script setup lang="ts">
import { approach, capabilities, profile, stats } from '../data/profile'
import { projects } from '../data/projects'
import AvatarPhoto from '../components/AvatarPhoto.vue'
import CountUp from '../components/CountUp.vue'
import ProjectCard from '../components/ProjectCard.vue'
import TilesCanvas from '../components/TilesCanvas.vue'
import TreeCanvas from '../components/TreeCanvas.vue'

const demo = profile.links.find((l) => l.label === 'Live demo')!
const github = profile.links.find((l) => l.label === 'GitHub')!
</script>

<template>
  <!-- Hero -->
  <section class="wrap grid min-h-[100svh] items-center gap-6 pt-24 pb-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pt-16" aria-labelledby="hero-title">
    <div>
      <div class="intro flex items-center gap-3">
        <AvatarPhoto />
        <p class="text-[15px] leading-tight">
          {{ profile.name }}<br />
          <span class="text-dim">{{ profile.role }} at {{ profile.company }}</span>
        </p>
      </div>
      <h1 id="hero-title" class="intro mt-8 text-[clamp(2.9rem,6.6vw,6.4rem)] leading-[0.95] font-medium tracking-[-0.045em] [--d:120ms]">
        Designing products, <span class="serif tracking-[-0.02em] text-accent">and shipping</span> the code.
      </h1>
      <p class="intro mt-7 max-w-[34rem] text-lg text-dim [--d:240ms]">{{ profile.bio }}</p>
      <div class="intro mt-9 flex flex-wrap items-center gap-3 [--d:340ms]">
        <a href="#work" class="rounded-full bg-fg px-6 py-3 text-[15px] font-medium text-card transition-colors hover:bg-accent">See the work</a>
        <a :href="demo.href" target="_blank" rel="noopener" class="rounded-full border border-line-2 px-6 py-3 text-[15px] font-medium transition-colors hover:border-fg">Live demo ↗</a>
      </div>
      <dl class="intro mt-12 grid max-w-xl grid-cols-3 gap-x-6 [--d:440ms] md:mt-14">
        <div v-for="s in stats.slice(0, 3)" :key="s.label">
          <dt class="label">{{ s.label }}</dt>
          <dd class="mt-1 text-2xl font-medium tracking-tight">{{ s.value }}{{ s.suffix }}</dd>
        </div>
      </dl>
    </div>
    <div class="intro h-[58svh] min-h-[380px] lg:h-[82svh] [--d:200ms]">
      <TreeCanvas />
    </div>
  </section>

  <!-- Work -->
  <section id="work" class="scroll-mt-16 border-t border-line" aria-labelledby="work-title">
    <div class="wrap py-24 md:py-32">
      <div class="mb-16 grid gap-6 md:mb-24 md:grid-cols-[1fr_auto] md:items-end" v-reveal>
        <h2 id="work-title" class="text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[0.95] font-medium tracking-[-0.04em]">
          Selected <span class="serif tracking-[-0.01em]">work</span>
          <sup class="ml-1 align-super font-mono text-base text-dim">{{ projects.length }}</sup>
        </h2>
        <p class="max-w-sm text-dim">Client work is under NDA. Names, data and brands on the screens are replaced with samples. Happy to walk through any of it on a call.</p>
      </div>
      <div class="space-y-24 md:space-y-36">
        <ProjectCard v-for="(p, i) in projects" :key="p.slug" :project="p" :flip="i % 2 === 1" v-reveal />
      </div>
    </div>
  </section>

  <!-- Approach -->
  <section id="approach" class="scroll-mt-16 bg-bg-2" aria-labelledby="approach-title">
    <div class="wrap py-24 md:py-32">
      <div class="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end" v-reveal>
        <h2 id="approach-title" class="text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[0.95] font-medium tracking-[-0.04em]">One person, <span class="serif tracking-[-0.01em]">sketch to shipped</span></h2>
        <p class="max-w-md text-lg text-dim md:justify-self-end">I design the flow, build it, and keep design and code in sync through one component library. The loop is the same on every project.</p>
      </div>
      <ol class="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(s, i) in approach" :key="s.title" v-tilt="8" class="flex min-h-[220px] flex-col rounded-[22px] bg-card p-7 sm:min-h-[300px]" v-reveal="i * 90">
          <span class="serif text-6xl leading-none text-accent">{{ i + 1 }}</span>
          <h3 class="mt-auto text-xl font-medium tracking-tight">{{ s.title }}</h3>
          <p class="mt-2 text-dim">{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <!-- About -->
  <section id="about" class="wrap scroll-mt-16 py-24 md:py-32" aria-labelledby="about-title">
    <div class="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div v-tilt="4" class="overflow-hidden rounded-[22px]" v-reveal>
        <AvatarPhoto size="aspect-[4/5] w-full" />
      </div>
      <div class="flex flex-col">
        <h2 id="about-title" class="text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[0.95] font-medium tracking-[-0.04em]" v-reveal>Hi, I’m <span class="serif tracking-[-0.01em] text-accent">Artsem</span>.</h2>
        <p class="mt-6 max-w-xl text-xl leading-relaxed text-fg-2" v-reveal="80">
          {{ profile.role }} at {{ profile.company }}. {{ profile.bio }} I care about the states nobody draws: loading, empty, error and dark, and about a component library that design and code both trust.
        </p>
        <dl class="mt-12 grid grid-cols-2 border-t border-line md:grid-cols-4" v-reveal="140">
          <div v-for="s in stats" :key="s.label" class="border-b border-line py-6 pr-4">
            <dd class="text-[clamp(2.4rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.04em]"><CountUp :value="s.value" :suffix="s.suffix" /></dd>
            <dt class="label mt-3">{{ s.label }}</dt>
          </div>
        </dl>
        <div class="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4" v-reveal="200">
          <div v-for="c in capabilities" :key="c.group">
            <p class="serif mb-3 text-2xl">{{ c.group }}</p>
            <ul class="space-y-1.5 text-[15px] text-dim">
              <li v-for="item in c.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="relative scroll-mt-16 overflow-hidden border-t border-line" aria-labelledby="contact-title">
    <div class="absolute inset-0">
      <TilesCanvas />
    </div>
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_50%,var(--color-bg)_30%,transparent_100%)] opacity-90" />
    <div class="wrap pointer-events-none relative py-32 text-center md:py-48">
      <p class="label mb-6" v-reveal>Contact</p>
      <h2 id="contact-title" class="mx-auto max-w-[15ch] text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.92] font-medium tracking-[-0.045em]" v-reveal="80">
        Let’s build something <span class="serif tracking-[-0.02em] text-accent">people trust</span>.
      </h2>
      <p class="mx-auto mt-6 max-w-md text-lg text-dim" v-reveal="160">Happy to walk through any of these projects live, including the code.</p>
      <div class="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3" v-reveal="240">
        <a v-if="profile.email" :href="`mailto:${profile.email}`" class="rounded-full bg-fg px-6 py-3 text-[15px] font-medium text-card transition-colors hover:bg-accent">Email me</a>
        <a :href="demo.href" target="_blank" rel="noopener" class="rounded-full px-6 py-3 text-[15px] font-medium transition-colors" :class="profile.email ? 'border border-line-2 bg-card hover:border-fg' : 'bg-fg text-card hover:bg-accent'">Open the live demo ↗</a>
        <a :href="github.href" target="_blank" rel="noopener" class="rounded-full border border-line-2 bg-card px-6 py-3 text-[15px] font-medium transition-colors hover:border-fg">GitHub ↗</a>
      </div>
    </div>
  </section>
</template>
