import { useState } from 'react'
import { getAssetUrl } from '../../utils/assets'

interface ImagePlaceholderProps {
  alt: string
  suggested?: string
  image?: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'wide'
  objectFit?: 'cover' | 'contain'
}

export function ImagePlaceholder({
  alt,
  suggested,
  image,
  className = '',
  aspectRatio = 'video',
  objectFit = 'cover',
}: ImagePlaceholderProps) {
  const [hasError, setHasError] = useState(false)

  const ratioClass =
    aspectRatio === 'square' ? 'aspect-square'
    : aspectRatio === 'wide' ? 'aspect-[21/9]'
    : 'aspect-video'

  if (image && !hasError) {
    const isContain = objectFit === 'contain'
    const fitClass = isContain ? 'object-contain bg-transparent border-none' : 'object-cover border border-surface-border'
    const isVideo = image.endsWith('.mp4') || image.endsWith('.webm')

    if (isVideo) {
      return (
        <video
          src={getAssetUrl(image)}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-auto max-h-[50vh] sm:max-h-[65vh] md:max-h-[70vh] rounded-xl ${fitClass} select-none ${className}`}
          onError={() => setHasError(true)}
        />
      )
    }

    return (
      <img
        src={getAssetUrl(image)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-auto max-h-[50vh] sm:max-h-[65vh] md:max-h-[70vh] rounded-xl ${fitClass} select-none pointer-events-none ${className}`}
        onError={() => setHasError(true)}
      />
    )
  }

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
