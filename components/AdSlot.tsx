'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>
  }
}

type AdSlotProps = {
  client?: string
  slot?: string
  className?: string
  style?: React.CSSProperties
  responsive?: boolean
  enabled?: boolean
}

export default function AdSlot({
  client = 'ca-pub-9693146779273135',
  slot = '',
  className = '',
  style = { display: 'block' },
  responsive = true,
  enabled = true,
}: AdSlotProps) {
  // Call hooks unconditionally. The effect will early-exit when ads are disabled.
  useEffect(() => {
    if (!enabled) return
    try {
      // Ensure the adsbygoogle global exists and request an ad render.
      const ads = window.adsbygoogle ?? (window.adsbygoogle = [])
      ads.push({})
    } catch (e) {
      // ignore when ads script not present or blocked
    }
  }, [enabled])

  if (!enabled) return null

  return (
    // Insert a standard AdSense slot. The ad script must be loaded globally (see components/AdSense.tsx).
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={responsive ? 'auto' : undefined}
      data-full-width-responsive={responsive ? 'true' : undefined}
    />
  )
}
