import { useState, useEffect } from 'react'
import { useCourse } from '../../context/CourseContext'
import { getNextLesson, getPrevLesson } from '../../data/course'
import { GlobalProgressBar } from '../course/LessonRenderer'
import { getAssetUrl } from '../../utils/assets'

interface LessonNavProps {
  currentModuleId: string
  currentLessonId: string
}

export function LessonNav({ currentModuleId, currentLessonId }: LessonNavProps) {
  const { goToLesson, markCurrentComplete, isLessonCompleted, courseData, progress } = useCourse()
  const prev = getPrevLesson(courseData, currentModuleId, currentLessonId)
  const next = getNextLesson(courseData, currentModuleId, currentLessonId)

  const module = courseData.modules.find(m => m.id === currentModuleId)
  const lesson = module?.lessons.find(l => l.id === currentLessonId)
  const isEvaluation = lesson?.type === 'evaluation'
  const isCompleted = lesson 
    ? (isLessonCompleted(lesson.id) || (lesson.id === 'evaluacion-test' && progress.evaluationFailed === false))
    : false

  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (lesson && !isCompleted && lesson.type !== 'evaluation') {
      setTimeLeft(5) // 5 seconds reading delay
    } else {
      setTimeLeft(0)
    }
  }, [currentLessonId, isCompleted, lesson])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleNext = () => {
    markCurrentComplete()
    if (next) goToLesson(next.moduleId, next.id)
  }

  const handlePrev = () => {
    if (prev) goToLesson(prev.moduleId, prev.id)
  }

  const isNavDisabled = !next || (isEvaluation && !isCompleted) || timeLeft > 0

  return (
    <div className="flex items-center gap-4 py-4 px-4 md:px-6 border-t border-surface-border bg-surface-card/80 backdrop-blur-sm">
      <button
        onClick={handlePrev}
        disabled={!prev}
        className="btn-secondary flex items-center gap-2 text-sm"
        aria-label="Lección anterior"
      >
        <span aria-hidden="true">←</span>
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex-1">
        <GlobalProgressBar />
      </div>

      <button
        onClick={handleNext}
        disabled={isNavDisabled}
        className="btn-primary flex items-center gap-2 text-sm min-w-[100px] justify-center"
        aria-label={next ? 'Siguiente lección' : 'Fin del curso'}
      >
        <span>
          {timeLeft > 0 
            ? `Leer (${timeLeft}s)` 
            : isEvaluation && !isCompleted 
              ? 'Aprobar para continuar' 
              : next 
                ? 'Siguiente' 
                : '¡Finalizar!'}
        </span>
        {timeLeft === 0 && <span aria-hidden="true">{next ? '→' : '🏆'}</span>}
      </button>
    </div>
  )
}

interface TopBarProps {
  currentModuleId: string
  currentLessonId: string
  onMenuToggle: () => void
}

function formatTopBarTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function TopBar({ currentModuleId, currentLessonId, onMenuToggle }: TopBarProps) {
  const { courseData, progress } = useCourse()
  const module = courseData.modules.find(m => m.id === currentModuleId)
  const lesson = module?.lessons.find(l => l.id === currentLessonId)

  const moduleIndex = courseData.modules.findIndex(m => m.id === currentModuleId)
  const lessonIndex = module?.lessons.findIndex(l => l.id === currentLessonId) ?? 0

  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const startedAtVal = progress.startedAt
    if (!startedAtVal || progress.completedAt || progress.evaluationFailed === false) {
      setTimeLeft(0)
      return
    }

    const updateTimer = () => {
      const limit = 40 * 60 * 1000
      const elapsed = Date.now() - new Date(startedAtVal).getTime()
      const remaining = Math.max(0, Math.ceil((limit - elapsed) / 1000))
      setTimeLeft(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [progress.startedAt, progress.completedAt, progress.evaluationFailed])

  return (
    <header className="flex items-center gap-4 px-4 md:px-6 py-3 border-b border-surface-border bg-surface-card/80 backdrop-blur-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-elevated text-text-secondary"
        aria-label="Abrir menú de navegación"
        aria-expanded={false}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-text-muted truncate">
          {module?.icon && (module.icon.startsWith('/') || module.icon.includes('.')) ? (
            <img
              src={getAssetUrl(module.icon)}
              alt=""
              className="w-4 h-4 object-contain select-none pointer-events-none"
            />
          ) : (
            <span aria-hidden="true">{module?.icon}</span>
          )}
          <span>
            {module?.title} · Lección {lessonIndex + 1}/{module?.lessons.length ?? 0}
          </span>
        </div>
        <p className="text-sm font-semibold text-text-primary truncate">
          {lesson?.title}
        </p>
      </div>

      {/* Session Countdown Timer */}
      {timeLeft > 0 && (
        <div
          className={`px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition-all select-none
            ${timeLeft < 180
              ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.2)]'
              : timeLeft < 600
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-surface-elevated border-surface-border text-text-primary'
            }`}
          title="Tiempo restante para completar la capacitación y evaluación"
        >
          <span>⏱️</span>
          <span>{formatTopBarTime(timeLeft)}</span>
        </div>
      )}

      {/* Mi Gusto logo */}
      <img
        src={getAssetUrl('/Logo Mi Gusto 2025.png')}
        alt="Mi Gusto Logo"
        className="h-8 w-auto object-contain flex-shrink-0"
      />
    </header>
  )
}
