import {
  CanvasTexture,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/**
 * An interface, exploded: design tokens at the bottom, component outlines in the middle,
 * the finished screen on top. The layers drift apart, hold, and click back together,
 * and the stack turns toward the cursor. Labels are DOM, placed from projected points.
 */

const W = 4.2 // layer width (x)
const D = 2.7 // layer depth (z)
const TEX_W = 1260
const TEX_H = Math.round((TEX_W * D) / W)

const C = {
  paper: '#fbf9f4',
  paper2: '#e9e5dc',
  ink: '#17150f',
  dim: '#6b665b',
  faint: '#a19b8e',
  accent: '#ff4f17',
  ok: '#2f8f5b',
}

const SANS = '"Inter Tight", ui-sans-serif, system-ui, sans-serif'
const MONO = '"JetBrains Mono", ui-monospace, monospace'

function surface(fill: string | null, stroke?: string, dash?: number[]) {
  const cv = document.createElement('canvas')
  cv.width = TEX_W
  cv.height = TEX_H
  const ctx = cv.getContext('2d')!
  const r = 44
  ctx.beginPath()
  ctx.roundRect(6, 6, TEX_W - 12, TEX_H - 12, r)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.setLineDash(dash ?? [])
    ctx.strokeStyle = stroke
    ctx.lineWidth = 4
    ctx.stroke()
    ctx.setLineDash([])
  }
  return { cv, ctx }
}

// card geometry shared by the screen and the component outlines, so they line up
const CARD = {
  head: { x: 70, y: 64, w: TEX_W - 140, h: 110 },
  rows: [0, 1, 2].map((i) => ({ x: 70, y: 214 + i * 128, w: TEX_W - 140, h: 106 })),
  reject: { x: TEX_W - 560, y: 640, w: 220, h: 84 },
  approve: { x: TEX_W - 316, y: 640, w: 246, h: 84 },
}

function drawScreen() {
  const { cv, ctx } = surface(C.paper, 'rgba(23,21,15,0.14)')
  const h = CARD.head
  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.arc(h.x + 40, h.y + 50, 34, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = C.ink
  ctx.font = `600 40px ${SANS}`
  ctx.fillText('Reconcile October invoices', h.x + 100, h.y + 46)
  ctx.fillStyle = C.dim
  ctx.font = `400 28px ${SANS}`
  ctx.fillText('Agent wants to write 3 changes', h.x + 100, h.y + 88)
  ctx.fillStyle = 'rgba(255,79,23,0.12)'
  ctx.beginPath()
  ctx.roundRect(h.x + h.w - 280, h.y + 22, 280, 56, 28)
  ctx.fill()
  ctx.fillStyle = C.accent
  ctx.font = `500 26px ${MONO}`
  ctx.fillText('awaiting you', h.x + h.w - 250, h.y + 59)

  const rows = [
    ['INV-2041 · Amount', '€12,400', '€12,040'],
    ['INV-2045 · Vendor', 'Nordlicht', 'Nordlicht GmbH'],
    ['INV-2050 · Status', 'Approved', 'On hold'],
  ]
  CARD.rows.forEach((r, i) => {
    ctx.fillStyle = '#f3f0ea'
    ctx.beginPath()
    ctx.roundRect(r.x, r.y, r.w, r.h, 22)
    ctx.fill()
    ctx.fillStyle = C.ink
    ctx.font = `500 30px ${SANS}`
    ctx.fillText(rows[i][0], r.x + 30, r.y + 46)
    ctx.font = `400 28px ${MONO}`
    ctx.fillStyle = C.faint
    const oldW = ctx.measureText(rows[i][1]).width
    ctx.fillText(rows[i][1], r.x + 30, r.y + 84)
    ctx.fillRect(r.x + 30, r.y + 74, oldW, 3)
    ctx.fillStyle = C.ok
    ctx.fillText(`→ ${rows[i][2]}`, r.x + 50 + oldW, r.y + 84)
    // check box on the right
    ctx.strokeStyle = 'rgba(23,21,15,0.25)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(r.x + r.w - 82, r.y + 30, 46, 46, 12)
    ctx.stroke()
    if (i < 2) {
      ctx.fillStyle = C.ink
      ctx.beginPath()
      ctx.roundRect(r.x + r.w - 82, r.y + 30, 46, 46, 12)
      ctx.fill()
      ctx.strokeStyle = C.paper
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(r.x + r.w - 70, r.y + 54)
      ctx.lineTo(r.x + r.w - 61, r.y + 63)
      ctx.lineTo(r.x + r.w - 46, r.y + 44)
      ctx.stroke()
    }
  })
  const rj = CARD.reject
  ctx.strokeStyle = 'rgba(23,21,15,0.3)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(rj.x, rj.y, rj.w, rj.h, 42)
  ctx.stroke()
  ctx.fillStyle = C.ink
  ctx.font = `500 30px ${SANS}`
  ctx.fillText('Reject', rj.x + 64, rj.y + 53)
  const ap = CARD.approve
  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.roundRect(ap.x, ap.y, ap.w, ap.h, 42)
  ctx.fill()
  ctx.fillStyle = C.paper
  ctx.fillText('Approve 2', ap.x + 52, ap.y + 53)
  ctx.fillStyle = C.faint
  ctx.font = `400 26px ${MONO}`
  ctx.fillText('nothing is written until you decide', 70, 694)
  return cv
}

function drawComponents() {
  const { cv, ctx } = surface('rgba(251,249,244,0.35)', 'rgba(23,21,15,0.35)', [14, 10])
  const box = (b: { x: number; y: number; w: number; h: number }, tag: string, accent = false) => {
    ctx.setLineDash([10, 8])
    ctx.strokeStyle = accent ? C.accent : 'rgba(23,21,15,0.55)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(b.x, b.y, b.w, b.h, Math.min(24, b.h / 2))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.font = `500 26px ${MONO}`
    const tw = ctx.measureText(tag).width
    ctx.fillStyle = accent ? C.accent : C.ink
    ctx.beginPath()
    ctx.roundRect(b.x + 16, b.y - 20, tw + 28, 40, 10)
    ctx.fill()
    ctx.fillStyle = C.paper
    ctx.fillText(tag, b.x + 30, b.y + 9)
  }
  box(CARD.head, '<RunHeader />')
  CARD.rows.forEach((r, i) => box(r, i === 0 ? '<DiffRow v-for="w in writes" />' : '<DiffRow />'))
  box(CARD.reject, '<Button />')
  box(CARD.approve, '<Button primary />', true)
  return cv
}

function drawTokens() {
  const { cv, ctx } = surface(C.paper2, 'rgba(23,21,15,0.1)')
  ctx.fillStyle = C.dim
  ctx.font = `500 26px ${MONO}`
  ctx.fillText('color', 70, 96)
  const swatches: [string, string][] = [
    [C.accent, '--accent'],
    [C.ink, '--ink'],
    [C.paper, '--paper'],
    [C.ok, '--ok'],
    [C.faint, '--muted'],
  ]
  swatches.forEach(([col, name], i) => {
    const x = 120 + i * 220
    ctx.fillStyle = col
    ctx.beginPath()
    ctx.arc(x, 180, 54, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(23,21,15,0.15)'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.fillStyle = C.ink
    ctx.font = `400 24px ${MONO}`
    ctx.fillText(name, x - 54, 280)
  })
  // type scale
  ctx.fillStyle = C.dim
  ctx.font = `500 26px ${MONO}`
  ctx.fillText('type', 70, 380)
  ;[96, 64, 40, 28].forEach((s, i) => {
    ctx.fillStyle = C.ink
    ctx.font = `500 ${s}px ${SANS}`
    ctx.fillText('Aa', 70 + [0, 150, 260, 340][i], 486)
  })
  ctx.fillStyle = C.dim
  ctx.font = `400 24px ${MONO}`
  ctx.fillText('48 / 32 / 20 / 14', 70, 540)
  // spacing
  ctx.font = `500 26px ${MONO}`
  ctx.fillText('space', 620, 380)
  ;[4, 8, 16, 24, 40].forEach((s, i) => {
    ctx.fillStyle = i === 2 ? C.accent : C.ink
    ctx.fillRect(620, 410 + i * 40, s * 9, 18)
    ctx.fillStyle = C.dim
    ctx.font = `400 22px ${MONO}`
    ctx.fillText(String(s), 620 + s * 9 + 16, 426 + i * 40)
  })
  // radius
  ctx.fillStyle = C.dim
  ctx.font = `500 26px ${MONO}`
  ctx.fillText('radius', 70, 610)
  ;[6, 16, 30, 50].forEach((r, i) => {
    ctx.strokeStyle = C.ink
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(70 + i * 120, 636, 84, 84, r)
    ctx.stroke()
  })
  ctx.fillStyle = C.faint
  ctx.font = `400 24px ${MONO}`
  ctx.fillText('tokens.json → css vars → tailwind', 620, 700)
  return cv
}

function texture(cv: HTMLCanvasElement) {
  const t = new CanvasTexture(cv)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  return t
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

export interface LayerPoint {
  x: number
  y: number
  visible: number
}

export function createLayers(canvas: HTMLCanvasElement, onPoints: (pts: LayerPoint[]) => void) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap

  const scene = new Scene()
  const camera = new PerspectiveCamera(28, 1, 0.1, 100)
  const look = new Vector3(0, 1.4, 0)

  scene.add(new HemisphereLight(0xffffff, 0xe9e5dc, 2.3))
  const sun = new DirectionalLight(0xffffff, 1.8)
  sun.position.set(-3, 10, 4)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 })
  sun.shadow.radius = 8
  sun.shadow.bias = -0.0008
  scene.add(sun)

  const ground = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: 0.08 }))
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.35
  ground.receiveShadow = true
  scene.add(ground)

  const stack = new Group()
  scene.add(stack)

  const slabGeo = new RoundedBoxGeometry(W, 0.07, D, 4, 0.03)
  const faceGeo = new PlaneGeometry(W, D)
  faceGeo.rotateX(-Math.PI / 2)

  const defs = [
    { draw: drawTokens, slab: '#e2ddd2', opacity: 1 },
    { draw: drawComponents, slab: '#fbf9f4', opacity: 0.0 },
    { draw: drawScreen, slab: '#f6f3ed', opacity: 1 },
  ]

  const layers = defs.map((d) => {
    const g = new Group()
    if (d.opacity > 0) {
      const slab = new Mesh(slabGeo, new MeshStandardMaterial({ color: d.slab, roughness: 0.85 }))
      slab.castShadow = true
      slab.receiveShadow = true
      g.add(slab)
    }
    const faceMat = new MeshStandardMaterial({ map: texture(d.draw()), transparent: true, roughness: 0.9, alphaTest: 0.02 })
    const face = new Mesh(faceGeo, faceMat)
    face.position.y = 0.037
    face.castShadow = d.opacity === 0 // the outline layer still drops a faint shadow
    face.receiveShadow = true
    g.add(face)
    stack.add(g)
    return { g, face, draw: d.draw }
  })

  const redraw = () => {
    for (const l of layers) {
      const mat = l.face.material as MeshStandardMaterial
      mat.map?.dispose()
      mat.map = texture(l.draw())
      mat.needsUpdate = true
    }
  }
  Promise.all([document.fonts?.load(`500 30px ${SANS}`), document.fonts?.load(`600 40px ${SANS}`), document.fonts?.load(`500 26px ${MONO}`)]).then(redraw, () => {})

  const pointer = new Vector2()
  const lean = new Vector2()
  const onMove = (e: PointerEvent) => pointer.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
  addEventListener('pointermove', onMove, { passive: true })

  let GAP = 1.3
  const BASE_YAW = -0.4
  let labelSpace = 190

  // Place the camera so the fully exploded stack fits right of the label column.
  const fit = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const dir = new Vector3(0, 0.6, 1).normalize()
    const corners: Vector3[] = []
    for (const y of [0.1, 2 * GAP + 0.2]) for (const x of [-W / 2, W / 2]) for (const z of [-D / 2, D / 2]) corners.push(new Vector3(x, y, z))
    const yaw = BASE_YAW
    const project = (dist: number, ox: number) => {
      camera.position.copy(look).addScaledVector(dir, dist)
      camera.lookAt(look)
      camera.updateMatrixWorld()
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const c of corners) {
        const p = c.clone().applyAxisAngle(new Vector3(0, 1, 0), yaw)
        p.x += ox
        p.project(camera)
        const px = (p.x * 0.5 + 0.5) * w
        const py = (-p.y * 0.5 + 0.5) * h
        minX = Math.min(minX, px); maxX = Math.max(maxX, px); minY = Math.min(minY, py); maxY = Math.max(maxY, py)
      }
      return { minX, maxX, minY, maxY }
    }
    const left = labelSpace + 24
    const right = w - 8
    let dist = 3
    let ox = 0
    for (let i = 0; i < 60; i++) {
      for (let k = 0; k < 4; k++) {
        const b = project(dist, ox)
        const shiftPx = (left + right) / 2 - (b.minX + b.maxX) / 2
        const unitsPerPx = (2 * dist * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect) / w
        ox += shiftPx * unitsPerPx
      }
      const b = project(dist, ox)
      if (b.minX >= left && b.maxX <= right && b.minY >= 16 && b.maxY <= h - 36) break
      dist += 0.3
    }
    stack.position.x = ox
  }

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    labelSpace = w < 520 ? 0 : 170
    GAP = w < 520 ? 0.85 : 1.3
    fit()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)

  let started = -1
  let raf = 0
  let last = performance.now()
  const tmp = new Vector3()

  // gap between layers over time: rise in, explode, hold, assemble, hold, repeat
  const gapAt = (t: number) => {
    if (reduced) return 1
    if (t < 1.6) return 0.08
    const c = (t - 1.6) % 8
    if (c < 1.4) return 0.08 + 0.92 * ease(c / 1.4)
    if (c < 5) return 1
    if (c < 6.2) return 1 - 0.92 * ease((c - 5) / 1.2)
    return 0.08
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!visible || document.hidden) return
    const t = started < 0 ? 0 : (now - started) / 1000
    const gap = gapAt(t) * GAP

    layers.forEach((l, i) => {
      // intro: each layer drops in from above, bottom first
      const k = reduced ? 1 : ease(clamp01((t - i * 0.18) / 0.9))
      const float = reduced ? 0 : Math.sin(now / 1100 + i * 1.7) * 0.03 * gapAt(t)
      l.g.position.y = i * gap + 0.12 + float + (1 - k) * 2.2
      l.g.visible = k > 0.001
      const mat = l.face.material as MeshStandardMaterial
      mat.opacity = k
    })

    if (!reduced) lean.lerp(pointer, 1 - Math.pow(0.03, dt))
    stack.rotation.y = BASE_YAW + lean.x * 0.12 + (reduced ? 0 : Math.sin(now / 4000) * 0.05)
    stack.rotation.x = lean.y * 0.05
    renderer.render(scene, camera)

    // label anchors: the left edge of each layer, projected to canvas pixels
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const pts = layers.map((l, i) => {
      tmp.set(-W / 2, 0.04, D / 2).applyMatrix4(l.g.matrixWorld).project(camera)
      const k = clamp01((t - i * 0.18 - 0.6) / 0.6)
      return { x: (tmp.x * 0.5 + 0.5) * w, y: (-tmp.y * 0.5 + 0.5) * h, visible: k * clamp01((gapAt(t) - 0.45) / 0.4) }
    })
    onPoints(pts)
  }
  raf = requestAnimationFrame(frame)

  return {
    start() {
      if (started < 0) started = performance.now()
    },
    dispose() {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      ro.disconnect()
      io.disconnect()
      scene.traverse((o) => {
        const m = o as Mesh
        m.geometry?.dispose()
        const mat = m.material as MeshStandardMaterial | undefined
        mat?.map?.dispose()
        mat?.dispose?.()
      })
      renderer.dispose()
    },
  }
}
