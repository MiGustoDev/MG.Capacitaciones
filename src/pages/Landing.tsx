import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { usePageNavigate } from '../hooks/usePageNavigate'
import { useCourse } from '../context/CourseContext'
import { COURSES_DATA, getTotalLessons } from '../data/course'
import { getAssetUrl } from '../utils/assets'
import { LessonRenderer } from '../components/course/LessonRenderer'

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
  const { progress, selectTraining, goToLesson } = useCourse()
  const ref = useRef<HTMLDivElement>(null)
  const navigate = usePageNavigate() // for user-triggered navigation (with animation)
  const guardNavigate = useNavigate() // for automatic guard redirect (no animation needed)
  const courseData = COURSES_DATA[trainingId] || COURSES_DATA.calidad
  const totalLessons = getTotalLessons(courseData)



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
  }, [trainingId])

  const handleStart = () => {
    navigate('/curso')
  }

  const isLoaded = progress.trainingId === trainingId
  const hasProgress = isLoaded && progress.completedLessons.length > 0

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



  // Default Landing for non-medicina or medicina main panel
  return (
    <div ref={ref} className="min-h-dvh bg-gradient-dark flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 sm:px-8 flex justify-between items-center border-b border-surface-border/40">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary px-3 py-2 text-base font-bold flex items-center justify-center rounded-xl"
          title="Volver al Portal"
        >
          <span>←</span>
        </button>
        <span className="text-[10px] sm:text-xs text-text-muted font-semibold uppercase tracking-wider text-right truncate max-w-[200px] sm:max-w-none ml-2">
          <span className="sm:hidden">Mi Gusto · Emergencias</span>
          <span className="hidden sm:inline">Mi Gusto · {courseData.subtitle}</span>
        </span>
      </header>

      {/* Hero Header */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 text-center max-w-5xl mx-auto w-full">
        <div className="hero-badge opacity-0 inline-flex items-center gap-2 bg-white/5 border border-slate-500/20 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-3 sm:mb-6">
          <span className="text-brand-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
            Plataforma de Capacitaciones
          </span>
        </div>

        <h1 className="hero-title opacity-0 text-2xl sm:text-fluid-4xl font-extrabold text-text-primary leading-tight text-balance max-w-3xl mx-auto mb-3 sm:mb-4">
          {formatTitle(courseData.title)}
        </h1>

        <p className="hero-sub opacity-0 text-xs sm:text-fluid-base text-text-secondary max-w-xl mx-auto mb-6 leading-relaxed">
          {trainingId === 'medicina'
            ? 'Seleccioná la capacitación asignada para registrarte e iniciar tu entrenamiento. Recordá que podés ingresar a cualquiera de los módulos para estudiar su contenido libremente.'
            : courseData.id === 'calidad'
            ? 'Garantizamos la elaboración de alimentos seguros para el consumidor mediante el control del personal, las instalaciones y las operaciones.'
            : 'Garantizamos la excelencia y trazabilidad del producto mediante controles específicos en cada etapa y puesto del sector.'}
        </p>

        {/* CTA only for non-medicina courses */}
        {trainingId !== 'medicina' && (
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
        )}

        {/* Objectives only for non-medicina courses */}
        {trainingId !== 'medicina' && (
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
        )}

        {/* Module panel grid - Hub style matching screenshot */}
        <div className="w-full max-w-5xl my-2 sm:my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 w-full">
            {courseData.modules.filter(m => m.lessons.some(l => l.type !== 'closing')).map(mod => (
              <button
                key={mod.id}
                onClick={() => {
                  goToLesson(mod.id, mod.lessons[0]?.id)
                  navigate(`/${trainingId}/modulo/${mod.id}`)
                }}
                className="module-card opacity-0 text-left rounded-2xl border border-surface-border/80 bg-surface-card hover:border-red-500/80 hover:bg-surface-elevated p-4 sm:p-6 flex flex-col justify-between h-auto min-h-[140px] sm:h-56 transition-all duration-300 relative group overflow-hidden shadow-xl cursor-pointer"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex justify-between items-start w-full relative z-10">
                  <span className="text-3xl sm:text-4xl bg-surface/60 p-2 sm:p-2.5 rounded-xl border border-surface-border/40">
                    {mod.icon}
                  </span>
                  <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-red-500/40 bg-red-500/15 text-red-400">
                    Disponible
                  </span>
                </div>

                <div className="mt-3 sm:mt-4 relative z-10">
                  <h3 className="text-sm sm:text-lg font-black text-text-primary group-hover:text-red-400 transition-colors leading-tight">
                    {mod.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed line-clamp-2 font-medium">
                    {mod.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-border py-4 text-center">
        <p className="text-xs text-text-muted">Desarrollado por el Departamento de sistemas de Mi Gusto</p>
      </footer>
    </div>
  )
}
