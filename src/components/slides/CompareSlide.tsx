import { useGSAPEntrance } from '../../hooks/useGSAPEntrance'
import { ImagePlaceholder } from '../ui/ImagePlaceholder'
import { HighlightBlock } from '../ui/HighlightBlock'
import type { LessonContent } from '../../data/types'

interface CompareSlideProps { content: LessonContent }

export function CompareSlide({ content }: CompareSlideProps) {
  const ref = useGSAPEntrance({ y: 24, duration: 0.6 })
  const hasColumns = !!(content.compareColumns && content.compareColumns.length > 0)
  const mobileGrid = content.mobileItemsGrid

  return (
    <div ref={ref} className="flex flex-col gap-6 w-full opacity-0">
      <div className="flex flex-col gap-2">
        <h2 className="lesson-title">{content.title}</h2>
        {content.description && (
          <p className="lesson-description">{content.description}</p>
        )}
      </div>

      {(content.imageSuggested || content.image) && (
        <ImagePlaceholder
          alt={content.imageAlt ?? content.title}
          suggested={content.imageSuggested}
          image={content.image}
          aspectRatio="wide"
          objectFit="cover"
          className={hasColumns ? "max-h-96 md:max-h-[480px] lg:max-h-[550px]" : "max-h-[70vh] w-full"}
        />
      )}

      {hasColumns && (
        <div
          className={
            mobileGrid
              ? 'grid grid-cols-2 gap-3 sm:gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'
          }
        >
          {content.compareColumns!.map((col, i) => {
            const isCorrect = col.variant === 'correct'
            const columnThemes = [
              {
                bg: 'bg-gradient-to-b from-amber-500/15 to-orange-950/30 border-amber-500/50 shadow-amber-500/10',
                title: 'text-amber-400 font-black',
                badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                icon: '🔥'
              },
              {
                bg: 'bg-gradient-to-b from-blue-500/15 to-indigo-950/30 border-blue-500/50 shadow-blue-500/10',
                title: 'text-blue-400 font-black',
                badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                icon: '🧪'
              }
            ]
            const theme = columnThemes[i % columnThemes.length]

            return (
              <div
                key={i}
                className={`rounded-2xl border-2 flex flex-col gap-3.5 shadow-xl transition-all hover:scale-[1.01] ${
                  mobileGrid ? 'p-4 sm:p-5' : 'p-5 sm:p-6'
                } ${
                  isCorrect && !col.label.includes('QUEMADURAS') && !col.label.includes('INTOXICACIÓN')
                    ? 'bg-brand-600/10 border-brand-600/50'
                    : theme.bg
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{theme.icon}</span>
                  <h3
                    className={`font-black ${
                      mobileGrid ? 'text-sm sm:text-lg' : 'text-base sm:text-xl'
                    } ${theme.title}`}
                  >
                    {col.label}
                  </h3>
                </div>

                <ul className="flex flex-col gap-3 mt-1">
                  {col.items.map((item, j) => {
                    const isWarning = item.startsWith('NO ')
                    return (
                      <li
                        key={j}
                        className={`flex items-start gap-2.5 ${
                          mobileGrid ? 'text-xs sm:gap-3 sm:text-sm' : 'gap-3 text-xs sm:text-sm'
                        } font-medium leading-relaxed ${
                          isWarning ? 'text-rose-300' : 'text-slate-100'
                        }`}
                      >
                        <span className="mt-0.5 flex-shrink-0 text-base">
                          {isWarning ? '🛑' : '✅'}
                        </span>
                        <span>{item}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      <HighlightBlock content={content} />
    </div>
  )
}
