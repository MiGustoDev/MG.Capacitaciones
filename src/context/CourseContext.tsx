import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { ProgressState } from '../data/types'
import { COURSE_DATA, getFlatLessons, getTotalLessons } from '../data/course'

const STORAGE_KEY = 'bpm-mi-gusto-progress'

const defaultProgress: ProgressState = {
  completedLessons: [],
  currentModuleId: COURSE_DATA.modules[0].id,
  currentLessonId: COURSE_DATA.modules[0].lessons[0].id,
  startedAt: null,
  completedAt: null,
}

interface CourseContextValue {
  progress: ProgressState
  totalLessons: number
  completedCount: number
  percentComplete: number
  isLessonCompleted: (lessonId: string) => boolean
  markCurrentComplete: () => void
  goToLesson: (moduleId: string, lessonId: string) => void
  resetProgress: () => void
}

const CourseContext = createContext<CourseContextValue | null>(null)

export function CourseProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : { ...defaultProgress, startedAt: new Date().toISOString() }
    } catch {
      return { ...defaultProgress, startedAt: new Date().toISOString() }
    }
  })

  const totalLessons = getTotalLessons()
  const completedCount = progress.completedLessons.length
  const percentComplete = Math.round((completedCount / totalLessons) * 100)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const isLessonCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  )

  const markCurrentComplete = useCallback(() => {
    setProgress(prev => {
      const { currentLessonId, completedLessons } = prev
      if (completedLessons.includes(currentLessonId)) return prev
      const next = [...completedLessons, currentLessonId]
      const allDone = next.length === totalLessons
      return {
        ...prev,
        completedLessons: next,
        completedAt: allDone ? new Date().toISOString() : prev.completedAt,
      }
    })
  }, [totalLessons])

  const goToLesson = useCallback((moduleId: string, lessonId: string) => {
    setProgress(prev => ({
      ...prev,
      currentModuleId: moduleId,
      currentLessonId: lessonId,
    }))
  }, [])

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress, startedAt: new Date().toISOString() }
    setProgress(fresh)
  }, [])

  return (
    <CourseContext.Provider
      value={{
        progress,
        totalLessons,
        completedCount,
        percentComplete,
        isLessonCompleted,
        markCurrentComplete,
        goToLesson,
        resetProgress,
      }}
    >
      {children}
    </CourseContext.Provider>
  )
}

export function useCourse() {
  const ctx = useContext(CourseContext)
  if (!ctx) throw new Error('useCourse must be used inside CourseProvider')
  return ctx
}

/** Hook auxiliar: retorna info del módulo y lección actual */
export function useCurrentLesson() {
  const { progress } = useCourse()
  const flat = getFlatLessons()
  const lesson = flat.find(
    l => l.moduleId === progress.currentModuleId && l.id === progress.currentLessonId
  )
  const module = COURSE_DATA.modules.find(m => m.id === progress.currentModuleId)
  return { lesson, module }
}
