import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface UseGSAPEntranceOptions {
  delay?: number
  duration?: number
  y?: number
  stagger?: number
}

/**
 * Hook que aplica una animación de entrada fade+translateY a un contenedor.
 * Limpia la animación al desmontar el componente.
 */
export function useGSAPEntrance<T extends HTMLElement = HTMLDivElement>(
  opts: UseGSAPEntranceOptions = {}
) {
  const ref = useRef<T>(null)
  const { delay = 0, duration = 0.6, y = 24, stagger = 0 } = opts

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, delay, ease: 'power2.out' }
      )
    }, ref)
    return () => ctx.revert()
  }, [delay, duration, y, stagger])

  return ref
}

/**
 * Hook para animar una lista de elementos con stagger.
 * Recibe un selector de hijos y aplica fade+translateY escalonado.
 */
export function useGSAPStaggerList<T extends HTMLElement = HTMLUListElement>(
  childSelector = 'li',
  opts: UseGSAPEntranceOptions = {}
) {
  const ref = useRef<T>(null)
  const { delay = 0.2, duration = 0.5, y = 20, stagger = 0.08 } = opts

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `${childSelector}`,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, delay, stagger, ease: 'power2.out' }
      )
    }, ref)
    return () => ctx.revert()
  }, [childSelector, delay, duration, y, stagger])

  return ref
}
