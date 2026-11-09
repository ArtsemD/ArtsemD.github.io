import type { Directive } from 'vue'

/**
 * v-scroll3d="'flip' | 'zoom'": a transform tied to the element's scroll position, so it
 * plays forward as the element comes up the screen and backward when you scroll back.
 *  flip: the screenshot rises out of a tilt like a laptop lid opening, and comes closer.
 *  zoom: the image starts magnified and settles to its real size.
 */
type Mode = 'flip' | 'zoom'

const items = new Map<HTMLElement, Mode>()
let queued = false

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function update() {
  queued = false
  const vh = innerHeight
  for (const [el, mode] of items) {
    const r = el.getBoundingClientRect()
    if (r.bottom < -200 || r.top > vh + 200) continue
    // 0 when the top edge enters at the bottom of the screen, 1 when it reaches 30% from the top
    const p = easeOut(Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7))))
    if (mode === 'flip') {
      el.style.transform = `perspective(1600px) translateY(${(1 - p) * 90}px) rotateX(${(1 - p) * 52}deg) scale(${0.8 + 0.2 * p})`
      el.style.opacity = String(0.25 + 0.75 * p)
    } else {
      el.style.transform = `scale(${1.3 - 0.3 * p})`
    }
  }
}

const schedule = () => {
  if (!queued) {
    queued = true
    requestAnimationFrame(update)
  }
}

let listening = false
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

export const scroll3d: Directive<HTMLElement, Mode> = {
  mounted(el, { value }) {
    if (reduced()) return
    el.style.willChange = 'transform'
    if (value === 'flip') el.style.transformOrigin = '50% 100%'
    items.set(el, value)
    if (!listening) {
      listening = true
      addEventListener('scroll', schedule, { passive: true })
      addEventListener('resize', schedule, { passive: true })
    }
    schedule()
  },
  unmounted(el) {
    items.delete(el)
  },
}
