<script setup lang="ts">
import { approach, capabilities, marquee, profile, stats } from '../data/profile'
import { projects } from '../data/projects'
import AvatarPhoto from '../components/AvatarPhoto.vue'
import CountUp from '../components/CountUp.vue'
import HeroCanvas from '../components/HeroCanvas.vue'
import MarqueeRow from '../components/MarqueeRow.vue'
import ProjectCard from '../components/ProjectCard.vue'

const [featured, ...rest] = projects
const demo = profile.links.find((l) => l.label === 'Live demo')!
const github = profile.links.find((l) => l.label === 'GitHub')!
</script>

<template>
  <!-- Hero -->
  <section class="relative h-[100svh] min-h-[600px] overflow-hidden" aria-labelledby="hero-title">
    <HeroCanvas />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    <div class="wrap relative flex h-full flex-col justify-end pb-14 md:pb-16">
      <div class="intro flex items-center gap-3">
        <AvatarPhoto />
        <div class="leading-tight">
          <p class="font-mono text-[13px] text-fg">{{ profile.name }}</p>
          <p class="font-mono text-[13px] text-dim">{{ profile.role }} @ {{ profile.company }}</p>
        </div>
      </div>
      <h1 id="hero-title" class="mt-6 max-w-[14ch] text-[clamp(2.6rem,6.4vw,5.75rem)] leading-[0.98] font-medium tracking-[-0.035em] intro [--d:120ms]">Designing products, shipping the code.</h1>
      <a href="#work" class="mt-7 inline-flex w-fit items-center gap-2 text-sm text-dim transition-colors hover:text-fg intro [--d:240ms]">
        See selected work
        <svg viewBox="0 0 16 16" class="size-3.5 animate-bounce" aria-hidden="true"><path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
      </a>
    </div>
  </section>

  <!-- Marquee -->
  <section class="space-y-4 border-y border-line py-10" aria-label="Skills and stack">
    <MarqueeRow :items="marquee[0]" :duration="55" />
    <MarqueeRow :items="marquee[1]" :duration="60" reverse />
  </section>

  <!-- Work -->
  <section id="work" class="wrap scroll-mt-20 py-24 md:py-32" aria-labelledby="work-title">
    <div class="mb-12 flex flex-wrap items-end justify-between gap-6" v-reveal>
      <div>
        <p class="label mb-4">Work</p>
        <h2 id="work-title" class="text-[clamp(2rem,4.4vw,3.75rem)] leading-none font-medium tracking-[-0.03em]">Selected projects <sup class="align-super font-mono text-base text-dim">({{ projects.length }})</sup></h2>
      </div>
      <p class="max-w-sm text-sm text-dim">Client work is under NDA. Names, data and brands on the screens are replaced with samples. Happy to walk through any of it on a call.</p>
    </div>
    <ProjectCard :project="featured" large v-reveal />
    <div class="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
      <ProjectCard v-for="(p, i) in rest" :key="p.slug" :project="p" v-reveal="i * 100" />
    </div>
  </section>

  <!-- Approach -->
  <section id="approach" class="scroll-mt-20 border-t border-line bg-ink-2" aria-labelledby="approach-title">
    <div class="wrap grid gap-12 py-24 md:py-32 lg:grid-cols-[1fr_1.3fr]">
      <div class="lg:sticky lg:top-28 lg:self-start" v-reveal>
        <p class="label mb-4">Approach</p>
        <h2 id="approach-title" class="text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.03em]">One person from sketch to shipped</h2>
        <p class="mt-6 max-w-md text-dim">I design the flow, build it, and keep design and code in sync through one component library. The loop is the same on every project.</p>
      </div>
      <ol class="divide-y divide-line border-y border-line">
        <li v-for="(s, i) in approach" :key="s.title" class="grid grid-cols-[3rem_1fr] gap-4 py-8 md:grid-cols-[5rem_1fr]" v-reveal="i * 80">
          <span class="font-mono text-sm text-ice">0{{ i + 1 }}</span>
          <div>
            <h3 class="text-xl font-medium tracking-tight md:text-2xl">{{ s.title }}</h3>
            <p class="mt-2 max-w-lg text-dim">{{ s.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>

  <!-- About & stats -->
  <section id="about" class="wrap scroll-mt-20 py-24 md:py-32" aria-labelledby="about-title">
    <p class="label mb-4" v-reveal>About</p>
    <div class="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <article class="relative overflow-hidden rounded-2xl border border-line bg-panel" v-reveal>
        <AvatarPhoto size="aspect-[4/5] w-full" />
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-6 pt-24">
          <h2 id="about-title" class="text-2xl font-medium tracking-tight">{{ profile.name }}</h2>
          <p class="font-mono text-[13px] text-dim">{{ profile.role }} @ {{ profile.company }}</p>
          <p class="mt-4 max-w-md text-sm text-fg/80">{{ profile.bio }}</p>
        </div>
      </article>

      <div class="grid gap-6">
        <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
          <div v-for="(s, i) in stats" :key="s.label" class="bg-ink p-6 md:p-8" v-reveal="i * 80">
            <p class="text-[clamp(2.5rem,5vw,4rem)] leading-none font-medium tracking-[-0.04em]"><CountUp :value="s.value" :suffix="s.suffix" /></p>
            <p class="label mt-3">{{ s.label }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6 rounded-2xl border border-line p-6 md:grid-cols-4 md:p-8" v-reveal>
          <div v-for="c in capabilities" :key="c.group">
            <p class="mb-3 text-sm font-medium">{{ c.group }}</p>
            <ul class="space-y-1.5">
              <li v-for="item in c.items" :key="item" class="label">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="relative scroll-mt-20 overflow-hidden border-t border-line" aria-labelledby="contact-title">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_50%_100%,#14324a_0%,transparent_70%)] opacity-70" />
    <div class="wrap relative py-28 text-center md:py-40">
      <p class="label mb-6" v-reveal>Contact</p>
      <h2 id="contact-title" class="mx-auto max-w-[16ch] text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] font-medium tracking-[-0.035em]" v-reveal="80">Let’s build something people trust.</h2>
      <p class="mx-auto mt-6 max-w-md text-dim" v-reveal="160">Happy to walk through any of these projects live, including the code.</p>
      <div class="mt-10 flex flex-wrap justify-center gap-3" v-reveal="240">
        <a v-if="profile.email" :href="`mailto:${profile.email}`" class="rounded-full bg-fg px-6 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-85">Email me</a>
        <a :href="demo.href" target="_blank" rel="noopener" class="rounded-full px-6 py-3 text-sm font-medium transition-colors" :class="profile.email ? 'border border-line-2 hover:border-fg' : 'bg-fg text-ink hover:opacity-85'">Open the live demo ↗</a>
        <a :href="github.href" target="_blank" rel="noopener" class="rounded-full border border-line-2 px-6 py-3 text-sm font-medium transition-colors hover:border-fg">GitHub ↗</a>
      </div>
    </div>
  </section>
</template>
