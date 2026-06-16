import { useGSAPEntrance } from '../../hooks/useGSAPEntrance'
import { useGSAPStaggerList } from '../../hooks/useGSAPEntrance'
import { HighlightBlock } from '../ui/HighlightBlock'
import { BadgePill } from '../ui/HighlightBlock'
import type { LessonContent } from '../../data/types'

interface AlertSlideProps { content: LessonContent }

export function AlertSlide({ content }: AlertSlideProps) {
  const headerRef = useGSAPEntrance({ y: 20, duration: 0.5 })
  const listRef = useGSAPStaggerList<HTMLUListElement>('li', { delay: 0.3 })

  const isWarning = content.highlightVariant === 'warning' || content.highlightVariant === 'danger'

  return (
    <div className="flex flex-col gap-6 w-full">
      <div ref={headerRef} className="flex flex-col gap-3 opacity-0">
        {content.badge && <BadgePill label={content.badge} />}

        {/* Alert header strip */}
        <div className={`flex items-center gap-3 rounded-xl px-5 py-4 border ${
          isWarning
            ? 'bg-amber-500/10 border-amber-500/40'
            : 'bg-blue-500/10 border-blue-500/40'
        }`}>
          <span className="text-3xl" aria-hidden="true">{isWarning ? '⚠️' : 'ℹ️'}</span>
          <h2 className={`text-fluid-2xl font-bold ${isWarning ? 'text-amber-300' : 'text-blue-300'}`}>
            {content.title}
          </h2>
        </div>

        {content.description && (
          <p className="lesson-description">{content.description}</p>
        )}
      </div>

      {content.items && (
        <ul ref={listRef} className="flex flex-col gap-3">
          {content.items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 bg-surface-card border border-surface-border
                         rounded-xl px-5 py-4 opacity-0"
            >
              {item.icon && (
                <span className="text-2xl flex-shrink-0 w-8 text-center" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="text-fluid-base text-text-primary font-medium">{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      <HighlightBlock content={content} />
    </div>
  )
}
