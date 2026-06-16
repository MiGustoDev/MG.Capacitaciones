import type { LessonContent } from '../../data/types'

interface HighlightBlockProps {
  content: LessonContent
}

const VARIANTS = {
  warning: 'highlight-warning',
  danger: 'highlight-danger',
  info: 'highlight-info',
  success: 'highlight-success',
}

const ICONS = {
  warning: '⚠️',
  danger: '🚨',
  info: 'ℹ️',
  success: '✅',
}

export function HighlightBlock({ content }: HighlightBlockProps) {
  if (!content.highlight) return null
  const variant = content.highlightVariant ?? 'warning'
  return (
    <div className={VARIANTS[variant]} role="note">
      <span className="mr-2">{ICONS[variant]}</span>
      <span className="text-sm font-medium leading-relaxed">{content.highlight}</span>
    </div>
  )
}

interface BadgePillProps {
  label: string
}
export function BadgePill({ label }: BadgePillProps) {
  return <span className="badge">{label}</span>
}
