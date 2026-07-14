import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useCourse } from '../context/CourseContext'
import { usePageNavigate } from '../hooks/usePageNavigate'
import { getAssetUrl } from '../utils/assets'
import { TRAININGS, type Training } from '../data/trainings'
import { COURSES_DATA, getTotalLessons } from '../data/course'
import { COLLABORATORS } from '../data/collaborators'
import { supabase } from '../utils/supabase'

const getColorClasses = (color: 'white' | 'red' | 'green' | 'yellow' | 'black' | 'blue', active: boolean) => {
  if (!active) {
    return {
      cardClass: 'bg-surface/30 border-surface-border/40 opacity-50 cursor-not-allowed',
      glowClass: '',
      circleStroke: 'stroke-surface-border/30',
      tagClass: 'text-text-muted bg-surface/30 border-surface-border/25',
      titleHoverClass: 'group-hover:text-text-primary'
    }
  }

  switch (color) {
    case 'white':
      return {
        cardClass: 'bg-surface-card hover:bg-surface-elevated border-slate-200/20 hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer hover:-translate-y-1',
        glowClass: 'from-white/5',
        circleStroke: 'stroke-white',
        tagClass: 'text-white bg-white/10 border-white/20',
        titleHoverClass: 'group-hover:text-white'
      }
    case 'red':
      return {
        cardClass: 'bg-surface-card hover:bg-surface-elevated border-red-500/20 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] cursor-pointer hover:-translate-y-1',
        glowClass: 'from-red-500/5',
        circleStroke: 'stroke-red-500',
        tagClass: 'text-red-300 bg-red-500/10 border-red-500/20',
        titleHoverClass: 'group-hover:text-red-400'
      }
    case 'green':
      return {
        cardClass: 'bg-surface-card hover:bg-surface-elevated border-emerald-500/20 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer hover:-translate-y-1',
        glowClass: 'from-emerald-500/5',
        circleStroke: 'stroke-emerald-500',
        tagClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
        titleHoverClass: 'group-hover:text-emerald-400'
      }
    case 'yellow':
      return {
        cardClass: 'bg-surface-card hover:bg-surface-elevated border-amber-500/20 hover:border-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer hover:-translate-y-1',
        glowClass: 'from-amber-500/5',
        circleStroke: 'stroke-amber-500',
        tagClass: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
        titleHoverClass: 'group-hover:text-amber-400'
      }
    case 'black':
      return {
        cardClass: 'bg-surface-card hover:bg-surface-elevated border-slate-800 hover:border-slate-400 hover:shadow-[0_0_15px_rgba(148,163,184,0.1)] cursor-pointer hover:-translate-y-1',
        glowClass: 'from-slate-600/5',
        circleStroke: 'stroke-slate-400',
        tagClass: 'text-slate-300 bg-slate-800/40 border-slate-700',
        titleHoverClass: 'group-hover:text-slate-200'
      }
    case 'blue':
    default:
      return {
        cardClass: 'bg-surface-card hover:bg-surface-elevated border-blue-500/20 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] cursor-pointer hover:-translate-y-1',
        glowClass: 'from-blue-500/5',
        circleStroke: 'stroke-blue-500',
        tagClass: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
        titleHoverClass: 'group-hover:text-blue-400'
      }
  }
}

const LEGAJO_KEY = 'bpm-mi-gusto-legajo'

export function Hub() {
  const navigate = usePageNavigate()
  const { progress, setUserName, logout, updateUserName, trainings } = useCourse()
  const [showModal, setShowModal] = useState(false)
  const [inputName, setInputName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const modalOverlayRef = useRef<HTMLDivElement>(null)
  const modalCardRef = useRef<HTMLDivElement>(null)

  // Autocomplete & PIN flow states
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinFlowMode, setPinFlowMode] = useState<'verify' | 'create' | 'confirm'>('verify')
  const [pendingUserName, setPendingUserName] = useState('')
  const [targetPinCode, setTargetPinCode] = useState('')
  const [pinDigits, setPinDigits] = useState<string[]>([])
  const [tempCreatedPin, setTempCreatedPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinSubmitting, setPinSubmitting] = useState(false)
  const pinOverlayRef = useRef<HTMLDivElement>(null)
  const pinCardRef = useRef<HTMLDivElement>(null)

  // Profile edit modal
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [profileLegajo, setProfileLegajo] = useState('')
  const [profileError, setProfileError] = useState('')
  const [legajo, setLegajo] = useState<string>(() => localStorage.getItem(LEGAJO_KEY) || '')
  const profileOverlayRef = useRef<HTMLDivElement>(null)
  const profileCardRef = useRef<HTMLDivElement>(null)

  const getGenderIcon = (fullName: string | null | undefined): string => {
    if (!fullName) return '🧑🏻'
    const firstName = fullName.trim().split(/\s+/)[0].toLowerCase()
    // Common exceptions: masculine names ending in 'a'
    const masculineExceptions = ['luca', 'matia', 'elija', 'josua', 'ezra', 'ilia']
    if (masculineExceptions.includes(firstName)) return '👨🏻'
    return firstName.endsWith('a') ? '👩🏻' : '👨🏻'
  }

  useEffect(() => {
    document.title = 'Mi Gusto | Capacitaciones'
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      gsap.timeline()
        .fromTo('.hub-logo', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.2)' })
        .fromTo('.hub-header-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .fromTo('.hub-card', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.2')
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Animate modal IN when showModal becomes true
  useEffect(() => {
    if (!showModal || !modalOverlayRef.current || !modalCardRef.current) return
    gsap.fromTo(
      modalOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    )
    gsap.fromTo(
      modalCardRef.current,
      { opacity: 0, scale: 0.92, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.4)' }
    )
  }, [showModal])

  const handleCloseModal = () => {
    if (!modalOverlayRef.current || !modalCardRef.current) {
      setShowModal(false)
      setErrorMsg('')
      return
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setShowModal(false)
        setErrorMsg('')
      },
    })
    tl.to(modalCardRef.current, { opacity: 0, scale: 0.94, y: 8, duration: 0.2, ease: 'power2.in' })
      .to(modalOverlayRef.current, { opacity: 0, duration: 0.15, ease: 'power1.in' }, '-=0.05')
  }

  // Animate PIN modal IN when showPinModal becomes true
  useEffect(() => {
    if (!showPinModal || !pinOverlayRef.current || !pinCardRef.current) return
    gsap.fromTo(
      pinOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    )
    gsap.fromTo(
      pinCardRef.current,
      { opacity: 0, scale: 0.92, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.4)' }
    )
  }, [showPinModal])

  const handleClosePinModal = () => {
    if (!pinOverlayRef.current || !pinCardRef.current) {
      setShowPinModal(false)
      setPinDigits([])
      setPinError('')
      return
    }
    const tl = gsap.timeline({
      onComplete: () => {
        setShowPinModal(false)
        setPinDigits([])
        setPinError('')
      },
    })
    tl.to(pinCardRef.current, { opacity: 0, scale: 0.94, y: 8, duration: 0.2, ease: 'power2.in' })
      .to(pinOverlayRef.current, { opacity: 0, duration: 0.15, ease: 'power1.in' }, '-=0.05')
  }

  const handleKeypress = (key: string) => {
    setPinError('')
    if (key === 'delete') {
      setPinDigits(prev => prev.slice(0, -1))
    } else {
      if (pinDigits.length < 4) {
        setPinDigits(prev => [...prev, key])
      }
    }
  }

  useEffect(() => {
    if (pinDigits.length !== 4) return

    const enteredPin = pinDigits.join('')
    
    const verifyAndLogin = async () => {
      setPinSubmitting(true)
      setPinError('')
      
      try {
        if (pinFlowMode === 'verify') {
          if (enteredPin === targetPinCode) {
            // Correct PIN!
            await setUserName(pendingUserName, selectedModuleId || 'calidad')
            handleClosePinModal()
            handleCloseModal()
            navigate(selectedModuleId === 'calidad' ? '/calidad' : `/${selectedModuleId || 'calidad'}`)
          } else {
            // Incorrect PIN
            setPinError('El PIN ingresado es incorrecto.')
            setPinDigits([])
            gsap.fromTo('.pin-dots-container', { x: -8 }, { x: 0, duration: 0.4, ease: 'rough({ template: sine.inOut, strength: 4, points: 5, taper: none, randomize: false })' })
          }
        } else if (pinFlowMode === 'create') {
          setTempCreatedPin(enteredPin)
          setPinFlowMode('confirm')
          setPinDigits([])
        } else if (pinFlowMode === 'confirm') {
          if (enteredPin === tempCreatedPin) {
            // Match! Save to Supabase
            const { error } = await supabase
              .from('collaborator_pins')
              .upsert({
                user_name: pendingUserName,
                pin_code: enteredPin,
                created_at: new Date().toISOString()
              })
            
            if (error) {
              console.error('Error saving PIN to Supabase:', error)
            }

            await setUserName(pendingUserName, selectedModuleId || 'calidad')
            handleClosePinModal()
            handleCloseModal()
            setTempCreatedPin('')
            navigate(selectedModuleId === 'calidad' ? '/calidad' : `/${selectedModuleId || 'calidad'}`)
          } else {
            setPinError('Los PINs no coinciden. Intentá de nuevo.')
            setPinFlowMode('create')
            setPinDigits([])
            setTempCreatedPin('')
            gsap.fromTo('.pin-dots-container', { x: -8 }, { x: 0, duration: 0.4, ease: 'rough({ template: sine.inOut, strength: 4, points: 5, taper: none, randomize: false })' })
          }
        }
      } catch (err) {
        console.warn('Supabase PIN check error, bypassing:', err)
        await setUserName(pendingUserName, selectedModuleId || 'calidad')
        handleClosePinModal()
        handleCloseModal()
        navigate(selectedModuleId === 'calidad' ? '/calidad' : `/${selectedModuleId || 'calidad'}`)
      } finally {
        setPinSubmitting(false)
      }
    }

    const timer = setTimeout(verifyAndLogin, 250)
    return () => clearTimeout(timer)
  }, [pinDigits, pinFlowMode, targetPinCode, pendingUserName, selectedModuleId, tempCreatedPin, setUserName, navigate])

  // Open profile modal and pre-fill fields
  const handleOpenProfile = () => {
    setProfileName(progress.userName || '')
    setProfileLegajo(legajo)
    setProfileError('')
    setShowProfileModal(true)
  }

  // Animate profile modal in
  useEffect(() => {
    if (!showProfileModal || !profileOverlayRef.current || !profileCardRef.current) return
    gsap.fromTo(profileOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(profileCardRef.current, { opacity: 0, scale: 0.92, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.4)' })
  }, [showProfileModal])

  const handleCloseProfile = () => {
    if (!profileOverlayRef.current || !profileCardRef.current) {
      setShowProfileModal(false)
      return
    }
    gsap.timeline({ onComplete: () => setShowProfileModal(false) })
      .to(profileCardRef.current, { opacity: 0, scale: 0.94, y: 8, duration: 0.2, ease: 'power2.in' })
      .to(profileOverlayRef.current, { opacity: 0, duration: 0.15 }, '-=0.05')
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = profileName.trim()
    const trimmedLegajo = profileLegajo.trim()
    if (!trimmedName || trimmedName.length < 4) {
      setProfileError('Ingresá tu nombre completo (mínimo 4 caracteres).')
      return
    }
    if (trimmedLegajo && !/^\d+$/.test(trimmedLegajo)) {
      setProfileError('El número de legajo debe contener solo dígitos.')
      return
    }

    try {
      // If user changed their name, update it in context / database
      if (progress.userName && trimmedName !== progress.userName) {
        await updateUserName(progress.userName, trimmedName)
      }
    } catch (err: any) {
      console.error(err)
      setProfileError('Ocurrió un error al actualizar el nombre. Reintentá.')
      return
    }

    // Save legajo to localStorage
    if (trimmedLegajo) {
      localStorage.setItem(LEGAJO_KEY, trimmedLegajo)
    } else {
      localStorage.removeItem(LEGAJO_KEY)
    }
    setLegajo(trimmedLegajo)
    setProfileError('')
    handleCloseProfile()
  }

  const handleModuleClick = (mod: Training) => {
    if (!mod.active) return
    
    if (progress.userName) {
      navigate(mod.id === 'calidad' ? '/calidad' : `/${mod.id}`)
    } else {
      setSelectedModuleId(mod.id)
      setShowModal(true)
    }
  }

  const handleInputChange = (val: string) => {
    setInputName(val)
    setErrorMsg('')
    if (val.trim().length >= 1) {
      const filtered = COLLABORATORS.filter(c => 
        c.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (name: string) => {
    setInputName(name)
    setSuggestions([])
  }

  const handleSubmitName = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputName.trim()
    if (!trimmed) {
      setErrorMsg('Por favor, seleccioná tu nombre de la lista.')
      return
    }

    const matchName = COLLABORATORS.find(c => c.toUpperCase() === trimmed.toUpperCase())
    if (!matchName) {
      setErrorMsg('Debes seleccionar un colaborador de la lista oficial.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')
    try {
      // 1. Query Supabase for PIN code
      const { data, error } = await supabase
        .from('collaborator_pins')
        .select('pin_code')
        .eq('user_name', matchName)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        // If there's an error (e.g. table doesn't exist yet or connection issue),
        // we log it and fallback to bypass PIN for zero-friction
        console.warn('Supabase pin query error, bypassing PIN auth:', error)
        await setUserName(matchName, selectedModuleId || 'calidad')
        setShowModal(false)
        navigate(selectedModuleId === 'calidad' ? '/calidad' : `/${selectedModuleId || 'calidad'}`)
        return
      }

      setInputName(matchName) // normalize casing
      setPendingUserName(matchName)

      if (data && data.pin_code) {
        setPinFlowMode('verify')
        setTargetPinCode(data.pin_code)
      } else {
        setPinFlowMode('create')
      }
      setShowPinModal(true)
    } catch (err) {
      console.warn('Failed to contact Supabase for PIN auth, bypassing:', err)
      await setUserName(matchName, selectedModuleId || 'calidad')
      setShowModal(false)
      navigate(selectedModuleId === 'calidad' ? '/calidad' : `/${selectedModuleId || 'calidad'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const getTrainingProgressPercent = (trainingId: string) => {
    try {
      const saved = localStorage.getItem(`bpm-mi-gusto-progress_${trainingId}`)
      if (!saved) return 0
      const parsed = JSON.parse(saved)
      const courseDataObj = COURSES_DATA[trainingId]
      if (!courseDataObj) return 0
      const total = getTotalLessons(courseDataObj)
      const completed = parsed.completedLessons?.length || 0
      return Math.round((completed / total) * 100)
    } catch {
      return 0
    }
  }

  return (
    <div ref={containerRef} className="min-h-dvh bg-gradient-dark flex flex-col justify-between text-text-primary px-4 py-8 md:px-8">
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <img
            src={getAssetUrl('/Logo Mi Gusto 2025.png')}
            alt="Mi Gusto Logo"
            className="h-10 w-auto object-contain hub-logo opacity-0"
          />
        </div>
        {progress.userName ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 bg-white/5 border border-slate-500/20 px-3.5 py-2 rounded-lg">
              <span className="text-xs font-bold text-brand-300">{getGenderIcon(progress.userName)} {progress.userName}</span>
            </div>
            <button
              onClick={handleOpenProfile}
              title="Editar perfil"
              className="p-2 bg-white/5 hover:bg-white/10 border border-slate-500/20 hover:border-slate-400/40 rounded-lg transition-all text-text-muted hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-2 bg-white/5 hover:bg-red-500/10 border border-slate-500/20 hover:border-red-500/30 rounded-lg transition-all text-text-muted hover:text-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <div />
        )}
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center">
        <div className="text-center mb-6 sm:mb-12 hub-header-text opacity-0">
          <span className="text-brand-400 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest bg-white/5 border border-slate-500/20 px-3 py-1 rounded-full">
            Plataforma de Capacitaciones
          </span>
          <h1 className="text-2xl sm:text-fluid-4xl font-black mt-3 sm:mt-4 leading-tight">
            Portal de Formación <span className="gradient-text">Fábrica</span>
          </h1>
          <p className="text-text-secondary mt-2 sm:mt-3 max-w-lg mx-auto text-xs sm:text-base hidden sm:block">
            Seleccioná la capacitación asignada para registrarte e iniciar tu entrenamiento obligatorio. Recordá que tenés un límite de <strong>40 minutos</strong> para completar todo el contenido y rendir la evaluación.
          </p>
        </div>

        {/* 2x3 Button Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 w-full max-w-5xl">
          {trainings.map((mod) => {
            const percent = getTrainingProgressPercent(mod.id)
            const { cardClass, glowClass, circleStroke, tagClass, titleHoverClass } = getColorClasses(mod.themeColor, mod.active)
            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                disabled={!mod.active}
                className={`hub-card opacity-0 text-left rounded-2xl border p-3.5 sm:p-6 flex flex-col justify-between h-40 sm:h-56 transition-all duration-300 relative group overflow-hidden ${cardClass}`}
              >
                {/* Card glowing backdrop for active card */}
                {mod.active && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${glowClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                )}

                <div className="flex justify-between items-start w-full relative z-10">
                  <span className="text-2xl sm:text-4xl bg-surface/50 p-1.5 sm:p-2.5 rounded-xl border border-surface-border/30">
                    {mod.icon}
                  </span>
                  {mod.active && progress.userName ? (
                    <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0" title={`Progreso: ${percent}%`}>
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                        {/* Fondo del círculo */}
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          className="stroke-surface-border/40 fill-none"
                          strokeWidth="3.5"
                        />
                        {/* Progreso del círculo */}
                        <circle
                          cx="24"
                          cy="24"
                          r="19"
                          className={`${circleStroke} fill-none transition-all duration-700 ease-out`}
                          strokeWidth="3.5"
                          strokeDasharray={2 * Math.PI * 19}
                          strokeDashoffset={2 * Math.PI * 19 * (1 - percent / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[8px] sm:text-[10px] font-black text-white">
                        {percent}%
                      </span>
                    </div>
                  ) : (
                    <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border ${tagClass}`}>
                      {mod.active ? mod.tagline : 'Próx.'}
                    </span>
                  )}
                </div>

                <div className="mt-2 sm:mt-4 relative z-10">
                  <h3 className={`text-xs sm:text-fluid-lg font-bold text-text-primary ${titleHoverClass} transition-colors leading-tight`}>
                    {mod.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-text-secondary mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                {/* Padlock icon for disabled ones */}
                {!mod.active && (
                  <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 text-text-muted text-sm sm:text-base">
                    🔒
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center mt-12 py-4 border-t border-surface-border/30 max-w-6xl mx-auto">
        <p className="text-xs text-text-muted">Desarrollado por el Departamento de sistemas de Mi Gusto</p>
      </footer>

      {/* Profile Edit Modal */}
      {showProfileModal && createPortal(
        <div
          ref={profileOverlayRef}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseProfile() }}
        >
          <div
            ref={profileCardRef}
            className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-md p-6 shadow-glow relative"
          >
            <button
              onClick={handleCloseProfile}
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-400" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Editar Perfil</h3>
                <p className="text-xs text-text-muted">Actualizá tus datos de identificación</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Nombre y Apellido (Oficial)
                </label>
                <input
                  type="text"
                  value={profileName}
                  disabled
                  className="w-full bg-surface/50 border border-surface-border/50 rounded-xl px-4 py-3 text-sm text-text-muted focus:outline-none cursor-not-allowed"
                />
                <span className="text-[10px] text-text-muted mt-1.5 block">
                  Nombre registrado oficialmente en el roster.
                </span>
              </div>



              <div className="border-t border-surface-border/50 pt-4 mt-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Seguridad de la Cuenta
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setPendingUserName(progress.userName || '')
                    setPinFlowMode('create')
                    setPinDigits([])
                    setTempCreatedPin('')
                    setPinError('')
                    handleCloseProfile()
                    setShowPinModal(true)
                  }}
                  className="w-full bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/30 hover:border-violet-500/50 text-violet-300 py-3 rounded-xl text-xs font-bold transition-all"
                >
                  🔒 Cambiar PIN de Acceso
                </button>
              </div>

              {profileError && (
                <p className="text-red-400 text-xs font-medium bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg">⚠️ {profileError}</p>
              )}

              <div className="flex justify-end gap-3 mt-1">
                <button
                  type="submit"
                  className="btn-primary py-3 px-6 text-xs font-bold shadow-glow w-auto"
                >
                  Guardar Cambios ✓
                </button>
                <button
                  type="button"
                  onClick={handleCloseProfile}
                  className="bg-surface border border-surface-border hover:bg-surface-elevated text-text-secondary hover:text-white py-3 px-6 rounded-xl text-xs font-bold transition-all w-auto"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Name Input Modal */}
      {showModal && createPortal(
        <div
          ref={modalOverlayRef}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            ref={modalCardRef}
            className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-md p-6 shadow-glow relative"
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="text-fluid-xl font-bold text-white mb-2">Registro del colaborador</h3>
            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Buscá y seleccioná tu nombre de la lista para registrar tu participación.
            </p>
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 text-left leading-relaxed mb-4">
              <span className="text-lg">⚠️</span>
              <span>
                <strong>Aviso importante:</strong> Al comenzar la capacitación, tendrás un tiempo límite de <strong>40 minutos</strong> para leer todo el contenido y rendir la evaluación final de corrido.
              </span>
            </div>
            <form onSubmit={handleSubmitName} className="flex flex-col gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Nombre y Apellido
                </label>
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Escribí para buscar tu nombre..."
                  autoFocus
                  className="w-full bg-surface border border-surface-border focus:border-brand-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                />

                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-surface-elevated border border-surface-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(s)}
                        className="w-full text-left px-4 py-3 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors border-b border-surface-border/50 last:border-b-0"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {errorMsg && (
                  <p className="text-red-400 text-xs mt-2 font-medium">⚠️ {errorMsg}</p>
                )}
              </div>
              <div className="flex justify-center mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3.5 text-sm font-bold shadow-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Verificando datos... 🔄' : 'Comenzar Capacitación 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* PIN Keypad Modal */}
      {showPinModal && createPortal(
        <div
          ref={pinOverlayRef}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            ref={pinCardRef}
            className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-xs p-6 shadow-glow relative text-center"
          >
            <button
              onClick={handleClosePinModal}
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-2 mb-6">
              <span className="text-3xl">🔒</span>
              <h3 className="text-lg font-black text-white">
                {pinFlowMode === 'verify' 
                  ? 'Ingresar PIN' 
                  : pinFlowMode === 'create' 
                  ? 'Crear PIN' 
                  : 'Confirmar PIN'}
              </h3>
              <p className="text-xs text-text-muted">
                {pinFlowMode === 'verify'
                  ? `Ingresá tu PIN para ${pendingUserName}`
                  : pinFlowMode === 'create'
                  ? 'Definí un PIN de 4 dígitos para tu cuenta'
                  : 'Ingresá el PIN nuevamente para confirmar'}
              </p>
              {(pinFlowMode === 'create' || pinFlowMode === 'confirm') && (
                <div className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg leading-normal mt-2.5 max-w-[240px] mx-auto text-center font-medium">
                  ⚠️ <strong>¡Importante!</strong> Anotá o recordá este PIN. Será obligatorio para ingresar la próxima vez.
                </div>
              )}
            </div>

            {/* PIN Dots Display */}
            <div className="pin-dots-container flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    pinDigits[idx] !== undefined
                      ? 'bg-brand-500 border-brand-500 scale-110 shadow-[0_0_8px_rgba(var(--brand-500),0.5)]'
                      : 'border-slate-500/40'
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-red-400 text-xs font-semibold mb-6">⚠️ {pinError}</p>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypress(num)}
                  disabled={pinSubmitting}
                  className="w-14 h-14 rounded-full bg-white/5 border border-slate-500/10 hover:border-brand-500/50 hover:bg-brand-500/10 active:scale-95 text-lg font-bold text-white transition-all flex items-center justify-center select-none"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClosePinModal}
                disabled={pinSubmitting}
                className="w-14 h-14 rounded-full bg-transparent text-text-muted hover:text-white transition-colors flex items-center justify-center text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleKeypress('0')}
                disabled={pinSubmitting}
                className="w-14 h-14 rounded-full bg-white/5 border border-slate-500/10 hover:border-brand-500/50 hover:bg-brand-500/10 active:scale-95 text-lg font-bold text-white transition-all flex items-center justify-center select-none"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => handleKeypress('delete')}
                disabled={pinSubmitting}
                className="w-14 h-14 rounded-full bg-white/5 border border-slate-500/10 hover:border-red-500/50 hover:bg-red-500/10 active:scale-95 text-lg text-text-muted hover:text-red-400 transition-all flex items-center justify-center select-none"
                title="Borrar"
              >
                ⌫
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
