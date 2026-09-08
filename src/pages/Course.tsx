import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePageNavigate } from '../hooks/usePageNavigate'
import gsap from 'gsap'
import { useCourse } from '../context/CourseContext'
import { LessonRenderer } from '../components/course/LessonRenderer'
import { Sidebar } from '../components/layout/Sidebar'
import { LessonNav, TopBar } from '../components/layout/LessonNav'
import { COURSES_DATA } from '../data/course'

export function Course() {
  const { trainingId: urlTrainingId, moduleId: urlModuleId, lessonId: urlLessonId } = useParams()
  const { progress, selectTraining, goToLesson, isEvaluationActive, isLessonCompleted, courseData } = useCourse()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const prevKey = useRef('')
  const navigate = usePageNavigate()   // user-triggered nav
  const guardNavigate = useNavigate()   // guard redirect

  // If accessed via direct URL, ensure training and module/lesson state are synchronized
  useEffect(() => {
    if (urlTrainingId && urlTrainingId !== progress.trainingId) {
      selectTraining(urlTrainingId)
    }
  }, [urlTrainingId, progress.trainingId, selectTraining])

  useEffect(() => {
    const targetTrainingId = urlTrainingId || progress.trainingId || 'calidad'
    const targetCourse = COURSES_DATA[targetTrainingId] || courseData
    
    if (urlModuleId) {
      const targetMod = targetCourse.modules.find(m => m.id === urlModuleId)
      if (targetMod) {
        const targetLessonId = urlLessonId || targetMod.lessons[0]?.id
        if (targetLessonId && (progress.currentModuleId !== urlModuleId || progress.currentLessonId !== targetLessonId)) {
          goToLesson(urlModuleId, targetLessonId)
        }
      }
    }
  }, [urlModuleId, urlLessonId, urlTrainingId, progress.trainingId, progress.currentModuleId, progress.currentLessonId, goToLesson, courseData])

  // Keep browser URL updated with current training, module, and lesson
  useEffect(() => {
    if (progress.trainingId && progress.currentModuleId && progress.currentLessonId) {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')
      const expectedPath = `${baseUrl}/${progress.trainingId}/modulo/${progress.currentModuleId}/${progress.currentLessonId}`
      if (window.location.pathname !== expectedPath) {
        window.history.replaceState(null, '', expectedPath)
      }
    }
  }, [progress.trainingId, progress.currentModuleId, progress.currentLessonId])

  // Resolve current module and lesson
  const module = courseData.modules.find(m => m.id === progress.currentModuleId)
  const lesson = module?.lessons.find(l => l.id === progress.currentLessonId)

  // If no valid state found or accessing final lesson without passing the exam, redirect
  useEffect(() => {
    if (!progress.userName) {
      guardNavigate('/', { replace: true })
      return
    }
    if (!module || !lesson) {
      guardNavigate('/')
      return
    }

    if (lesson.id === 'cierre-equipo' && !isLessonCompleted('evaluacion-test') && progress.evaluationFailed !== false) {
      const evalModule = courseData.modules.find(m => m.lessons.some(l => l.id === 'evaluacion-test'))
      if (evalModule) {
        goToLesson(evalModule.id, 'evaluacion-test')
      }
    }
  }, [progress.userName, module, lesson, guardNavigate, isLessonCompleted, goToLesson, courseData, progress.evaluationFailed])

  // Slide transition animation and scroll reset when lesson changes
  const lessonKey = `${progress.currentModuleId}-${progress.currentLessonId}`
  useEffect(() => {
    if (!contentRef.current) return

    // Scroll to top immediately when lesson changes
    contentRef.current.scrollTop = 0
    window.scrollTo({ top: 0, behavior: 'instant' })

    if (prevKey.current === lessonKey) return
    prevKey.current = lessonKey

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    )
  }, [lessonKey])

  // Anti-cheat: Disable right click and developer console shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault()
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
        e.preventDefault()
      }
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const isEvaluationLockedMode = progress.currentLessonId === 'evaluacion-test' && !isLessonCompleted('evaluacion-test')
  const shouldHideBars = isEvaluationActive || isEvaluationLockedMode

  if (!module || !lesson) return null

  return (
    <div className="flex h-dvh overflow-hidden bg-surface">
      {/* Sidebar */}
      {!shouldHideBars && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        {!shouldHideBars && (
          <TopBar
            currentModuleId={progress.currentModuleId}
            currentLessonId={progress.currentLessonId}
            onMenuToggle={() => setIsSidebarOpen(prev => !prev)}
          />
        )}

        {/* Lesson content — scrollable */}
        <div
          ref={contentRef}
          className={`flex-1 overflow-y-auto px-4 pb-4 md:px-8 md:pb-10 lg:px-12 relative ${
            shouldHideBars ? 'flex items-start md:items-center justify-center pt-6 md:pt-10' : ''
          }`}
        >
          {/* Botonera de Módulos (Sectores) — Fluye con el scroll */}
          {!shouldHideBars && (
            <div className="-mx-4 sm:-mx-8 lg:-mx-12 mb-2 bg-surface-card/95 border-b border-surface-border/60 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2 relative z-0">
              {courseData.modules.filter(m => m.lessons.some(l => l.type !== 'closing')).map(m => {
                const isActive = m.id === progress.currentModuleId
                return (
                  <button
                    key={m.id}
                    onClick={() => goToLesson(m.id, m.lessons[0].id)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                      isActive
                        ? 'bg-brand-500/20 border-brand-500 text-white shadow-glow scale-[1.02]'
                        : 'bg-surface/40 border-surface-border/50 text-text-secondary hover:border-slate-500/50 hover:bg-surface-elevated hover:text-white'
                    }`}
                  >
                    <span className="text-sm sm:text-base">{m.icon}</span>
                    <span>{m.title}</span>
                  </button>
                )
              })}
            </div>
          )}

          <div className={shouldHideBars ? 'w-full max-w-3xl' : 'max-w-6xl mx-auto'}>
            <LessonRenderer lesson={lesson} module={module} />
          </div>

          {/* Nav bar al final del contenido scrolleable */}
          {!shouldHideBars && (
            <div className="mt-8 pb-4 max-w-6xl mx-auto">
              <LessonNav
                currentModuleId={progress.currentModuleId}
                currentLessonId={progress.currentLessonId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
