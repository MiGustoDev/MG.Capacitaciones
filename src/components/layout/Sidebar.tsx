import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { usePageNavigate } from '../../hooks/usePageNavigate'
import { useCourse } from '../../context/CourseContext'
import { getFlatLessons } from '../../data/course'
import type { Lesson, Module } from '../../data/types'

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

function LessonItem({
  lesson,
  module,
  isCurrent,
  isCompleted,
  isLocked,
  onClick,
}: {
  lesson: Lesson
  module: Module
  isCurrent: boolean
  isCompleted: boolean
  isLocked: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      aria-current={isCurrent ? 'step' : undefined}
      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
        ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}
        ${isCurrent
          ? 'bg-brand-600/20 text-brand-400 font-semibold border border-brand-600/40'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
        }`}
    >
      <span className={`flex-shrink-0 w-5 h-5 rounded-full border text-xs flex items-center justify-center
        ${isCompleted
          ? 'bg-brand-600 border-brand-600 text-white'
          : isLocked
          ? 'border-surface-border text-text-muted bg-surface/50'
          : isCurrent
          ? 'border-brand-600 text-brand-400'
          : 'border-surface-border text-text-muted'
        }`}>
        {isCompleted ? '✓' : isLocked ? '🔒' : ''}
      </span>
      <span className="leading-tight">{lesson.title}</span>
    </button>
  )
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = usePageNavigate()
  const { progress, isLessonCompleted, goToLesson, courseData } = useCourse()
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  // Track whether component has been opened at least once (skip close animation on first render)
  const hasOpenedRef = useRef(false)

  const getGenderIcon = (fullName: string | null | undefined): string => {
    if (!fullName) return '🧑🏻'
    const firstName = fullName.trim().split(/\s+/)[0].toLowerCase()
    const masculineExceptions = ['luca', 'matia', 'elija', 'josua', 'ezra', 'ilia']
    if (masculineExceptions.includes(firstName)) return '👨🏻'
    return firstName.endsWith('a') ? '👩🏻' : '👨🏻'
  }

  /** Animated close: slide panel out, fade overlay, then call onClose */
  const handleClose = () => {
    const panel = panelRef.current
    const overlay = overlayRef.current
    if (!panel || !overlay) {
      onClose?.()
      return
    }
    gsap.to(panel, { x: '-100%', duration: 0.22, ease: 'power3.in' })
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.18,
      ease: 'power2.in',
      delay: 0.04,
      onComplete: () => onClose?.(),
    })
  }

  // Animate the panel in whenever isOpen becomes true
  useEffect(() => {
    const panel = panelRef.current
    const overlay = overlayRef.current
    if (!panel || !overlay) return

    if (isOpen) {
      hasOpenedRef.current = true
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: 'power2.out' })
      gsap.fromTo(panel, { x: '-100%' }, { x: '0%', duration: 0.28, ease: 'power3.out' })
    }
  }, [isOpen])

  const flat = getFlatLessons(courseData)
  const requiredLessons = flat.filter(l => l.id !== 'evaluacion-test' && l.id !== 'cierre-equipo')
  const completedRequired = requiredLessons.filter(l => isLessonCompleted(l.id)).length
  const isUnlocked = completedRequired === requiredLessons.length

  const handleGoToEvaluation = () => {
    const evalModule = courseData.modules.find(m => m.lessons.some(l => l.id === 'evaluacion-test'))
    if (evalModule) {
      goToLesson(evalModule.id, 'evaluacion-test')
    }
    handleClose()
  }

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium flex items-center gap-1 truncate">
            <span>{getGenderIcon(progress.userName)}</span>
            <span className="truncate">{progress.userName || 'Colaborador'}</span>
          </p>
          <h2 className="text-sm font-bold text-text-primary mt-0.5 truncate">
            {courseData.id === 'armado' ? 'Armado' : 'BPM'} · Capacitación
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Botón Inicio */}
          <button
            onClick={() => {
              navigate('/')
              handleClose()
            }}
            title="Volver al inicio"
            className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg shadow-glow"
          >
            <span>🏠</span>
            <span>Inicio</span>
          </button>

          <button
            onClick={handleClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-elevated text-text-secondary"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Module tree */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5" aria-label="Módulos del curso">
        {courseData.modules.map(mod => {
          const completedInModule = mod.lessons.filter(l => isLessonCompleted(l.id)).length
          const isCurrent = mod.id === progress.currentModuleId

          return (
            <div key={mod.id}>
              {/* Module label */}
              <div className={`flex items-center gap-2 px-3 mb-2 ${isCurrent ? 'text-text-primary' : 'text-text-muted'}`}>
                <span className="text-base" aria-hidden="true">{mod.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{mod.title}</span>
                <span className="ml-auto text-xs text-text-muted">
                  {completedInModule}/{mod.lessons.length}
                </span>
              </div>
              {/* Lessons */}
              <div className="flex flex-col gap-1">
                {mod.lessons.map(lesson => {
                  const isLocked = lesson.id === 'cierre-equipo' && !isLessonCompleted('evaluacion-test')
                  
                  return (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      module={mod}
                      isCurrent={
                        lesson.id === progress.currentLessonId &&
                        mod.id === progress.currentModuleId
                      }
                      isCompleted={isLessonCompleted(lesson.id)}
                      isLocked={isLocked}
                      onClick={() => {
                        goToLesson(mod.id, lesson.id)
                        handleClose()
                      }}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer — only Evaluar button, no text */}
      <div className="px-5 py-4 border-t border-surface-border flex justify-center">
        <button
          onClick={handleGoToEvaluation}
          title="Acceder a la evaluación"
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 rounded-lg shadow-glow"
        >
          <span>📝</span>
          <span>Evaluar</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — no animation needed, always visible */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 bg-surface-card border-r border-surface-border h-full overflow-hidden">
        {content}
      </aside>

      {/* Mobile drawer — always in DOM, animated via GSAP */}
      <div
        className={`lg:hidden fixed inset-0 z-50 flex ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Overlay */}
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0"
          onClick={handleClose}
          aria-hidden="true"
        />
        {/* Panel */}
        <aside
          ref={panelRef}
          className="relative w-80 max-w-[85vw] bg-surface-card h-full flex flex-col overflow-hidden z-10 shadow-2xl -translate-x-full"
          style={{ transform: 'translateX(-100%)' }}
        >
          {content}
        </aside>
      </div>
    </>
  )
}
