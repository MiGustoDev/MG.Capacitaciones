import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageNavigate } from '../hooks/usePageNavigate'
import gsap from 'gsap'
import { useCourse } from '../context/CourseContext'
import { LessonRenderer } from '../components/course/LessonRenderer'
import { Sidebar } from '../components/layout/Sidebar'
import { LessonNav, TopBar } from '../components/layout/LessonNav'

export function Course() {
  const { progress, isEvaluationActive, isLessonCompleted, goToLesson, courseData } = useCourse()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const prevKey = useRef('')
  const navigate = usePageNavigate()   // user-triggered nav
  const guardNavigate = useNavigate()   // guard redirect

  // Resolve current module and lesson
  const module = courseData.modules.find(m => m.id === progress.currentModuleId)
  const lesson = module?.lessons.find(l => l.id === progress.currentLessonId)

  const elapsed = progress.startedAt ? (Date.now() - new Date(progress.startedAt).getTime()) : 0
  const isTimeOut = progress.evaluationFailed === true && elapsed >= 40 * 60 * 1000

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

    // Redirect to evaluation if timed out
    if (isTimeOut && lesson.id !== 'evaluacion-test') {
      const evalModule = courseData.modules.find(m => m.lessons.some(l => l.id === 'evaluacion-test'))
      if (evalModule) {
        goToLesson(evalModule.id, 'evaluacion-test')
      }
      return
    }

    if (lesson.id === 'cierre-equipo' && !isLessonCompleted('evaluacion-test') && progress.evaluationFailed !== false) {
      const evalModule = courseData.modules.find(m => m.lessons.some(l => l.id === 'evaluacion-test'))
      if (evalModule) {
        goToLesson(evalModule.id, 'evaluacion-test')
      }
    }
  }, [progress.userName, module, lesson, guardNavigate, isLessonCompleted, goToLesson, courseData, progress.evaluationFailed, isTimeOut])

  // Slide transition animation when lesson changes
  const lessonKey = `${progress.currentModuleId}-${progress.currentLessonId}`
  useEffect(() => {
    if (!contentRef.current || prevKey.current === lessonKey) return
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
          className={`flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-10 lg:px-12 ${
            shouldHideBars ? 'flex items-start md:items-center justify-center pt-6 md:pt-10' : ''
          }`}
        >
          <div className={shouldHideBars ? 'w-full max-w-3xl' : 'max-w-6xl mx-auto'}>
            <LessonRenderer lesson={lesson} module={module} />
          </div>
        </div>

        {/* Nav bar */}
        {!shouldHideBars && (
          <LessonNav
            currentModuleId={progress.currentModuleId}
            currentLessonId={progress.currentLessonId}
          />
        )}
      </div>
    </div>
  )
}
