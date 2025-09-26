import React from 'react'
import Img from '@/components/Image'

interface ImageGalleryProps {
  images: Array<{ src: string; alt?: string }>
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((img, idx) => (
        <div key={idx} className="relative overflow-hidden">
          <Img
            src={img.src}
            alt={img.alt || `Image ${idx + 1}`}
            width={1200}
            height={800}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  )
}
