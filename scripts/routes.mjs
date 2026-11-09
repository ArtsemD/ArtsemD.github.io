// Writes dist/work/<slug>/index.html for every case, so deep links return 200 with their
// own title and description (GitHub Pages has no SPA rewrites).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('src/data/projects.ts', 'utf8')
const html = readFileSync('dist/index.html', 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const re = /slug: '([^']+)',[\s\S]*?title: '([^']+)',[\s\S]*?tagline: '([^']+)'/g
let n = 0
for (const [, slug, title, tagline] of src.matchAll(re)) {
  const page = html
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)} · Artsem D.</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(tagline)}. Case study by Artsem D., Design Engineer.`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)} · Artsem D.`)
  mkdirSync(`dist/work/${slug}`, { recursive: true })
  writeFileSync(`dist/work/${slug}/index.html`, page)
  n++
}
writeFileSync('dist/404.html', html)
console.log(`routes: ${n} case pages + 404.html`)
