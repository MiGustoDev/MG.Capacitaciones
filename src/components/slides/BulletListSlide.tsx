import { useGSAPStaggerList } from '../../hooks/useGSAPEntrance'
import { useGSAPEntrance } from '../../hooks/useGSAPEntrance'
import { ImagePlaceholder } from '../ui/ImagePlaceholder'
import { HighlightBlock, BadgePill } from '../ui/HighlightBlock'
import type { LessonContent } from '../../data/types'

interface BulletListSlideProps { content: LessonContent }

export function BulletListSlide({ content }: BulletListSlideProps) {
  const headerRef = useGSAPEntrance({ y: 20, duration: 0.5 })
  const listRef = useGSAPStaggerList<HTMLUListElement>('li', { delay: 0.3 })
  const hasItems = !!(content.items && content.items.length > 0)

  if (!hasItems) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <div ref={headerRef} className="flex flex-col gap-3 opacity-0">
          {content.badge && <BadgePill label={content.badge} />}
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
            aspectRatio="video"
            objectFit="cover"
            className="max-h-[70vh] w-full"
          />
        )}

        <HighlightBlock content={content} />
      </div>
    )
  }

  const stackedMobile = content.mobileStackedImageGrid
  const mobileGrid = content.mobileItemsGrid || stackedMobile
  const hasImage = !!(content.imageSuggested || content.image)

  const imageBlock = hasImage ? (
    <div
      className={`flex-shrink-0 w-full max-w-xl ${
        stackedMobile
          ? 'order-2 lg:order-none lg:w-[45%] xl:w-[50%]'
          : 'lg:w-[45%] xl:w-[50%]'
      }`}
    >
      <ImagePlaceholder
        alt={content.imageAlt ?? content.title}
        suggested={content.imageSuggested}
        image={content.image}
        aspectRatio="square"
        objectFit={content.imageFit ?? 'cover'}
      />
    </div>
  ) : null

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
      <div
        className={
          stackedMobile
            ? 'contents lg:flex lg:flex-1 lg:flex-col lg:gap-5'
            : 'flex-1 flex flex-col gap-5'
        }
      >
        <div
          ref={headerRef}
          className={`flex flex-col gap-3 opacity-0 ${stackedMobile ? 'order-1 lg:order-none' : ''}`}
        >
          {content.badge && <BadgePill label={content.badge} />}
          <h2 className="lesson-title">{content.title}</h2>
          {content.subtitle && (
            <p className="text-lg sm:text-xl font-bold text-red-400">
              {content.subtitle.includes('Proteger · Avisar · Socorrer') ? (
                <>
                  <span className="text-white font-black">P</span>roteger ·{' '}
                  <span className="text-white font-black">A</span>visar ·{' '}
                  <span className="text-white font-black">S</span>ocorrer
                </>
              ) : (
                content.subtitle
              )}
            </p>
          )}
          {content.description && (
            <p className="lesson-description">{content.description}</p>
          )}
        </div>

        <ul
          ref={listRef}
          className={
            mobileGrid
              ? 'order-3 grid grid-cols-2 gap-3 mt-2 lg:order-none lg:flex lg:flex-col lg:gap-3'
              : 'flex flex-col gap-3 mt-2'
          }
        >
          {(content.items ?? []).map((item, i) => {
            const parts = item.text.split(':')
            const hasPrefix = parts.length > 1
            const prefix = hasPrefix ? parts[0].trim() : ''
            const bodyText = hasPrefix ? parts.slice(1).join(':').trim() : item.text

            // Dynamic color accents based on item index
            const accentColors = [
              { border: 'hover:border-red-500/80 hover:shadow-red-500/5', iconBg: 'bg-red-500/10 border-red-500/30 text-red-400', badge: 'text-red-400' },
              { border: 'hover:border-amber-500/80 hover:shadow-amber-500/5', iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', badge: 'text-amber-400' },
              { border: 'hover:border-blue-500/80 hover:shadow-blue-500/5', iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400', badge: 'text-blue-400' },
              { border: 'hover:border-emerald-500/80 hover:shadow-emerald-500/5', iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', badge: 'text-emerald-400' },
              { border: 'hover:border-purple-500/80 hover:shadow-purple-500/5', iconBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400', badge: 'text-purple-400' },
            ]
            const accent = accentColors[i % accentColors.length]

            return (
              <li
                key={i}
                className={`flex bg-surface-card border border-surface-border/80 rounded-2xl opacity-0
                           ${accent.border} transition-all duration-200 hover:shadow-lg ${
                             mobileGrid
                               ? 'flex-col items-center justify-center gap-2.5 p-4 text-center lg:flex-row lg:items-start lg:gap-4.5 lg:p-5 lg:text-left'
                               : 'items-start gap-4 p-4.5 sm:p-5'
                           }`}
              >
                {item.icon && (
                  <div
                    className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center text-xl sm:text-2xl shadow-sm ${accent.iconBg}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                )}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  {hasPrefix ? (
                    <>
                      <span className={`text-base sm:text-lg font-black ${accent.badge} leading-tight`}>
                        {prefix}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                        {bodyText}
                      </span>
                    </>
                  ) : (
                    <span className="text-base sm:text-lg text-text-primary font-bold leading-snug">{item.text}</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <div className={stackedMobile ? 'order-4 lg:order-none' : undefined}>
          <HighlightBlock content={content} />
        </div>
      </div>

      {imageBlock}
    </div>
  )
}
