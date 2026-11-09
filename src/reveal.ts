import type { Directive } from 'vue'

const io =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io?.unobserve(e.target)
            }
          }
        },
        { rootMargin: '0px 0px -40px 0px' },
      )
    : null

/** v-reveal or v-reveal="120" (delay in ms): fade up once the element scrolls into view. */
export const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    el.classList.add('reveal')
    if (value) el.style.setProperty('--d', `${value}ms`)
    io ? io.observe(el) : el.classList.add('in')
  },
  unmounted(el) {
    io?.unobserve(el)
  },
}
