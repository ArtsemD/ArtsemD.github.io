import {
  CanvasTexture,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

/**
 * Hero visual: a glowing artboard frame that slowly morphs from a rounded square to a
 * circle, seen through fluted glass. Each glass flute bends the image like a small
 * cylindrical lens, with a little chromatic split. Design tokens drawn on a canvas show
 * up only where the glow lights them.
 */

const vertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uFlutes;
uniform vec2 uCenter;
uniform float uScale;
uniform sampler2D uText;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// distance to the frame outline in "shape space"
float frame(vec2 p) {
  float t = uTime;
  p += 0.012 * vec2(sin(p.y * 9.0 + t * 0.9), cos(p.x * 7.0 - t * 0.7));
  p *= rot(0.18 * sin(t * 0.11) + (uMouse.x - 0.5) * 0.35);
  float m = 0.5 + 0.5 * sin(t * 0.23);
  float size = 0.27 * uScale * (1.0 - uScroll * 0.25);
  return sdRoundBox(p, vec2(size), mix(0.07, size, m * 0.85));
}

vec3 glow(vec2 p) {
  float d = frame(p);
  float core = 0.0026 / (abs(d) + 0.0035);
  float halo = 0.035 / (abs(d) + 0.06);
  float inside = smoothstep(0.02, -0.12, d);
  vec3 ice = vec3(0.62, 0.84, 1.0);
  vec3 col = ice * halo * 0.55 + vec3(0.92, 0.97, 1.0) * core;
  col *= 1.0 - inside * 0.85; // the inside of the frame is darker glass
  return col;
}

void main() {
  vec2 frag = vUv * uRes;
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;

  // fluted glass: vertical flutes, each one a small cylindrical lens
  float sx = uv.x * uFlutes;
  float cell = fract(sx);
  float lens = cell - 0.5;
  float bend = 0.10 + 0.04 * sin(uTime * 0.4);
  vec2 off = vec2(lens * bend / uFlutes * 9.0, 0.0);

  vec2 c = uCenter + (uMouse - 0.5) * vec2(0.05, 0.04);
  vec2 p = (uv - c) * vec2(aspect, 1.0);
  vec2 po = off * vec2(aspect, 1.0);

  vec3 col;
  col.r = glow(p + po * 1.00).r;
  col.g = glow(p + po * 1.07).g;
  col.b = glow(p + po * 1.15).b;

  // tokens, lit only near the frame
  vec2 tuv = (p + po) * 1.25 / uScale + 0.5;
  float ring = smoothstep(0.16, 0.0, abs(frame(p + po)));
  float txt = texture2D(uText, tuv).r * ring;
  col += vec3(0.75, 0.9, 1.0) * txt * 0.32;

  // background and light bleeding into the glass
  vec3 bg = mix(vec3(0.018, 0.024, 0.032), vec3(0.04, 0.06, 0.08), uv.y);
  float bleed = exp(-length(p) * 2.6);
  bg += vec3(0.25, 0.42, 0.58) * bleed * 0.22;
  col += bg;

  // flute shading: a bright edge on one side, a soft shadow on the other
  float edge = smoothstep(0.93, 1.0, cell) * 0.05 + smoothstep(0.08, 0.0, cell) * 0.025;
  col += edge * (0.6 + bleed);
  col *= 0.86 + 0.14 * cos(lens * 3.1416);

  // vignette, grain, scroll fade
  float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(aspect * 0.8, 1.0)));
  col *= mix(0.55, 1.0, vig);
  col += (hash(frag + fract(uTime) * 100.0) - 0.5) * 0.035;
  col *= 1.0 - uScroll * 0.6;

  gl_FragColor = vec4(col, 1.0);
}
`

function tokenTexture() {
  const size = 1024
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const ctx = cv.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#fff'
  ctx.font = '500 19px "JetBrains Mono", ui-monospace, monospace'
  const lines = [
    '--surface: oklch(0.16 0.01 250);',
    '--accent: oklch(0.86 0.08 230);',
    '--radius-md: 10px;  --space-4: 16px;',
    'state: idle → running → done',
    '<Button variant="primary" />',
    'loading · empty · error · dark',
    '--ok: oklch(0.78 0.14 155);',
    'figma ⇄ storybook ⇄ code',
    'satisfies Record<Block, Component>',
    'theme: light | dark | dusk | sand',
    'awaiting-approval: 3 writes',
    '--font-mono: "JetBrains Mono";',
    'tokens.json → tailwind preset',
    'useAgentRun(task)',
    '<Skeleton :rows="8" />',
    'contrast(fg, bg) >= 4.5',
  ]
  let y = 40
  let i = 0
  while (y < size) {
    const line = lines[i % lines.length]
    const x = 30 + ((i * 137) % 260)
    ctx.globalAlpha = 0.55 + ((i * 53) % 45) / 100
    ctx.fillText(line, x, y)
    y += 30
    i++
  }
  const tex = new CanvasTexture(cv)
  tex.minFilter = LinearFilter
  tex.generateMipmaps = false
  return tex
}

export interface HeroReadout {
  pointer: [number, number]
  morph: number
  fps: number
}

export function createHero(canvas: HTMLCanvasElement, onReadout?: (r: HeroReadout) => void) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: new Vector2(1, 1) },
    uMouse: { value: new Vector2(0.5, 0.5) },
    uScroll: { value: 0 },
    uFlutes: { value: 16 },
    uCenter: { value: new Vector2(0.64, 0.56) },
    uScale: { value: 1 },
    uText: { value: tokenTexture() },
  }
  const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms })
  scene.add(new Mesh(new PlaneGeometry(2, 2), material))

  // redraw the tokens once the mono font has loaded
  document.fonts?.load('500 19px "JetBrains Mono"').then(() => {
    uniforms.uText.value.dispose()
    uniforms.uText.value = tokenTexture()
  })

  const target = new Vector2(0.5, 0.5)
  const onMove = (e: PointerEvent) => target.set(e.clientX / innerWidth, 1 - e.clientY / innerHeight)
  addEventListener('pointermove', onMove, { passive: true })

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    const pr = renderer.getPixelRatio()
    uniforms.uRes.value.set(w * pr, h * pr)
    const narrow = w < 760
    uniforms.uScale.value = Math.min(1, w / h / 0.8)
    uniforms.uFlutes.value = narrow ? 8 : Math.round(w / 90)
    uniforms.uCenter.value.set(narrow ? 0.5 : 0.67, narrow ? 0.64 : 0.57)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)

  let raf = 0
  let last = performance.now()
  let fpsAcc = 0
  let fpsFrames = 0
  let fps = 60
  const start = last

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    if (!visible || document.hidden) return
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    uniforms.uTime.value = reduced ? 8 : (now - start) / 1000
    uniforms.uMouse.value.lerp(target, reduced ? 1 : 1 - Math.pow(0.002, dt))
    uniforms.uScroll.value = Math.min(1, scrollY / innerHeight)
    renderer.render(scene, camera)

    fpsAcc += dt
    fpsFrames++
    if (fpsAcc > 0.25) {
      fps = Math.round(fpsFrames / fpsAcc)
      fpsAcc = 0
      fpsFrames = 0
      const m = uniforms.uMouse.value
      onReadout?.({ pointer: [m.x, m.y], morph: 0.5 + 0.5 * Math.sin(uniforms.uTime.value * 0.23), fps })
    }
  }

  let stillRo: ResizeObserver | undefined
  if (reduced) {
    // one still frame, re-rendered only on resize
    uniforms.uTime.value = 8
    ro.disconnect()
    const still = () => {
      resize()
      renderer.render(scene, camera)
    }
    stillRo = new ResizeObserver(still)
    stillRo.observe(canvas)
    still()
  } else {
    raf = requestAnimationFrame(frame)
  }

  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('pointermove', onMove)
    ro.disconnect()
    stillRo?.disconnect()
    io.disconnect()
    uniforms.uText.value.dispose()
    material.dispose()
    renderer.dispose()
  }
}
