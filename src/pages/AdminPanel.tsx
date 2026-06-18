import { useState, useEffect, useMemo } from 'react'
import { useCourse } from '../context/CourseContext'
import { usePageNavigate } from '../hooks/usePageNavigate'
import { supabase } from '../utils/supabase'
import { getAssetUrl } from '../utils/assets'

interface ParticipantRecord {
  userName: string
  startedAt: string | null
  completedAt: string | null
  evaluationScore?: number
  evaluationFailed?: boolean
  completedLessonsCount: number
  lastUpdated: string
}

export function AdminPanel() {
  const navigate = usePageNavigate()
  const { resetUserEvaluation } = useCourse()
  const [participants, setParticipants] = useState<ParticipantRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'date'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Auth States
  const [session, setSession] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant: 'info' | 'danger'
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
    onConfirm: () => {},
  })

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load records from Supabase with LocalStorage fallback
  const loadRecords = async () => {
    if (!session) return // Don't fetch if not logged in
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('last_updated', { ascending: false })

      if (error) {
        throw error
      }

      if (data) {
        const mapped: ParticipantRecord[] = data.map((p: any) => ({
          userName: p.user_name,
          startedAt: p.started_at,
          completedAt: p.completed_at,
          evaluationScore: p.evaluation_score ?? undefined,
          evaluationFailed: p.evaluation_failed ?? undefined,
          completedLessonsCount: p.completed_lessons_count,
          lastUpdated: p.last_updated,
        }))
        setParticipants(mapped)
        localStorage.setItem('bpm-capacitaciones-all-participants', JSON.stringify(mapped))
      }
    } catch (e) {
      console.error('Error al cargar desde Supabase, usando LocalStorage:', e)
      const saved = localStorage.getItem('bpm-capacitaciones-all-participants')
      if (saved) {
        setParticipants(JSON.parse(saved))
      } else {
        setParticipants([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Load records once session is ready
  useEffect(() => {
    if (session) {
      loadRecords()
    }
  }, [session])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSigningIn(true)
    setAuthError('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setSession(data.session)
    } catch (err: any) {
      setAuthError(err.message || 'Error al iniciar sesión. Verifique sus credenciales.')
    } finally {
      setSigningIn(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  // Stats calculations
  const stats = useMemo(() => {
    const total = participants.length
    const passed = participants.filter(p => p.evaluationFailed === false).length
    const failed = participants.filter(p => p.evaluationFailed === true).length
    const inProgress = total - passed - failed
    
    // Average score of completed tests
    const scores = participants
      .map(p => p.evaluationScore)
      .filter((s): s is number => s !== undefined)
    const avgScore = scores.length > 0 
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) 
      : '0'

    return { total, passed, failed, inProgress, avgScore }
  }, [participants])

  // Handle single user evaluation reset
  const handleReset = (userName: string) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Reiniciar Examen?',
      message: `¿Estás seguro de que deseas reiniciar la evaluación para ${userName}? Esto borrará su calificación reprobada anterior para que pueda intentar el examen nuevamente.`,
      variant: 'info',
      onConfirm: () => {
        resetUserEvaluation(userName)
        setParticipants(prev =>
          prev.map(p =>
            p.userName === userName
              ? { ...p, evaluationScore: undefined, evaluationFailed: undefined, lastUpdated: new Date().toISOString() }
              : p
          )
        )
      }
    })
  }

  // Delete worker record completely
  const handleDeleteRecord = (userName: string) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar Registro?',
      message: `¿Estás seguro de que querés eliminar por completo el registro de ${userName}? Se borrará todo su progreso y calificación de forma permanente en la base de datos.`,
      variant: 'danger',
      onConfirm: async () => {
        setParticipants(prev => prev.filter(p => p.userName !== userName))
        try {
          const saved = localStorage.getItem('bpm-capacitaciones-all-participants')
          if (saved) {
            const list = JSON.parse(saved)
            const filtered = list.filter((p: any) => p.userName !== userName)
            localStorage.setItem('bpm-capacitaciones-all-participants', JSON.stringify(filtered))
            
            const activeProgressStr = localStorage.getItem('bpm-mi-gusto-progress')
            if (activeProgressStr) {
              const activeProgress = JSON.parse(activeProgressStr)
              if (activeProgress.userName === userName) {
                localStorage.removeItem('bpm-mi-gusto-progress')
                window.location.reload()
                return
              }
            }
          }
        } catch (e) {
          console.error(e)
        }

        const { error } = await supabase
          .from('participants')
          .delete()
          .eq('user_name', userName)

        if (error) {
          console.error('Error al eliminar en Supabase:', error)
          loadRecords()
        }
      }
    })
  }

  // Clear all data
  const handleClearAll = () => {
    setConfirmModal({
      isOpen: true,
      title: '⚠️ Borrar Todos los Registros',
      message: '¿Estás seguro de que querés borrar TODOS los registros de capacitación de la base de datos local y remota? Esta acción es irreversible.',
      variant: 'danger',
      onConfirm: async () => {
        localStorage.removeItem('bpm-capacitaciones-all-participants')
        localStorage.removeItem('bpm-mi-gusto-progress')
        
        try {
          const { error } = await supabase
            .from('participants')
            .delete()
            .neq('user_name', '')

          if (error) {
            console.error('Error al vaciar base de datos en Supabase:', error)
          }
        } catch (e) {
          console.error(e)
        }
        
        window.location.reload()
      }
    })
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (participants.length === 0) return
    const headers = 'Trabajador,Fecha Inicio,Fecha Fin,Correctas (de 15),Estado,Ultima Actualizacion\n'
    const rows = participants.map(p => {
      const status = p.evaluationFailed === false
        ? 'Aprobado'
        : p.evaluationFailed === true
        ? 'No Aprobado'
        : 'En curso'
      const start = p.startedAt ? new Date(p.startedAt).toLocaleString() : '-'
      const end = p.completedAt ? new Date(p.completedAt).toLocaleString() : '-'
      const score = p.evaluationScore !== undefined ? p.evaluationScore : '-'
      return `"${p.userName}","${start}","${end}","${score}","${status}","${new Date(p.lastUpdated).toLocaleString()}"`
    }).join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `capacitaciones_migusto_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered and Sorted list
  const filteredAndSorted = useMemo(() => {
    let result = participants.filter(p => 
      p.userName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    result.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') {
        comparison = a.userName.localeCompare(b.userName)
      } else if (sortBy === 'score') {
        const scoreA = a.evaluationScore ?? -1
        const scoreB = b.evaluationScore ?? -1
        comparison = scoreA - scoreB
      } else if (sortBy === 'date') {
        const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0
        const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0
        comparison = dateA - dateB
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [participants, searchQuery, sortBy, sortOrder])

  const toggleSort = (field: 'name' | 'score' | 'date') => {
    if (sortBy === field) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-dvh bg-gradient-dark text-text-primary flex flex-col justify-center items-center gap-4">
        <div className="text-4xl animate-spin">🔄</div>
        <p className="text-sm text-text-secondary">Verificando sesión administrativa...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-dvh bg-gradient-dark text-text-primary px-4 py-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-glow flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src={getAssetUrl('/Logo Mi Gusto 2025.png')}
              alt="Mi Gusto Logo"
              className="h-10 w-auto object-contain"
            />
            <p className="text-xs text-brand-400 font-extrabold uppercase tracking-wider">Área de Supervisión</p>
            <h1 className="text-xl font-black text-white">Ingreso Consola de Control</h1>
            <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
              Iniciá sesión con tu cuenta de supervisor para acceder al panel de calificaciones y control.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supervisor@migusto.com.ar"
                required
                className="w-full bg-surface border border-surface-border/60 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface border border-surface-border/60 focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
              />
            </div>

            {authError && (
              <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg">
                ⚠️ {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-glow flex justify-center items-center gap-2"
            >
              {signingIn ? 'Iniciando sesión... 🔄' : 'Ingresar 🚀'}
            </button>
          </form>

          <div className="border-t border-surface-border/50 pt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-text-muted hover:text-white transition-colors"
            >
              🏠 Volver al inicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gradient-dark text-text-primary px-4 py-8 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-surface-border/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 bg-surface-card hover:bg-surface-elevated border border-surface-border/50 rounded-xl text-text-muted hover:text-white transition-colors"
              title="Volver al Panel Principal"
            >
              ⬅️
            </button>
            <div>
              <p className="text-xs text-brand-400 font-extrabold uppercase tracking-wider">Área de Supervisión</p>
              <h1 className="text-2xl font-black text-white">Consola de Control y Sesiones</h1>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportCSV}
              disabled={participants.length === 0}
              className="text-xs font-bold bg-brand-600/10 hover:bg-brand-600/20 text-brand-300 border border-brand-500/30 px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              📥 Exportar CSV
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs font-bold border border-red-500/30 hover:bg-red-500/10 text-red-400 px-4 py-2.5 rounded-lg transition-colors"
            >
              🗑️ Limpiar DB
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-bold bg-surface-card hover:bg-surface-elevated border border-surface-border text-text-muted hover:text-white px-4 py-2.5 rounded-lg transition-colors"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Dashboard statistics cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-surface-card border border-surface-border rounded-xl p-4 text-left">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Total Evaluados</span>
            <h3 className="text-2xl font-black text-white mt-1">{stats.total}</h3>
          </div>
          <div className="bg-brand-600/10 border border-brand-500/30 rounded-xl p-4 text-left">
            <span className="text-xs text-brand-300 font-semibold uppercase tracking-wider">Aprobados</span>
            <h3 className="text-2xl font-black text-brand-400 mt-1">{stats.passed}</h3>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-left">
            <span className="text-xs text-red-300 font-semibold uppercase tracking-wider">No Aprobados</span>
            <h3 className="text-2xl font-black text-red-400 mt-1">{stats.failed}</h3>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-left">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">En Progreso</span>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{stats.inProgress}</h3>
          </div>
          <div className="bg-surface-card border border-surface-border rounded-xl p-4 text-left col-span-2 md:col-span-1">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Promedio Gral.</span>
            <h3 className="text-2xl font-black text-brand-400 mt-1">{stats.avgScore} <span className="text-xs text-text-muted">/15</span></h3>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 flex flex-col gap-4">
          
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar trabajador por nombre..."
                className="w-full bg-surface border border-surface-border/60 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 text-white"
              />
            </div>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => toggleSort('name')}
                className={`px-3 py-2.5 rounded-lg border transition-all ${
                  sortBy === 'name' ? 'bg-brand-600/10 border-brand-500 text-brand-400' : 'bg-surface border-surface-border text-text-muted hover:text-white'
                }`}
              >
                Sort Nombre {sortBy === 'name' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </button>
              <button
                onClick={() => toggleSort('score')}
                className={`px-3 py-2.5 rounded-lg border transition-all ${
                  sortBy === 'score' ? 'bg-brand-600/10 border-brand-500 text-brand-400' : 'bg-surface border-surface-border text-text-muted hover:text-white'
                }`}
              >
                Sort Nota {sortBy === 'score' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </button>
              <button
                onClick={() => toggleSort('date')}
                className={`px-3 py-2.5 rounded-lg border transition-all ${
                  sortBy === 'date' ? 'bg-brand-600/10 border-brand-500 text-brand-400' : 'bg-surface border-surface-border text-text-muted hover:text-white'
                }`}
              >
                Sort Fecha {sortBy === 'date' ? (sortOrder === 'asc' ? '🔼' : '🔽') : ''}
              </button>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto rounded-xl border border-surface-border/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-surface-border text-xs text-text-muted uppercase font-bold tracking-wider">
                  <th className="px-5 py-3.5">Trabajador</th>
                  <th className="px-5 py-3.5 text-center">Estado</th>
                  <th className="px-5 py-3.5 text-center">Nota (de 15)</th>
                  <th className="px-5 py-3.5">Registro Inicial</th>
                  <th className="px-5 py-3.5">Último Cambio</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/40 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-text-muted">
                      Cargando registros de capacitación... 🔄
                    </td>
                  </tr>
                ) : filteredAndSorted.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-text-muted">
                      No se encontraron registros de capacitación.
                    </td>
                  </tr>
                ) : (
                  filteredAndSorted.map((p) => {
                    const isPassed = p.evaluationFailed === false
                    const isFailed = p.evaluationFailed === true
                    const isInProgress = !isPassed && !isFailed

                    return (
                      <tr key={p.userName} className="hover:bg-surface-elevated/20 transition-colors">
                        {/* Name */}
                        <td className="px-5 py-4 font-bold text-white">
                          {p.userName}
                        </td>
                        {/* Status badge */}
                        <td className="px-5 py-4 text-center">
                          {isPassed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400">
                              🟢 APROBADO
                            </span>
                          ) : isFailed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                              🔴 NO APROBADO
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                              🟡 EN CURSO
                            </span>
                          )}
                        </td>
                        {/* Score */}
                        <td className="px-5 py-4 text-center font-bold">
                          {p.evaluationScore !== undefined ? (
                            <span className={isPassed ? 'text-brand-400' : 'text-red-400'}>
                              {p.evaluationScore} / 15
                            </span>
                          ) : (
                            <span className="text-text-muted">-</span>
                          )}
                        </td>
                        {/* Start Date */}
                        <td className="px-5 py-4 text-xs text-text-secondary">
                          {p.startedAt ? new Date(p.startedAt).toLocaleString() : '-'}
                        </td>
                        {/* Last Update */}
                        <td className="px-5 py-4 text-xs text-text-secondary">
                          {p.lastUpdated ? new Date(p.lastUpdated).toLocaleString() : '-'}
                        </td>
                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {isFailed && (
                              <button
                                onClick={() => handleReset(p.userName)}
                                className="text-xs bg-brand-600/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1.5 rounded-lg transition-all font-bold"
                                title="Habilitar al trabajador a tomar el examen nuevamente"
                              >
                                🔄 Dar otra Oportunidad
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteRecord(p.userName)}
                              className="text-xs hover:bg-red-500/10 text-red-400 border border-transparent hover:border-red-500/20 px-2.5 py-1.5 rounded-lg transition-all"
                              title="Borrar registro completo de este trabajador"
                            >
                              ✕ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reusable Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-md p-6 shadow-glow relative animate-scale-in">
            <div className="flex flex-col items-center text-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-glow ${
                confirmModal.variant === 'danger' 
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                  : 'bg-brand-500/10 border border-brand-500/30 text-brand-400'
              }`}>
                {confirmModal.variant === 'danger' ? '⚠️' : '🔄'}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{confirmModal.title}</h3>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 bg-surface border border-surface-border hover:bg-surface-elevated text-text-secondary hover:text-white py-3 rounded-xl text-xs font-bold transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm()
                    setConfirmModal(prev => ({ ...prev, isOpen: false }))
                  }}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all shadow-glow text-white ${
                    confirmModal.variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-500'
                      : 'bg-brand-600 hover:bg-brand-500'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
