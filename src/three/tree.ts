import {
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  Group,
  HemisphereLight,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/**
 * A project's file structure, grown as a tree. Branches grow out of the root, folders
 * pop in as orange blocks, files as paper cards, each with a mono label. The tree turns
 * slowly and leans toward the cursor; hovering a node lifts it.
 */

interface FileNode {
  name: string
  children?: FileNode[]
}

const STRUCTURE: FileNode = {
  name: 'atrium/',
  children: [
    {
      name: 'src/',
      children: [
        { name: 'components/', children: [{ name: 'RunTimeline.vue' }, { name: 'ApprovalDiff.vue' }, { name: 'SpendChart.vue' }] },
        { name: 'composables/', children: [{ name: 'useAgentRun.ts' }, { name: 'useTheme.ts' }] },
        { name: 'tokens/', children: [{ name: 'colors.css' }, { name: 'themes.css' }] },
      ],
    },
    { name: 'stories/', children: [{ name: 'Button.stories.ts' }, { name: 'Timeline.stories.ts' }] },
    { name: 'figma/', children: [{ name: 'Library.fig' }] },
    { name: 'package.json' },
  ],
}

const INK = new Color('#17150f')
const ACCENT = new Color('#ff4f17')
const PAPER = new Color('#fbf9f4')

interface Placed {
  node: FileNode
  depth: number
  pos: Vector3
  angle: number
  start: number // seconds after growth begins
  mesh?: Mesh
  label?: Sprite
  branch?: Mesh
  branchCount?: number
  hover: number
}

function layout(): Placed[] {
  // Tidy tree: leaves spread evenly left to right, each folder sits above the middle of
  // its children, levels rise upward. A gentle z offset gives the tree depth.
  const out: Placed[] = []
  const LEVEL = [0.3, 1.95, 3.45, 4.7]
  const SPACING = 0.54
  let leaf = 0
  const leaves = (n: FileNode): number => (n.children ? n.children.reduce((a, c) => a + leaves(c), 0) : 1)
  const total = leaves(STRUCTURE)
  const walk = (node: FileNode, depth: number, order: number): Placed => {
    let x: number
    const kids: Placed[] = []
    if (node.children) {
      node.children.forEach((c, i) => kids.push(walk(c, depth + 1, order + i)))
      x = (kids[0].pos.x + kids[kids.length - 1].pos.x) / 2
    } else {
      x = (leaf++ - (total - 1) / 2) * SPACING
    }
    const y = LEVEL[depth] + (node.children ? 0 : (leaf % 2) * 0.3) // stagger files
    const z = depth === 0 ? 0 : Math.sin(x * 1.7 + depth * 1.3) * 0.75
    const p: Placed = { node, depth, pos: new Vector3(x, y, z), angle: Math.atan2(z, x), start: 0, hover: 0 }
    out.push(p)
    return p
  }
  walk(STRUCTURE, 0, 0)
  // centre the tree's footprint on x = 0
  const xs = out.map((p) => p.pos.x)
  const mid = (Math.min(...xs) + Math.max(...xs)) / 2
  for (const p of out) p.pos.x -= mid
  // grow from the root outward: start time by depth, then left to right
  for (const p of out) p.start = p.depth * 0.5 + (p.pos.x + 4) * 0.04
  return out.reverse()
}

function labelSprite(text: string, isDir: boolean) {
  const scale = 2
  const font = `500 ${22 * scale}px "JetBrains Mono", ui-monospace, monospace`
  const cv = document.createElement('canvas')
  const ctx = cv.getContext('2d')!
  ctx.font = font
  const w = Math.ceil(ctx.measureText(text).width) + 28 * scale
  const h = 40 * scale
  cv.width = w
  cv.height = h
  ctx.font = font
  ctx.fillStyle = isDir ? 'rgba(23,21,15,0.92)' : 'rgba(250,248,243,0.94)'
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, 10 * scale)
  ctx.fill()
  if (!isDir) {
    ctx.strokeStyle = 'rgba(23,21,15,0.16)'
    ctx.lineWidth = 2
    ctx.stroke()
  }
  ctx.fillStyle = isDir ? '#faf8f3' : '#17150f'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 14 * scale, h / 2 + 1)
  const tex = new CanvasTexture(cv)
  tex.colorSpace = SRGBColorSpace
  tex.minFilter = LinearFilter
  tex.generateMipmaps = false
  const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 })
  const sprite = new Sprite(mat)
  const height = 0.28
  sprite.scale.set((w / h) * height, height, 1)
  sprite.center.set(-0.12, 0.5)
  sprite.renderOrder = 10
  return sprite
}

const easeOutBack = (t: number) => {
  const c = 1.6
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

export function createTree(canvas: HTMLCanvasElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap

  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 100)
  const target = new Vector3(0, 2.45, 0)

  scene.add(new HemisphereLight(0xffffff, 0xe9e5dc, 2.2))
  const sun = new DirectionalLight(0xffffff, 2.4)
  sun.position.set(4, 9, 5)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -5
  sun.shadow.camera.right = 5
  sun.shadow.camera.top = 5
  sun.shadow.camera.bottom = -5
  sun.shadow.radius = 6
  sun.shadow.bias = -0.0005
  scene.add(sun)

  const ground = new Mesh(new PlaneGeometry(30, 30), new ShadowMaterial({ opacity: 0.09 }))
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const tree = new Group()
  scene.add(tree)

  const branchMat = new MeshStandardMaterial({ color: INK, roughness: 0.6 })
  const dirMat = new MeshStandardMaterial({ color: ACCENT, roughness: 0.45 })
  const rootMat = new MeshStandardMaterial({ color: INK, roughness: 0.5 })
  const fileMat = new MeshStandardMaterial({ color: PAPER, roughness: 0.75 })
  const dirGeo = new RoundedBoxGeometry(0.4, 0.3, 0.3, 4, 0.07)
  const fileGeo = new RoundedBoxGeometry(0.24, 0.32, 0.05, 3, 0.025)

  const placed = layout()
  const byNode = new Map(placed.map((p) => [p.node, p]))
  const pickables: Mesh[] = []

  // trunk from the ground to the root node
  {
    const r = placed[0].pos
    const curve = new CatmullRomCurve3([new Vector3(r.x, 0, r.z), new Vector3(r.x + 0.02, r.y * 0.5, r.z), r.clone()])
    const trunk = new Mesh(new TubeGeometry(curve, 8, 0.05, 8), branchMat)
    trunk.castShadow = true
    tree.add(trunk)
  }

  for (const p of placed) {
    const isDir = !!p.node.children
    const mesh = new Mesh(p.depth === 0 ? dirGeo : isDir ? dirGeo : fileGeo, p.depth === 0 ? rootMat : isDir ? dirMat : fileMat)
    mesh.position.copy(p.pos)
    mesh.castShadow = true
    mesh.scale.setScalar(0.0001)
    mesh.userData.placed = p
    tree.add(mesh)
    pickables.push(mesh)
    p.mesh = mesh

    const label = labelSprite(p.node.name, isDir)
    label.position.copy(p.pos).add(new Vector3(0.14, 0.02, 0))
    tree.add(label)
    p.label = label

    for (const kid of p.node.children ?? []) {
      const c = byNode.get(kid)!
      const mid = p.pos.clone().lerp(c.pos, 0.5)
      mid.y = p.pos.y + (c.pos.y - p.pos.y) * 0.25 // branches bow outward, then rise
      const curve = new CatmullRomCurve3([p.pos.clone(), mid, c.pos.clone()])
      const radius = c.depth === 1 ? 0.034 : c.depth === 2 ? 0.024 : 0.016
      const geo = new TubeGeometry(curve, 24, radius, 6)
      const branch = new Mesh(geo, branchMat)
      branch.castShadow = true
      geo.setDrawRange(0, 0)
      tree.add(branch)
      c.branch = branch
      c.branchCount = geo.index!.count
    }
  }

  // input
  const pointer = new Vector2(0, 0)
  const lean = new Vector2(0, 0)
  const ndc = new Vector2(-9, -9)
  const ray = new Raycaster()
  const onMove = (e: PointerEvent) => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1)
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  }
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('pointerdown', onMove, { passive: true })

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // fit the tree's ~7.6 x 4 footprint whatever the canvas proportions
    const fov = 30
    const halfV = Math.tan(((fov / 2) * Math.PI) / 180)
    const dist = Math.max(2.75 / halfV, 3.9 / (halfV * camera.aspect))
    camera.position.set(0, 3.6, dist)
    camera.fov = fov
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)

  let growStart = -1
  let raf = 0
  let last = performance.now()
  let spin = 0

  const update = (now: number, dt: number) => {
    const g = growStart < 0 ? 0 : reduced ? 99 : (now - growStart) / 1000
    for (const p of placed) {
      // branch grows toward the node, then the node pops in, then its label
      if (p.branch) {
        const n = Math.floor(clamp01((g - p.start + 0.5) / 0.5) * p.branchCount!)
        p.branch.geometry.setDrawRange(0, n - (n % 3))
      }
      const k = clamp01((g - p.start) / 0.55)
      const size = 1 + 0.25 * p.hover
      p.mesh!.scale.setScalar(Math.max(0.0001, easeOutBack(k) * size))
      const isFile = !p.node.children
      const showLabel = !isFile || p.hover > 0.01
      const lk = clamp01((g - p.start - 0.25) / 0.5)
      ;(p.label!.material as SpriteMaterial).opacity = showLabel ? lk * (isFile ? p.hover : 1) : 0
      // files float a little
      if (isFile && k >= 1 && !reduced) p.mesh!.position.y = p.pos.y + Math.sin(now / 900 + p.angle * 3) * 0.025
    }
    if (!reduced) {
      spin += dt
      lean.lerp(pointer, 1 - Math.pow(0.02, dt))
    }
    tree.rotation.y = Math.sin(spin * 0.22) * 0.32 + lean.x * 0.3
    camera.position.y = 3.6 + lean.y * 0.6
    camera.lookAt(target)

    // hover
    ray.setFromCamera(ndc, camera)
    const hit = ray.intersectObjects(pickables, false)[0]
    for (const p of placed) {
      const want = hit && hit.object === p.mesh ? 1 : 0
      p.hover += (want - p.hover) * Math.min(1, dt * 10)
    }
    canvas.style.cursor = hit ? 'pointer' : ''
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!visible || document.hidden) return
    update(now, dt)
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(frame)

  // redraw labels once the mono font has loaded
  document.fonts?.load('500 22px "JetBrains Mono"').then(() => {
    for (const p of placed) {
      const fresh = labelSprite(p.node.name, !!p.node.children)
      const old = p.label!
      const oldMat = old.material as SpriteMaterial
      old.material = fresh.material
      old.scale.copy(fresh.scale)
      oldMat.map?.dispose()
      oldMat.dispose()
    }
  })

  return {
    grow() {
      if (growStart < 0) growStart = performance.now()
    },
    dispose() {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerdown', onMove)
      ro.disconnect()
      io.disconnect()
      scene.traverse((o) => {
        const m = o as Mesh
        m.geometry?.dispose()
        const mat = m.material as MeshStandardMaterial | SpriteMaterial | undefined
        if (mat && 'map' in mat) mat.map?.dispose()
        mat?.dispose()
      })
      renderer.dispose()
    },
  }
}
