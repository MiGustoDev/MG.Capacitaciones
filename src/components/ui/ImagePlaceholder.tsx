/** Placeholder visual para imágenes sugeridas */
interface ImagePlaceholderProps {
  alt: string
  suggested?: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'wide'
}

export function ImagePlaceholder({
  alt,
  suggested,
  className = '',
  aspectRatio = 'video',
}: ImagePlaceholderProps) {
  const ratioClass =
    aspectRatio === 'square' ? 'aspect-square'
    : aspectRatio === 'wide' ? 'aspect-[21/9]'
    : 'aspect-video'

  return (
    <div
      className={`${ratioClass} w-full rounded-xl overflow-hidden bg-surface-elevated border border-surface-border flex flex-col items-center justify-center gap-3 ${className}`}
      role="img"
      aria-label={alt}
    >
      <div className="text-4xl opacity-30">📷</div>
      <div className="text-center px-4">
        <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
          Imagen sugerida
        </p>
        {suggested && (
          <p className="text-text-secondary text-sm text-center">{suggested}</p>
        )}
      </div>
    </div>
  )
}
