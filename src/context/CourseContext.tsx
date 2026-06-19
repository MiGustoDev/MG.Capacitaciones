import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { ProgressState, Course } from '../data/types'
import { COURSES_DATA, getFlatLessons, getTotalLessons } from '../data/course'
import { supabase } from '../utils/supabase'

const GLOBAL_USERNAME_KEY = 'bpm-mi-gusto-global-username'
const ACTIVE_TRAINING_KEY = 'bpm-mi-gusto-active-training-id'

const defaultProgressFor = (trainingId: string, userName?: string): ProgressState => {
  const course = COURSES_DATA[trainingId] || COURSES_DATA.calidad
  return {
    completedLessons: [],
    currentModuleId: course.modules[0].id,
    currentLessonId: course.modules[0].lessons[0].id,
    startedAt: new Date().toISOString(),
    completedAt: null,
    userName: userName || undefined,
    trainingId,
  }
}

interface CourseContextValue {
  progress: ProgressState
  courseData: Course
  totalLessons: number
  completedCount: number
  percentComplete: number
  isLessonCompleted: (lessonId: string) => boolean
  markCurrentComplete: () => void
  goToLesson: (moduleId: string, lessonId: string) => void
  resetProgress: () => void
  isEvaluationActive: boolean
  setIsEvaluationActive: (active: boolean) => void
  setUserName: (name: string, trainingId?: string) => void
  setEvaluationResult: (score: number, failed: boolean) => void
  resetUserEvaluation: (userName: string, trainingId: string) => void
  selectTraining: (trainingId: string) => void
  logout: () => void
}

const CourseContext = createContext<CourseContextValue | null>(null)

export function CourseProvider({ children }: { children: ReactNode }) {
  // Load initial active training and username
  const [activeTrainingId, setActiveTrainingId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_TRAINING_KEY) || 'calidad'
  })

  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const globalUser = localStorage.getItem(GLOBAL_USERNAME_KEY) || ''
      const tId = localStorage.getItem(ACTIVE_TRAINING_KEY) || 'calidad'
      const saved = localStorage.getItem(`bpm-mi-gusto-progress_${tId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure username is synced with global username
        if (globalUser && parsed.userName !== globalUser) {
          parsed.userName = globalUser
        }
        return parsed
      }
      return defaultProgressFor(tId, globalUser)
    } catch {
      const globalUser = localStorage.getItem(GLOBAL_USERNAME_KEY) || ''
      const tId = localStorage.getItem(ACTIVE_TRAINING_KEY) || 'calidad'
      return defaultProgressFor(tId, globalUser)
    }
  })

  const [isEvaluationActive, setIsEvaluationActive] = useState(false)

  // Dynamic course data based on current trainingId in state
  const courseData = COURSES_DATA[progress.trainingId || 'calidad'] || COURSES_DATA.calidad
  const totalLessons = getTotalLessons(courseData)
  const completedCount = progress.completedLessons.length
  const percentComplete = Math.round((completedCount / totalLessons) * 100)

  // Synchronize current progress state to the global participants list
  const saveParticipantToGlobalList = useCallback((state: ProgressState) => {
    if (!state.userName) return
    const data = {
      userName: state.userName,
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      evaluationScore: state.evaluationScore,
      evaluationFailed: state.evaluationFailed,
      completedLessonsCount: state.completedLessons.length,
      lastUpdated: new Date().toISOString(),
      trainingId: state.trainingId || 'calidad'
    }

    try {
      const saved = localStorage.getItem('bpm-capacitaciones-all-participants')
      const list = saved ? JSON.parse(saved) : []
      const index = list.findIndex((p: any) => p.userName === state.userName && p.trainingId === data.trainingId)
      if (index >= 0) {
        list[index] = data
      } else {
        list.push(data)
      }
      localStorage.setItem('bpm-capacitaciones-all-participants', JSON.stringify(list))
    } catch (e) {
      console.error(e)
    }

    // Upsert to Supabase database
    supabase
      .from('participants')
      .upsert({
        user_name: data.userName,
        started_at: data.startedAt,
        completed_at: data.completedAt,
        evaluation_score: data.evaluationScore,
        evaluation_failed: data.evaluationFailed,
        completed_lessons_count: data.completedLessonsCount,
        last_updated: data.lastUpdated,
        training_id: data.trainingId
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error al guardar en Supabase:', error)
        }
      })
  }, [])

  // Persist progress and save to server
  useEffect(() => {
    if (progress.trainingId) {
      localStorage.setItem(`bpm-mi-gusto-progress_${progress.trainingId}`, JSON.stringify(progress))
      saveParticipantToGlobalList(progress)
    }
  }, [progress, saveParticipantToGlobalList])

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
    setProgress(prev => {
      const tId = prev.trainingId || 'calidad'
      return defaultProgressFor(tId, prev.userName)
    })
  }, [])

  const setUserName = useCallback((name: string, trainingId?: string) => {
    const tId = trainingId || activeTrainingId
    localStorage.setItem(GLOBAL_USERNAME_KEY, name)
    localStorage.setItem(ACTIVE_TRAINING_KEY, tId)
    setActiveTrainingId(tId)

    setProgress(prev => {
      // Try to load progress for this trainingId from local storage
      const saved = localStorage.getItem(`bpm-mi-gusto-progress_${tId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...parsed,
          userName: name,
          trainingId: tId,
        }
      }
      return {
        ...defaultProgressFor(tId, name),
        userName: name,
        trainingId: tId,
      }
    })
  }, [activeTrainingId])

  const selectTraining = useCallback((trainingId: string) => {
    localStorage.setItem(ACTIVE_TRAINING_KEY, trainingId)
    setActiveTrainingId(trainingId)
    const globalUser = localStorage.getItem(GLOBAL_USERNAME_KEY) || ''

    setProgress(prev => {
      // First save current training progress
      if (prev.trainingId) {
        localStorage.setItem(`bpm-mi-gusto-progress_${prev.trainingId}`, JSON.stringify(prev))
      }

      // Then load new training progress
      const saved = localStorage.getItem(`bpm-mi-gusto-progress_${trainingId}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (globalUser && parsed.userName !== globalUser) {
          parsed.userName = globalUser
        }
        return parsed
      }
      return defaultProgressFor(trainingId, globalUser)
    })
  }, [])

  const setEvaluationResult = useCallback((score: number, failed: boolean) => {
    setProgress(prev => ({
      ...prev,
      evaluationScore: score,
      evaluationFailed: failed,
      completedAt: !failed ? new Date().toISOString() : prev.completedAt,
    }))
  }, [])

  const resetUserEvaluation = useCallback((targetName: string, trainingId: string) => {
    try {
      const saved = localStorage.getItem('bpm-capacitaciones-all-participants')
      if (saved) {
        const list = JSON.parse(saved)
        const index = list.findIndex((p: any) => p.userName === targetName && p.trainingId === trainingId)
        if (index >= 0) {
          list[index].evaluationFailed = undefined
          list[index].evaluationScore = undefined
          localStorage.setItem('bpm-capacitaciones-all-participants', JSON.stringify(list))
        }
      }
    } catch (e) {
      console.error(e)
    }

    // Reset in Supabase database
    supabase
      .from('participants')
      .update({
        evaluation_score: null,
        evaluation_failed: null,
        last_updated: new Date().toISOString(),
      })
      .eq('user_name', targetName)
      .eq('training_id', trainingId)
      .then(({ error }) => {
        if (error) {
          console.error('Error al reiniciar evaluación en Supabase:', error)
        }
      })

    // Also update current active progress if it's the target user and training
    setProgress(prev => {
      // First, update target course in storage if it is not currently active
      if (prev.trainingId !== trainingId) {
        const saved = localStorage.getItem(`bpm-mi-gusto-progress_${trainingId}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.userName === targetName) {
            parsed.evaluationFailed = undefined
            parsed.evaluationScore = undefined
            localStorage.setItem(`bpm-mi-gusto-progress_${trainingId}`, JSON.stringify(parsed))
          }
        }
      }

      if (prev.userName === targetName && (prev.trainingId || 'calidad') === trainingId) {
        return {
          ...prev,
          evaluationFailed: undefined,
          evaluationScore: undefined,
        }
      }
      return prev
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(GLOBAL_USERNAME_KEY)
    localStorage.removeItem(ACTIVE_TRAINING_KEY)
    
    // Reset state to initial default for 'calidad' without userName
    setProgress(defaultProgressFor('calidad'))
    setActiveTrainingId('calidad')
  }, [])

  return (
    <CourseContext.Provider
      value={{
        progress,
        courseData,
        totalLessons,
        completedCount,
        percentComplete,
        isLessonCompleted,
        markCurrentComplete,
        goToLesson,
        resetProgress,
        isEvaluationActive,
        setIsEvaluationActive,
        setUserName,
        setEvaluationResult,
        resetUserEvaluation,
        selectTraining,
        logout,
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
  const { progress, courseData } = useCourse()
  const flat = getFlatLessons(courseData)
  const lesson = flat.find(
    l => l.moduleId === progress.currentModuleId && l.id === progress.currentLessonId
  )
  const module = courseData.modules.find(m => m.id === progress.currentModuleId)
  return { lesson, module }
}
