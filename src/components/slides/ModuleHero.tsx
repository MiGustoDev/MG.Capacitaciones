import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { LessonContent } from '../../data/types'
import type { Module } from '../../data/types'

interface ModuleHeroProps {
  content: LessonContent
  module: Module
}

export function ModuleHero({ content, module }: ModuleHeroProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo('.mh-icon', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        .fromTo('.mh-text', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
    }, ref)
    return () => ctx.revert()
  }, [module.id])

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center gap-6 py-8 w-full">
      {/* Module number pill */}
      <div className="mh-icon opacity-0">
        <div className="relative inline-flex">
          <div className="w-24 h-24 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
            <span className="text-5xl" role="img" aria-label={module.title}>{module.icon}</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface flex items-center justify-center
                          border-2 border-brand-600 text-brand-400 text-xs font-bold">
            {module.number}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="mh-text opacity-0 text-brand-400 text-sm font-semibold tracking-widest uppercase">
          {content.subtitle}
        </p>
        <h2 className="mh-text opacity-0 text-fluid-5xl font-extrabold text-text-primary">
          {content.title}
        </h2>
        <p className="mh-text opacity-0 lesson-description max-w-lg mx-auto">
          {content.description}
        </p>
        {content.tagline && (
          <p className="mh-text opacity-0 text-text-muted text-sm">
            {content.tagline}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="mh-text opacity-0 w-24 h-1 rounded-full bg-brand-600 mt-2" />
    </div>
  )
}
