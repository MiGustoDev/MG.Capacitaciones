import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { usePageNavigate } from '../hooks/usePageNavigate'
import { useCourse } from '../context/CourseContext'

const MODULE_COLORS: Record<string, string> = {
  intro: 'border-brand-600/40 bg-brand-600/10',
  personal: 'border-blue-500/40 bg-blue-500/10',
  instalaciones: 'border-amber-500/40 bg-amber-500/10',
  operaciones: 'border-purple-500/40 bg-purple-500/10',
  cierre: 'border-brand-600/40 bg-brand-600/10',
  // Armado
  checker: 'border-blue-500/40 bg-blue-500/10',
  tapero: 'border-amber-500/40 bg-amber-500/10',
  sacador: 'border-purple-500/40 bg-purple-500/10',
  cargador: 'border-amber-500/40 bg-amber-500/10',
  libero: 'border-brand-600/40 bg-brand-600/10',
}

const MODULE_TEXT: Record<string, string> = {
  intro: 'text-brand-400',
  personal: 'text-blue-400',
  instalaciones: 'text-amber-400',
  operaciones: 'text-purple-400',
  cierre: 'text-brand-400',
  // Armado
  checker: 'text-blue-400',
  tapero: 'text-amber-400',
  sacador: 'text-purple-400',
  cargador: 'text-amber-400',
  libero: 'text-brand-400',
}

const OBJECTIVE_ICONS = ['🎯', '🛡️', '⚖️', '📋', '✅', '⭐']

interface LandingProps {
  trainingId: string
}

export function Landing({ trainingId }: LandingProps) {
  const navigate = usePageNavigate() // for user-triggered navigation (with animation)
  const guardNavigate = useNavigate() // for automatic guard redirect (no animation needed)
  const { progress, courseData, selectTraining, totalLessons } = useCourse()
  const ref = useRef<HTMLDivElement>(null)

  // Ensure active training matches the route/prop
  useEffect(() => {
    selectTraining(trainingId)
  }, [trainingId, selectTraining])

  useEffect(() => {
    if (!progress.userName) {
      guardNavigate('/', { replace: true })
    }
  }, [progress.userName, guardNavigate])

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.timeline()
        .fromTo('.hero-badge', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo('.hero-title', { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' }, '-=0.2')
        .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
        .fromTo('.hero-objectives', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.2')
        .fromTo('.module-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3')
    }, ref)
    return () => ctx.revert()
  }, [trainingId]) // Re-run animation when trainingId changes

  const handleStart = () => {
    navigate('/curso')
  }

  const hasProgress = progress.completedLessons.length > 0

  // Format title with gradient last word
  const formatTitle = (title: string) => {
    const words = title.split(' ')
    if (words.length <= 1) {
      return <span className="gradient-text">{title}</span>
    }
    const lastWord = words.pop()
    return (
      <>
        {words.join(' ')}{' '}
        <span className="gradient-text">{lastWord}</span>
      </>
    )
  }

  return (
    <div ref={ref} className="min-h-dvh bg-gradient-dark flex flex-col">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-16 md:py-24 text-center max-w-5xl mx-auto w-full">
        <div className="hero-badge opacity-0 inline-flex items-center gap-2 bg-brand-600/20 border border-brand-600/30 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-8">
          <span className="text-brand-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            Mi Gusto · {courseData.subtitle}
          </span>
        </div>

        <h1 className="hero-title opacity-0 text-3xl sm:text-fluid-5xl font-extrabold text-text-primary leading-tight text-balance max-w-3xl mx-auto mb-4 sm:mb-6">
          {formatTitle(courseData.title)}
        </h1>

        <p className="hero-sub opacity-0 text-sm sm:text-fluid-lg text-text-secondary max-w-xl mx-auto mb-6 sm:mb-10 leading-relaxed">
          {courseData.id === 'calidad'
            ? 'Garantizamos la elaboración de alimentos seguros para el consumidor mediante el control del personal, las instalaciones y las operaciones.'
            : 'Garantizamos la excelencia y trazabilidad del producto mediante controles específicos en cada etapa y puesto del sector.'}
        </p>

        {/* CTA */}
        <div className="hero-cta opacity-0 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <button
            id="btn-start-course"
            onClick={handleStart}
            className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 shadow-glow flex items-center gap-2"
          >
            {hasProgress ? '▶ Continuar capacitación' : '🚀 Comenzar capacitación'}
          </button>
          {hasProgress && (
            <p className="text-text-muted text-xs sm:text-sm">
              Tenés {progress.completedLessons.length} de {totalLessons} lecciones completadas
            </p>
          )}
        </div>

        {/* Objectives */}
        <div className="hero-objectives opacity-0 grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-16 w-full max-w-3xl [&>*:last-child]:col-span-2 [&>*:last-child]:sm:flex-1">
          {courseData.objectives.map((obj, i) => (
            <div
              key={i}
              className="hero-objectives flex-1 bg-surface-card border border-surface-border rounded-xl px-3 py-3 sm:px-5 sm:py-4 text-left"
            >
              <span className="text-lg sm:text-xl mb-1 sm:mb-2 block" aria-hidden="true">
                {OBJECTIVE_ICONS[i] || '🎯'}
              </span>
              <p className="text-xs sm:text-sm text-text-secondary leading-snug">{obj}</p>
            </div>
          ))}
        </div>

        {/* Module grid */}
        <div className="w-full max-w-3xl">
          <h2 className="text-base sm:text-fluid-xl font-bold text-text-primary mb-3 sm:mb-6">Contenido del curso</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 [&>*:last-child]:col-span-2 [&>*:last-child]:sm:col-span-1">
            {courseData.modules.map(mod => (
              <div
                key={mod.id}
                className={`module-card opacity-0 border rounded-2xl p-3 sm:p-5 text-left ${MODULE_COLORS[mod.id] ?? 'border-surface-border bg-surface-card'}`}
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-xl sm:text-2xl" aria-hidden="true">{mod.icon}</span>
                  <div>
                    <p className="text-[9px] sm:text-xs text-text-muted uppercase tracking-wider">Bloque {mod.number}</p>
                    <h3 className={`font-bold text-xs sm:text-fluid-base leading-tight ${MODULE_TEXT[mod.id] ?? 'text-text-primary'}`}>
                      {mod.title}
                    </h3>
                  </div>
                </div>
                <p className="text-[10px] sm:text-sm text-text-secondary leading-snug mb-1 sm:mb-3 line-clamp-2">{mod.description}</p>
                <p className="text-[9px] sm:text-xs text-text-muted">{mod.lessons.length} lecciones</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-5 text-center">
        <p className="text-xs text-text-muted">Desarrollado por el Departamento de sistemas de Mi Gusto</p>
      </footer>
    </div>
  )
}
