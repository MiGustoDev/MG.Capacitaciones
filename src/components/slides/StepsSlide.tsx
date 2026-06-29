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

  const imageBlock = hasImage ? (
    <div className="flex-shrink-0 w-full max-w-xl lg:w-[45%] xl:w-[50%]">
      <ImagePlaceholder
        alt={content.imageAlt ?? content.title}
        suggested={content.imageSuggested}
        image={content.image}
        aspectRatio="video"
        objectFit={content.imageFit ?? 'cover'}
      />
    </div>
  ) : null

  const contentBlock = (
    <div className="flex-1 flex flex-col gap-6">
      <div ref={headerRef} className="flex flex-col gap-3 opacity-0">
        {content.badge && <BadgePill label={content.badge} />}
        <h2 className="lesson-title">{content.title}</h2>
        {content.subtitle && (
          <p className="text-fluid-lg font-semibold text-brand-400">{content.subtitle}</p>
        )}
        {content.description && (
          <p className="lesson-description">{content.description}</p>
        )}
      </div>

      {content.steps && (
        <ol ref={listRef} className="flex flex-col gap-4">
          {content.steps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-5 bg-surface-card border border-surface-border
                         rounded-xl px-5 py-4 opacity-0 group hover:border-brand-600/50 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center
                              text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                {step.number}
              </div>
              <div className="flex flex-col gap-1 pt-1.5">
                <span className="text-fluid-base font-semibold text-text-primary">{step.title}</span>
                {step.description && (
                  <span className="text-fluid-sm text-text-secondary">{step.description}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
      {contentBlock}
      {imageBlock}
    </div>
  )
}
