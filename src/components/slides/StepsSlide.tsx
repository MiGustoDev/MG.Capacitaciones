import { useState, useEffect, useRef } from 'react'
import { useGSAPEntrance } from '../../hooks/useGSAPEntrance'
import { useGSAPStaggerList } from '../../hooks/useGSAPEntrance'
import { BadgePill } from '../ui/HighlightBlock'
import { ImagePlaceholder } from '../ui/ImagePlaceholder'
import type { LessonContent } from '../../data/types'

interface StepsSlideProps { content: LessonContent }

export function StepsSlide({ content }: StepsSlideProps) {
  const headerRef = useGSAPEntrance({ y: 20, duration: 0.5 })
  const listRef = useGSAPStaggerList<HTMLOListElement>('li', { delay: 0.3, stagger: 0.1 })
  const hasImage = !!(content.imageSuggested || content.image)
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      let scrollY = 0
      const scrollParent = containerRef.current?.closest('.overflow-y-auto')
      if (scrollParent) {
        scrollY = scrollParent.scrollTop
      } else {
        scrollY = window.scrollY
      }
      setIsScrolled(scrollY > 20)
    }

    const scrollParent = containerRef.current?.closest('.overflow-y-auto')
    if (scrollParent) {
      scrollParent.addEventListener('scroll', handleScroll, { passive: true })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      if (scrollParent) scrollParent.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const isExtintor = content.subtitle?.includes('Regla JAAR')

  return (
    <div ref={containerRef} className="flex flex-col gap-4 w-full relative">
      {/* Si NO es extintor (es video/GIF), se muestra arriba de todo sticky top-0 */}
      {hasImage && !isExtintor && (
        <div className={`sticky top-0 z-30 -mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full mt-0 mb-3 pt-0 pb-1 bg-surface/95 backdrop-blur-md border-b sm:border sm:rounded-2xl border-surface-border/50 shadow-2xl transition-all duration-500 overflow-hidden flex justify-center ${
          isScrolled ? 'py-1' : 'py-0'
        }`}>
          <ImagePlaceholder
            alt={content.imageAlt ?? content.title}
            suggested={content.imageSuggested}
            image={content.image}
            aspectRatio="video"
            objectFit={isScrolled ? 'contain' : (content.imageFit ?? 'contain')}
            className={`w-full transition-all duration-500 rounded-none sm:rounded-xl filter brightness-105 ${
              isScrolled
                ? 'max-w-sm sm:max-w-md max-h-36 sm:max-h-44 md:max-h-52'
                : 'max-w-none max-h-60 sm:max-h-80 md:max-h-[400px]'
            }`}
          />
        </div>
      )}

      {/* Encabezado con badge, título, Regla JAAR y descripción */}
      <div ref={headerRef} className="flex flex-col gap-3 opacity-0 relative z-10">
        {content.badge && <BadgePill label={content.badge} />}
        <h2 className="lesson-title">{content.title}</h2>
        {content.subtitle && (
          <div className="flex flex-col gap-1.5">
            {isExtintor ? (
              <>
                <p className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  Regla JAAR
                </p>
                <p className="text-lg sm:text-xl font-bold text-red-400">
                  <span className="text-amber-400 font-black">J</span>alar ·{' '}
                  <span className="text-amber-400 font-black">A</span>puntar ·{' '}
                  <span className="text-amber-400 font-black">A</span>pretar ·{' '}
                  <span className="text-amber-400 font-black">R</span>ealizar el Barrido
                </p>
              </>
            ) : (
              <p className="text-fluid-lg font-semibold text-brand-400">
                {content.subtitle}
              </p>
            )}
          </div>
        )}
        {content.description && (
          <p className="lesson-description">{content.description}</p>
        )}
      </div>

      {/* Para el Extintor: la imagen va justo después de la descripción en tamaño gigante como sticky z-0 */}
      {hasImage && isExtintor && (
        <div className="sticky top-2 z-0 w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto my-2 pointer-events-none transition-all duration-300">
          <ImagePlaceholder
            alt={content.imageAlt ?? content.title}
            suggested={content.imageSuggested}
            image={content.image}
            aspectRatio="video"
            objectFit={content.imageFit ?? 'contain'}
            className="max-h-[450px] sm:max-h-[580px] md:max-h-[700px] w-full opacity-90 scale-105 filter brightness-110 contrast-115 drop-shadow-[0_30px_60px_rgba(239,68,68,0.4)]"
          />
        </div>
      )}

      {/* Contenedor relativo para la lista de pasos (en el Extintor pasa por encima de la imagen) */}
      <div className="relative w-full flex flex-col gap-4">
        {content.steps && (
          <div className={`flex flex-col gap-3 relative z-20 ${isExtintor ? '-mt-24 sm:-mt-36' : 'pt-2'}`}>
            {content.stepsTitle && (
              <h3 className="text-base sm:text-lg font-bold text-text-primary flex items-center gap-2 bg-surface/80 backdrop-blur-md p-2 rounded-xl border border-surface-border/40 self-start shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-glow shadow-red-500/50"></span>
                {content.stepsTitle}
              </h3>
            )}
            <ol ref={listRef} className="flex flex-col gap-4 sm:gap-5">
            {content.steps.map((step, i) => {
              const letter = String(step.letter ?? step.number).toUpperCase()
              const colorsMap: Record<string, { bg: string; text: string; shadow: string; border: string; tag: string }> = {
                J: {
                  bg: 'from-red-500 to-rose-600',
                  text: 'text-red-400',
                  shadow: 'shadow-red-500/40',
                  border: 'group-hover:border-red-500/60 border-red-500/30',
                  tag: 'bg-red-500/10 text-red-400 border-red-500/30'
                },
                A: i === 1 ? {
                  bg: 'from-amber-500 to-orange-600',
                  text: 'text-amber-400',
                  shadow: 'shadow-amber-500/40',
                  border: 'group-hover:border-amber-500/60 border-amber-500/30',
                  tag: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                } : {
                  bg: 'from-blue-500 to-indigo-600',
                  text: 'text-blue-400',
                  shadow: 'shadow-blue-500/40',
                  border: 'group-hover:border-blue-500/60 border-blue-500/30',
                  tag: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                },
                R: {
                  bg: 'from-emerald-500 to-teal-600',
                  text: 'text-emerald-400',
                  shadow: 'shadow-emerald-500/40',
                  border: 'group-hover:border-emerald-500/60 border-emerald-500/30',
                  tag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }
              }
              const theme = colorsMap[letter] ?? {
                bg: 'from-red-500 to-red-700',
                text: 'text-red-400',
                shadow: 'shadow-red-500/40',
                border: 'group-hover:border-red-500/60 border-red-500/30',
                tag: 'bg-red-500/10 text-red-400 border-red-500/30'
              }

              return (
                <li
                  key={i}
                  className={`flex items-center gap-4 sm:gap-6 bg-surface-card/90 backdrop-blur-xl border ${theme.border}
                             rounded-2xl p-4 sm:px-6 sm:py-5 opacity-0 group transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl shadow-xl`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${theme.bg} flex items-center justify-center
                                  text-white font-black text-xl sm:text-2xl shadow-glow ${theme.shadow} border border-white/20 group-hover:scale-110 transition-transform duration-200`}>
                    {letter}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-base sm:text-lg font-black ${theme.text} leading-tight`}>
                        {step.title}
                      </span>
                    </div>
                    {step.description && (
                      <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        {step.description}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
          </div>
        )}
      </div>
    </div>
  )
}
