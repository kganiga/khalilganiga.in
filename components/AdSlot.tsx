'use client'

import { useEffect, useRef, useState } from 'react'

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
  adFormat?: string
}

export default function AdSlot({
  client = 'ca-pub-9693146779273135',
  slot = '',
  className = '',
  style = { display: 'block' },
  responsive = true,
  enabled = true,
  adFormat,
}: AdSlotProps) {
  // Call hooks unconditionally. The effect will early-exit when ads are disabled.
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hidden, setHidden] = useState(false)
  const debug = process.env.NEXT_PUBLIC_ADS_DEBUG_ADS === 'true'
  const isProd = process.env.NODE_ENV === 'production'
  const force = process.env.NEXT_PUBLIC_FORCE_LOAD_ADS === 'true'
  const shouldEnable = enabled && (isProd || force)

  useEffect(() => {
    if (!shouldEnable) {
      if (debug)
        console.log('[AdSlot] not enabled (dev). set NEXT_PUBLIC_FORCE_LOAD_ADS=true to override')
      return
    }

    if (debug) console.log('[AdSlot] mount', { slot, client })

    try {
      // Ensure the adsbygoogle global exists and request an ad render.
      const ads = window.adsbygoogle ?? (window.adsbygoogle = [])
      ads.push({})
      if (debug) console.log('[AdSlot] pushed to adsbygoogle', { slot })
    } catch (e) {
      // ignore when ads script not present or blocked
      if (debug) console.warn('[AdSlot] ads push failed', e)
    }

    const container = containerRef.current
    if (!container) return

    let timedOut = false

    const checkRendered = () => {
      // Consider rendered when the container has child nodes (iframe injected) or non-zero height
      const hasChildren = container.childNodes.length > 0
      const height = window.getComputedStyle(container).height
      const visible = hasChildren || (height && height !== '0px')
      setHidden(!visible)
      return visible
    }

    // Observe mutations -- some ad networks inject iframes asynchronously
    const mo = new MutationObserver(() => {
      if (checkRendered()) {
        // If ad appears after being hidden, unhide
        timedOut = true
      }
    })
    mo.observe(container, { childList: true, subtree: true })

    // After a short timeout, hide the container if nothing rendered
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      checkRendered()
      if (!checkRendered()) setHidden(true)
    }, 2500)

    return () => {
      mo.disconnect()
      window.clearTimeout(timeoutId)
    }
  }, [shouldEnable, client, slot, debug])

  if (!enabled) return null

  if (hidden) return null

  return (
    <div ref={containerRef}>
      <ins
        className={`adsbygoogle ${className}`}
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={adFormat ?? (responsive ? 'auto' : undefined)}
        data-full-width-responsive={responsive ? 'true' : undefined}
      />
    </div>
  )
}
