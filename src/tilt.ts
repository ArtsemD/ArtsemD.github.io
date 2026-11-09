import type { Directive } from 'vue'

/** v-tilt: the element turns a few degrees toward the pointer, in 3D. */
export const tilt: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    if (matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return
    const max = value ?? 6
    el.classList.add('tilt')
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      el.style.setProperty('--ry', `${x * max}deg`)
      el.style.setProperty('--rx', `${-y * max}deg`)
    }
    const leave = () => {
      el.style.setProperty('--ry', '0deg')
      el.style.setProperty('--rx', '0deg')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
  },
}
