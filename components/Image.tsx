import NextImage, { ImageProps } from 'next/image'
import React from 'react'

type Props = ImageProps & { className?: string }

export default function Image({ className, loading, ...rest }: Props) {
  // Default to lazy unless priority is present
  const priority = (rest as ImageProps).priority
  const effectiveLoading = priority ? undefined : (loading ?? 'lazy')

  return (
    <NextImage
      {...rest}
      className={className}
      loading={effectiveLoading as 'lazy' | 'eager' | undefined}
    />
  )
}
