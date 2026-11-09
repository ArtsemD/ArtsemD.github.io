import {
  Color,
  DirectionalLight,
  HemisphereLight,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/**
 * A field of rounded tiles, like keys or design tokens. A slow wave runs across it and
 * the tiles under the cursor rise and turn signal orange.
 */
export function createTiles(canvas: HTMLCanvasElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 200)
  scene.add(new HemisphereLight(0xffffff, 0xd9d3c6, 2.4))
  const sun = new DirectionalLight(0xffffff, 1.6)
  sun.position.set(-6, 12, 8)
  scene.add(sun)

  const COLS = 34
  const ROWS = 14
  const GAP = 1.08
  const count = COLS * ROWS
  const geo = new RoundedBoxGeometry(0.96, 1, 0.96, 3, 0.16)
  geo.translate(0, 0.5, 0) // grow upward from the floor
  const mat = new MeshStandardMaterial({ roughness: 0.7 })
  const mesh = new InstancedMesh(geo, mat, count)
  scene.add(mesh)

  const base = new Color('#ebe7de')
  const accent = new Color('#ff4f17')
  const ink = new Color('#17150f')
  const tmpColor = new Color()
  const dummy = new Object3D()
  const lift = new Float32Array(count)
  const seed = Float32Array.from({ length: count }, (_, i) => Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1))

  const pointer = new Vector3(999, 0, 999)
  const ndc = new Vector2()
  const ray = new Raycaster()
  const floor = new Plane(new Vector3(0, 1, 0), 0)
  let inside = false
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    inside = e.clientY >= r.top && e.clientY <= r.bottom
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    ray.ray.intersectPlane(floor, pointer)
  }
  addEventListener('pointermove', onMove, { passive: true })

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    const fit = Math.max(1, 1.6 / camera.aspect)
    camera.position.set(0, 26 * fit, 20 * fit)
    camera.lookAt(0, 0, 1.5)
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let visible = false
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
  io.observe(canvas)

  let raf = 0
  let last = performance.now()
  const render = (now: number, dt: number) => {
    const t = reduced ? 4 : now / 1000
    for (let r = 0, i = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++, i++) {
        const x = (c - (COLS - 1) / 2) * GAP
        const z = (r - (ROWS - 1) / 2) * GAP
        const wave = 0.5 + 0.5 * Math.sin(x * 0.35 + z * 0.22 - t * 1.1)
        const d = inside ? Math.hypot(x - pointer.x, z - pointer.z) : 99
        const want = Math.max(0, 1 - d / 4.2)
        lift[i] += (want - lift[i]) * Math.min(1, dt * 6)
        const h = 0.25 + wave * 0.35 + lift[i] * 2.4 + seed[i] * 0.08
        dummy.position.set(x, 0, z)
        dummy.scale.set(1, h, 1)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        tmpColor.copy(base)
        if (lift[i] > 0.02) tmpColor.lerp(accent, Math.min(1, lift[i] * 1.6))
        else if (seed[i] > 0.93) tmpColor.lerp(ink, 0.85) // a few dark keys for rhythm
        mesh.setColorAt(i, tmpColor)
      }
    }
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor!.needsUpdate = true
    renderer.render(scene, camera)
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (!visible || document.hidden) return
    render(now, dt)
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    removeEventListener('pointermove', onMove)
    ro.disconnect()
    io.disconnect()
    geo.dispose()
    mat.dispose()
    mesh.dispose()
    renderer.dispose()
  }
}
