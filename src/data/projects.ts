export interface Shot {
  src: string
  bar: string
  caption?: string
}

export interface Point {
  title: string
  text: string
}

export interface Project {
  slug: string
  index: string
  title: string
  kind: string
  tagline: string
  summary: string
  years: string
  role: string
  platforms: string
  stack: string[]
  tags: string[]
  note: string
  cover: Shot
  shots: Shot[]
  points: Point[]
  hood?: { title: string; text: string; code?: string; file?: string }
  links?: { label: string; href: string }[]
}

const DEMO = 'https://artsemd.github.io/atrium-agent-workspace/'

export const projects: Project[] = [
  {
    slug: 'ai-agent-platform',
    index: '01',
    title: 'AI Agent Platform',
    kind: 'Agent workspace',
    tagline: 'Agents that feel like teammates',
    summary:
      "A B2B platform where teams hand work to AI agents. I designed and built its agent workspace: people hand a task to an agent, follow the run live, approve every write it proposes, and see what each run cost against the team's budget.",
    years: '2025 – now',
    role: 'Product design, front-end',
    platforms: 'Web',
    stack: ['Vue 3', 'Nuxt', 'TypeScript', 'Pinia', 'Tailwind', 'ECharts', 'WebSocket', 'Storybook', 'Figma'],
    tags: ['AI agents', 'Data viz', 'Design system'],
    note: 'The client project is under NDA. The screens are my own recreation of the same patterns on fictional data, built as a working open-source demo.',
    cover: { src: '/work/atrium-hero-dark.webp', bar: 'atrium / run' },
    shots: [
      { src: '/work/atrium-done-light.webp', bar: 'atrium / run', caption: 'Every write is a diff with a reason, approved one by one or all at once.' },
      { src: '/work/atrium-spend-dusk.webp', bar: 'atrium / spend', caption: 'Spend → Value: a forecast with honest uncertainty, next to what the runs were worth.' },
      { src: '/work/atrium-system-light.webp', bar: 'atrium / components', caption: 'Same tokens, four themes: light, dark, dusk, sand.' },
    ],
    points: [
      { title: 'A live timeline, not a spinner', text: "Each step streams in with what it read, whether access was read-only, tokens and time. The agent's avatar breathes while it works and goes still when it waits for you." },
      { title: 'Every write is a diff with a reason', text: 'Old value struck through, new value next to it, and why the agent wants it. Approve or reject one by one or all at once, undo before continuing.' },
      { title: 'Nothing is written without a decision', text: 'The run pauses until every change has an answer, then writes only what was approved and logs it.' },
      { title: 'What AI cost, and what it was worth', text: 'Month-end spend as a line and a band that widens with time. Useful-run rate and cost per useful run, per team, so the conversation is about value, not just tokens.' },
    ],
    hood: {
      title: 'A run is a state machine, streamed',
      text: 'The backend streams run events over WebSocket. On the client one composable turns them into a typed state machine that every surface (timeline, approval, cost) reads from. Unit-tested with an injected delay: pause at writes, apply only approved, stale runs can’t write into new ones.',
      file: 'src/composables/useAgentRun.ts, simplified',
      code: `async function start(task: string) {
  const gen = ++generation // a new run invalidates any old one
  resetState(task)
  for (const step of script) {
    const done = await playStep(step, gen)
    if (!done) return // stopped mid-step
    if (step.kind === 'proposal') {
      state.status = 'awaiting-approval'
      // sleeps until every write has a decision
      await new Promise((resolve) => (resumeAfterApproval = resolve))
      if (gen !== generation) return
      state.status = 'running'
    }
  }
  // only approved writes ever reach the ERP
  await apply(writes.filter((w) => w.decision === 'approved'), gen)
}`,
    },
    links: [
      { label: 'Live demo', href: DEMO },
      { label: 'Storybook', href: DEMO + 'storybook/' },
      { label: 'Source code', href: 'https://github.com/ArtsemD/atrium-agent-workspace' },
    ],
  },
  {
    slug: 'private-asset-inventory',
    index: '02',
    title: 'Private Asset Inventory',
    kind: 'Inventory platform',
    tagline: 'Every valuable item, accounted for',
    summary:
      'Inventory for high-value private assets: every item across properties and storage, where it is, what it is worth and who moved it. I designed and built the inventory workflows end to end, for web and for iOS and Android.',
    years: '2024 – 2025',
    role: 'Product design, web + native',
    platforms: 'Web, iOS, Android',
    stack: ['React', 'TypeScript', 'Tailwind', 'Expo', 'React Native', 'NativeWind', 'Recharts', 'Hono', 'PostgreSQL', 'AWS'],
    tags: ['B2B SaaS', 'Web + native', 'Complex data'],
    note: 'Live on web, iOS and Android. Client project under NDA: names, places and figures on the screens are replaced with sample data.',
    cover: { src: '/work/inv-dashboard.webp', bar: 'inventory / home' },
    shots: [
      { src: '/work/inv-inventory.webp', bar: 'inventory / items', caption: 'Thousands of items, grouped by where they live, with a running total per group.' },
      { src: '/work/inv-item.webp', bar: 'inventory / item', caption: 'Item at a glance: location path, value, care details and full history.' },
      { src: '/work/inv-move.webp', bar: 'inventory / move', caption: 'Moves as a status timeline: in transit → to verify → verified.' },
    ],
    points: [
      { title: 'Grouped by where things live', text: 'Rows grouped by category path with a running total per group, so value is visible without exporting anything.' },
      { title: 'Filters that match how people think', text: 'Hierarchical locations (home → floor → room), categories, status, custom fields and dates, combined and cleared in one place.' },
      { title: 'Stable while data arrives', text: 'Skeleton rows with the final row height and Framer Motion transitions, so the table never jumps.' },
      { title: 'Import that people trust', text: 'XLSX import with templates and validation. AI suggests the column mapping, the user reviews it before anything is imported.' },
    ],
    hood: {
      title: 'One design system, web and native',
      text: 'I owned the shared UI package and its Figma counterpart: tokens, light and dark themes, type and spacing scales, used by both apps from one pnpm monorepo.',
      file: 'packages/ui/tailwind-preset.ts, simplified illustration',
      code: `export default {
  theme: { extend: {
    colors: {
      surface: 'rgb(var(--surface) / <alpha-value>)',
      accent: 'rgb(var(--accent) / <alpha-value>)',
      status: {
        available: 'rgb(var(--ok) / <alpha-value>)',
        transit: 'rgb(var(--transit) / <alpha-value>)',
      },
    },
  }},
}
// apps/web:    presets: [uiPreset]
// apps/mobile: presets: [require('nativewind/preset'), uiPreset]`,
    },
  },
  {
    slug: 'media-licensing-platform',
    index: '03',
    title: 'Media Licensing Platform',
    kind: 'Page builder',
    tagline: 'Pages built from blocks, not tickets',
    summary:
      'A platform that licenses a large content library to subscribers. I built its page constructor: editors assemble pages from ready-made components, so new campaign and product pages are assembled, not hand-coded.',
    years: '2023 – 2024',
    role: 'Front-end, component library',
    platforms: 'Web',
    stack: ['Vue 3', 'Nuxt', 'TypeScript', 'Pinia', 'Tailwind', 'Storybook', 'Strapi', 'Figma'],
    tags: ['Page builder', 'Content', 'Storybook'],
    note: 'Client project under NDA: brand and content on the screen are replaced with placeholders.',
    cover: { src: '/work/media-home.webp', bar: 'media-platform / home' },
    shots: [],
    points: [
      { title: 'Editors compose, components guarantee quality', text: 'Editors arrange typed blocks in Strapi; a registry maps each block to a lazy-loaded Vue component on a Nuxt page.' },
      { title: 'Design rules live in the components', text: "Typography, spacing, loading and empty states and focus are built in, so editors can't break them." },
      { title: 'Documented in Storybook', text: 'Each block with its variants, matched to the Figma library with the designers.' },
    ],
    hood: {
      title: 'A registry the compiler checks',
      text: '`satisfies` makes a new block type a compile error until it has a component.',
      file: 'PageRenderer.vue, simplified illustration',
      code: `const registry = {
  'blocks.hero': lazy(() => import('./Hero.vue')),
  'blocks.media-grid': lazy(() => import('./MediaGrid.vue')),
  'blocks.carousel': lazy(() => import('./Carousel.vue')),
  'blocks.cta': lazy(() => import('./Cta.vue')),
} satisfies Record<BlockType, Component>

<component v-for="b in blocks" :key="b.id"
  :is="registry[b.__component]" v-bind="b" />`,
    },
  },
  {
    slug: 'instant-quote-widget',
    index: '04',
    title: 'Instant Quote Widget',
    kind: 'Embeddable widget',
    tagline: 'A quote in seconds, on any website',
    summary:
      'The widget lets homeowners price a home exterior job from a satellite map in seconds, and gives contractors ready-to-buy leads. Contractors embed it on their own sites.',
    years: '2023',
    role: 'Product design, full-stack',
    platforms: 'Web, embeddable',
    stack: ['React', 'Redux', 'React Query', 'Mapbox', 'Google Maps', 'Styled Components', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    tags: ['Maps', 'E-sign', 'Full-stack'],
    note: 'Client project under NDA: brand and copy on the screen are replaced.',
    cover: { src: '/work/quote-landing.webp', bar: 'quote-widget / landing' },
    shots: [],
    points: [
      { title: 'Map-based estimation', text: 'Address search, satellite view and building outlines on Mapbox and Google Maps. Prototyped in Figma and usability-tested with contractors before release.' },
      { title: 'The embeddable widget', text: "Runs on contractor websites it doesn't control: isolated styles, contractor branding and products, fast on mobile." },
      { title: 'E-signatures', text: 'Homeowners review and sign the proposal online, so a lead can turn into a contract without a visit.' },
      { title: 'Report generation', text: 'Branded reports and proposals generated on the server from measurements, products and pricing.' },
    ],
  },
]

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)
