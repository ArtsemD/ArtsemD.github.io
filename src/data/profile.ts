export const profile = {
  name: 'Artsem D.',
  role: 'Design Engineer',
  company: 'Cogniteq',
  location: 'CET · Remote',
  timeZone: 'Europe/Warsaw',
  bio: 'I take B2B products from the first Figma sketch to production code in Vue, React and TypeScript, and own the design systems they are built with.',
  photo: '/me.jpg',
  photoSmall: '/me-sm.jpg',
  // Fill in to show the "Email me" button and the footer link.
  email: '',
  links: [
    { label: 'GitHub', href: 'https://github.com/ArtsemD' },
    { label: 'Live demo', href: 'https://artsemd.github.io/atrium-agent-workspace/' },
    { label: 'Storybook', href: 'https://artsemd.github.io/atrium-agent-workspace/storybook/' },
  ],
}

export const stats = [
  { value: 7, suffix: '+', label: 'Years building B2B products' },
  { value: 4, suffix: '', label: 'Recent products shown here' },
  { value: 3, suffix: '', label: 'Of them live in public' },
  { value: 3, suffix: '', label: 'Platforms: web, iOS, Android' },
]

export const capabilities = [
  { group: 'Design', items: ['Product design', 'UX flows & states', 'Prototyping', 'Usability testing', 'Data visualisation', 'Figma libraries'] },
  { group: 'Systems', items: ['Design tokens', 'Theming', 'Component libraries', 'Storybook', 'Accessibility', 'Documentation'] },
  { group: 'Engineering', items: ['TypeScript', 'Vue 3 / Nuxt', 'React', 'React Native / Expo', 'Tailwind', 'Node.js'] },
  { group: 'AI', items: ['Agent UX', 'Approvals & diffs', 'Cost & value', 'Claude Code', 'Cursor', 'LLM gateways'] },
]

export const approach = [
  { title: 'Flow & states in Figma', text: 'Every screen designed with its loading, empty, error and dark states before any code.' },
  { title: 'Tokens & components', text: 'Semantic tokens and themes, components in Storybook mapped 1:1 to the Figma library.' },
  { title: 'Production code', text: 'Typed, tested Vue 3 / React, reviewed like any PR, including what AI agents draft.' },
  { title: 'Test, then ship what works', text: 'Prototypes in front of customers within a day, then rebuilt to production quality.' },
]

export const marquee = [
  ['Product design', 'Design systems', 'Design tokens', 'Prototyping', 'UX research', 'Data viz', 'Accessibility', 'Motion', 'Figma', 'Storybook'],
  ['TypeScript', 'Vue 3', 'Nuxt', 'React', 'React Native', 'Expo', 'Tailwind', 'Three.js', 'Node.js', 'PostgreSQL', 'WebSocket', 'AI agents'],
]
