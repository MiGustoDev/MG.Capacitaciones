import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useCourse } from '../../context/CourseContext'
import { useGSAPEntrance } from '../../hooks/useGSAPEntrance'
import { getFlatLessons } from '../../data/course'
import { supabase } from '../../utils/supabase'

export function EvaluationSlide() {
  const {
    progress,
    markCurrentComplete,
    isLessonCompleted,
    setIsEvaluationActive,
    setEvaluationResult,
    goToLesson,
    courseData,
    syncProgressWithDatabase
  } = useCourse()
  
  const QUESTIONS = courseData.questions || []
  const passScore = courseData.passScore || 12
  const containerRef = useGSAPEntrance({ y: 20, duration: 0.5 })

  const flat = getFlatLessons(courseData)
  const requiredLessons = flat.filter(l => l.id !== 'evaluacion-test' && l.id !== 'cierre-equipo')
  const completedRequired = requiredLessons.filter(l => isLessonCompleted(l.id)).length
  const isUnlocked = completedRequired === requiredLessons.length

  const stateRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLDivElement>(null)

  const [quizState, setQuizState] = useState<'intro' | 'quiz' | 'results'>('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showReview, setShowReview] = useState(false)
  const [checkingReset, setCheckingReset] = useState(false)
  const [resetCheckMessage, setResetCheckMessage] = useState('')

  const handleCheckReset = async () => {
    if (!progress.userName) return
    setCheckingReset(true)
    setResetCheckMessage('')
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('evaluation_failed')
        .eq('user_name', progress.userName)
        .eq('training_id', progress.trainingId || 'calidad')
        .maybeSingle()

      if (error) throw error

      if (data && data.evaluation_failed === null) {
        await syncProgressWithDatabase()
        setResetCheckMessage('¡Habilitación confirmada! Ya podés realizar la evaluación nuevamente.')
      } else {
        setResetCheckMessage('La evaluación sigue bloqueada. Solicitá habilitación a tu supervisor.')
      }
    } catch (e) {
      console.error(e)
      setResetCheckMessage('Error al conectar con el servidor. Reintentá.')
    } finally {
      setCheckingReset(false)
    }
  }

  /** Animate current panel out, swap state, animate new panel in */
  const transitionTo = useCallback(
    (nextState: 'intro' | 'quiz' | 'results', after?: () => void) => {
      const el = stateRef.current
      if (!el) {
        setQuizState(nextState)
        after?.()
        return
      }
      gsap.to(el, {
        opacity: 0,
        y: -16,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          setQuizState(nextState)
          after?.()
          gsap.fromTo(
            el,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }
          )
        },
      })
    },
    []
  )

  // Calificación
  const correctCount = QUESTIONS.filter((q, index) => answers[index] === q.correctAnswer).length
  const passed = correctCount >= passScore

  const alreadyFailed = progress.evaluationFailed === true
  const scoreToDisplay = alreadyFailed ? (progress.evaluationScore ?? 0) : correctCount
  const isPassedToDisplay = alreadyFailed ? false : passed

  // Si ya estaba aprobado, podemos ofrecer saltar o ver resultados
  const alreadyCompleted = isLessonCompleted('evaluacion-test')

  useEffect(() => {
    return () => {
      setIsEvaluationActive(false)
    }
  }, [setIsEvaluationActive])

  // Si ya reprobó anteriormente, forzamos la pantalla de resultados bloqueada
  useEffect(() => {
    if (alreadyFailed) {
      setQuizState('results')
    }
  }, [alreadyFailed])

  useEffect(() => {
    if (quizState === 'results' && !alreadyFailed) {
      if (passed) {
        markCurrentComplete()
        setEvaluationResult(correctCount, false)
      } else {
        setEvaluationResult(correctCount, true)
      }
    }
  }, [quizState, passed, correctCount, markCurrentComplete, setEvaluationResult, alreadyFailed])

  const handleStart = () => {
    transitionTo('quiz', () => {
      setAnswers({})
      setCurrentIdx(0)
      setIsEvaluationActive(true)
      setShowReview(false)
    })
  }

  const handleSelectOption = (optionIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx
    }))
  }

  /** Slide the question body out/in when navigating between questions */
  const animateQuestion = useCallback((newIdx: number) => {
    const el = questionRef.current
    if (!el) { setCurrentIdx(newIdx); return }
    const direction = newIdx > currentIdx ? 1 : -1
    gsap.to(el, {
      opacity: 0,
      x: direction * -24,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIdx(newIdx)
        gsap.fromTo(
          el,
          { opacity: 0, x: direction * 24 },
          { opacity: 1, x: 0, duration: 0.22, ease: 'power2.out' }
        )
      },
    })
  }, [currentIdx])

  const handlePrevQuestion = () => {
    if (currentIdx > 0) animateQuestion(currentIdx - 1)
  }

  const handleNextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      animateQuestion(currentIdx + 1)
    } else {
      transitionTo('results', () => {
        setIsEvaluationActive(false)
      })
    }
  }

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {/* Animated state panel wrapper */}
      <div ref={stateRef}>
      {/* PANTALLA INICIAL (INTRO) */}
      {quizState === 'intro' && (
        <div className="card flex flex-col gap-6 text-center items-center py-10">
          <div className="w-16 h-16 rounded-full bg-brand-600/20 border border-brand-600/40 flex items-center justify-center text-3xl shadow-glow">
            📝
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-fluid-3xl font-extrabold text-text-primary">
              Evaluación Final de {courseData.title}
            </h2>
            <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
              Es momento de evaluar lo aprendido. <br />
              Para aprobar y finalizar la capacitación, debés responder correctamente la evaluación obligatoria.
            </p>
          </div>

          <div className="w-full max-w-sm bg-surface-elevated/50 border border-surface-border rounded-xl p-5 text-left flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm border-b border-surface-border/50 pb-2">
              <span className="text-text-muted">Total de preguntas:</span>
              <span className="text-text-primary font-bold">{QUESTIONS.length} preguntas</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-surface-border/50 pb-2">
              <span className="text-text-muted">Modalidad:</span>
              <span className="text-text-primary font-bold">Opción Múltiple</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-surface-border/50 pb-2">
              <span className="text-text-muted">Puntaje de aprobación:</span>
              <span className="text-brand-400 font-bold">mínimo {passScore} correctas</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Tiempo estimado:</span>
              <span className="text-text-primary font-bold">10 - 15 minutos</span>
            </div>
          </div>

          <div className="w-full max-w-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 text-left leading-relaxed">
            <span className="text-lg">⚠️</span>
            <span>
              <strong>Aviso importante:</strong> Una vez iniciada la evaluación, <strong>no podrás salir de ella, cerrar el menú ni navegar por otros contenidos</strong> hasta que la completes de corrido.
            </span>
          </div>

          {alreadyCompleted && (
            <div className="bg-brand-600/20 border border-brand-600/30 text-brand-300 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
              <span>✅</span>
              <span>¡Ya aprobaste esta evaluación anteriormente! Podés volver a realizarla si deseás practicar.</span>
            </div>
          )}

          {!isUnlocked ? (
            <div className="flex flex-col items-center gap-4 mt-2">
              <button
                disabled
                className="btn-secondary bg-surface-elevated text-text-muted border border-surface-border px-8 py-3.5 flex items-center gap-2 cursor-not-allowed opacity-50"
              >
                🔒 Evaluación Bloqueada
              </button>
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-xl max-w-sm flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span className="text-left leading-snug">
                  Debés completar todas las lecciones anteriores antes de comenzar la evaluación ({completedRequired} de {requiredLessons.length} lecciones completadas).
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStart}
              className="btn-primary px-8 py-3.5 shadow-glow mt-2 flex items-center gap-2"
            >
              🚀 Comenzar Evaluación
            </button>
          )}
        </div>
      )}

      {/* PANTALLA DEL QUIZ */}
      {quizState === 'quiz' && (
        <div className="card flex flex-col gap-6">
          {/* Header del Quiz */}
          <div className="flex justify-between items-center border-b border-surface-border pb-4">
            <div className="flex flex-col">
              <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">
                Evaluación {courseData.title}
              </span>
              <h2 className="text-sm text-text-muted mt-0.5">
                Pregunta {currentIdx + 1} de {QUESTIONS.length}
              </h2>
            </div>
            {/* Progreso visual */}
            <div className="w-24 h-2 bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pregunta */}
          {QUESTIONS[currentIdx] && (
            <div ref={questionRef} className="flex flex-col gap-4">
              <h3 className="text-fluid-xl font-bold text-text-primary leading-snug">
                {QUESTIONS[currentIdx].question}
              </h3>
              
              {/* Opciones */}
              <div className="flex flex-col gap-3 mt-2">
                {QUESTIONS[currentIdx].options.map((option, idx) => {
                  const isSelected = answers[currentIdx] === idx
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-fluid-base transition-all duration-150 flex items-start gap-3
                        ${isSelected
                          ? 'border-brand-500 bg-brand-600/20 text-brand-300 font-semibold shadow-glow'
                          : 'border-surface-border bg-surface-elevated hover:bg-surface-border text-text-primary'
                        }`}
                    >
                      <span className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 text-xs
                        ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-text-muted'}`}>
                        {isSelected && '✓'}
                      </span>
                      <span className="leading-tight">{option}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Botones de Navegación del Quiz */}
          <div className="flex justify-between items-center pt-4 border-t border-surface-border mt-4">
            <button
              onClick={handlePrevQuestion}
              disabled={currentIdx === 0}
              className="btn-secondary px-5 py-2.5 text-sm"
            >
              ← Anterior
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={answers[currentIdx] === undefined}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-1.5"
            >
              {currentIdx === QUESTIONS.length - 1 ? 'Finalizar y Calificar 🏆' : 'Siguiente →'}
            </button>
          </div>
        </div>
      )}

      {/* PANTALLA DE RESULTADOS */}
      {quizState === 'results' && (
        <div className="flex flex-col gap-6">
          {/* Tarjeta de resultado principal */}
          <div className={`card text-center flex flex-col items-center gap-5 py-8 border-2 ${
            isPassedToDisplay ? 'border-brand-600 bg-brand-600/10' : 'border-red-500/50 bg-red-500/10'
          }`}>
            <span className="text-6xl">{isPassedToDisplay ? '🏆' : '⚠️'}</span>
            <div className="flex flex-col gap-1">
              <h2 className={`text-fluid-3xl font-extrabold ${isPassedToDisplay ? 'text-brand-400' : 'text-red-400'}`}>
                {isPassedToDisplay ? '¡Evaluación Aprobada!' : 'Capacitación No Aprobada'}
              </h2>
              <p className="text-text-secondary text-sm max-w-md mx-auto px-4 leading-relaxed">
                {isPassedToDisplay
                  ? `Has demostrado conocimientos sólidos sobre ${courseData.title} en Mi Gusto.`
                  : 'No has alcanzado la calificación mínima requerida. Te recomendamos revisar el contenido y solicitar a tu supervisor una oportunidad para volver a intentarlo.'
                }
              </p>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center justify-center bg-surface/50 border border-surface-border/40 rounded-xl px-8 py-4 my-2">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Tu Calificación</p>
              <h3 className={`text-3xl font-black mt-1 ${isPassedToDisplay ? 'text-brand-400' : 'text-red-400'}`}>
                {scoreToDisplay} / {QUESTIONS.length}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                ({QUESTIONS.length > 0 ? Math.round((scoreToDisplay / QUESTIONS.length) * 100) : 0}% de respuestas correctas)
              </p>
            </div>

            {/* Botón de acción */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full justify-center px-4">
              {isPassedToDisplay ? (
                <>
                  <button
                    onClick={() => setShowReview(!showReview)}
                    className="btn-secondary px-6 py-3 flex items-center justify-center gap-2 text-sm"
                  >
                    {showReview ? '🙈 Ocultar Revisión' : '🔍 Revisar Respuestas'}
                  </button>
                  <button
                    onClick={() => {
                      const closeModule = courseData.modules.find(m => m.lessons.some(l => l.id === 'cierre-equipo'))
                      if (closeModule) {
                        goToLesson(closeModule.id, 'cierre-equipo')
                      }
                    }}
                    className="btn-primary px-8 py-3.5 flex items-center justify-center gap-2 text-sm font-black shadow-glow text-white"
                  >
                    🏁 Ir a la Lección Final
                  </button>
                </>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <button
                    onClick={() => {
                      const firstMod = courseData.modules[0]
                      const firstLess = firstMod.lessons[0]
                      goToLesson(firstMod.id, firstLess.id)
                    }}
                    className="btn-secondary px-8 py-3 flex items-center justify-center gap-2 text-sm font-bold w-full sm:w-auto"
                  >
                    📖 Repasar Contenido
                  </button>
                  <button
                    onClick={handleCheckReset}
                    disabled={checkingReset}
                    className="btn-primary px-8 py-3 flex items-center justify-center gap-2 text-sm font-bold w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingReset ? 'Verificando... 🔄' : '🔄 Verificar Habilitación'}
                  </button>
                </div>
              )}
            </div>

            {!isPassedToDisplay && resetCheckMessage && (
              <p className="text-xs text-amber-400 mt-2 font-medium text-center">
                {resetCheckMessage}
              </p>
            )}

            {isPassedToDisplay && (
              <div className="text-xs text-brand-300 bg-brand-500/15 border border-brand-500/30 px-5 py-2.5 rounded-lg max-w-sm mt-3">
                🎉 ¡Felicitaciones! Aprobaste la capacitación. Hacé clic en el botón de arriba para ir a la lección final.
              </div>
            )}
          </div>

          {/* Sección de Revisión de Respuestas */}
          {showReview && (
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="text-fluid-lg font-bold text-text-primary px-2">
                Revisión detallada de preguntas:
              </h3>
              <div className="flex flex-col gap-4">
                {QUESTIONS.map((q, index) => {
                  const userAnswer = answers[index]
                  const isCorrect = userAnswer === q.correctAnswer
                  return (
                    <div
                      key={q.id}
                      className={`card border-l-4 p-5 flex flex-col gap-3 ${
                        isCorrect ? 'border-l-brand-600 bg-surface-card' : 'border-l-red-500 bg-surface-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-fluid-base font-bold text-text-primary leading-snug">
                          {q.id}. {q.question}
                        </h4>
                        <span className={`text-xl flex-shrink-0 ${isCorrect ? 'text-brand-400' : 'text-red-400'}`}>
                          {isCorrect ? '✅ Correcta' : '❌ Incorrecta'}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="text-sm">
                          <span className="text-text-muted">Tu respuesta:</span>{' '}
                          <span className={`font-semibold ${isCorrect ? 'text-brand-400' : 'text-red-400'}`}>
                            {q.options[userAnswer] ?? '(Sin responder)'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-sm">
                            <span className="text-text-muted">Respuesta correcta:</span>{' '}
                            <span className="text-brand-400 font-semibold">
                              {q.options[q.correctAnswer]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
      </div>{/* /stateRef */}
    </div>
  )
}
