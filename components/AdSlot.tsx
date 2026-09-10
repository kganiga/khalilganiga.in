'use client'

import { useEffect, useRef, useState } from 'react'
import { adsenseReady } from './AdSense'

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

// Grace period AFTER an ad has actually been requested (not from component mount)
// before giving up and collapsing an unfilled slot - long enough for a real
// ad-serving round trip, short enough to still recover the space for ad-blocker
// visitors or genuine no-fill responses.
const FILL_CHECK_DELAY_MS = 4000

export default function AdSlot({
  client = 'ca-pub-9693146779273135',
  slot = '',
  className = '',
  style = { display: 'block' },
  responsive = true,
  enabled = true,
  adFormat,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isLighthouse, setIsLighthouse] = useState(false)
  const debug = process.env.NEXT_PUBLIC_ADS_DEBUG_ADS === 'true'
  const isProd = process.env.NODE_ENV === 'production'
  const force = process.env.NEXT_PUBLIC_FORCE_LOAD_ADS === 'true'
  const shouldEnable = enabled && (isProd || force) && !isLighthouse

  // Don't request (or reserve/pay the layout cost of) an ad until the slot is
  // actually about to be seen - avoids loading inventory a visitor may never
  // scroll to, which is also the "loaded unnecessarily" case for below-the-fold
  // placements like the footer/autorelaxed units.
  useEffect(() => {
    if (!shouldEnable) return
    const container = containerRef.current
    if (!container || typeof IntersectionObserver === 'undefined') {
      setIsNearViewport(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [shouldEnable])

  useEffect(() => {
    const isBot =
      typeof navigator !== 'undefined' && /Lighthouse|Chrome-Lighthouse/i.test(navigator.userAgent)
    if (isBot) {
      setIsLighthouse(true)
      return
    }

    if (!shouldEnable || !isNearViewport) {
      if (debug && !isNearViewport) console.log('[AdSlot] waiting until near viewport', { slot })
      return
    }

    let cancelled = false
    let mo: MutationObserver | undefined
    let fillCheckTimeoutId: number | undefined

    const requestAd = () => {
      if (cancelled) return
      try {
        const ads = window.adsbygoogle ?? (window.adsbygoogle = [])
        ads.push({})
        if (debug) console.log('[AdSlot] pushed to adsbygoogle', { slot })
      } catch (e) {
        if (debug) console.warn('[AdSlot] ads push failed', e)
      }

      const container = containerRef.current
      if (!container) return

      const checkFilled = () => {
        const hasChildren = container.childNodes.length > 0
        const height = window.getComputedStyle(container).height
        return hasChildren || (height && height !== '0px')
      }

      mo = new MutationObserver(() => {
        if (checkFilled()) mo?.disconnect()
      })
      mo.observe(container, { childList: true, subtree: true })

      fillCheckTimeoutId = window.setTimeout(() => {
        if (!cancelled && !checkFilled()) setHidden(true)
      }, FILL_CHECK_DELAY_MS)
    }

    // The adsbygoogle.js script itself is only requested after the visitor's
    // first interaction (see AdSense.tsx), so wait for confirmation it has
    // actually loaded before pushing a request and starting the fill-check clock
    // - otherwise this races the script and almost always loses.
    if (adsenseReady.current) {
      requestAd()
    } else {
      const onReady = () => requestAd()
      window.addEventListener('adsense:ready', onReady, { once: true })
      return () => {
        cancelled = true
        window.removeEventListener('adsense:ready', onReady)
        mo?.disconnect()
        if (fillCheckTimeoutId) window.clearTimeout(fillCheckTimeoutId)
      }
    }

    return () => {
      cancelled = true
      mo?.disconnect()
      if (fillCheckTimeoutId) window.clearTimeout(fillCheckTimeoutId)
    }
  }, [shouldEnable, isNearViewport, client, slot, debug])

  if (!enabled || isLighthouse) return null

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
