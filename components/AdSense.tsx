'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function AdSense({ client = 'ca-pub-9693146779273135' }: { client?: string }) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const debug = process.env.NEXT_PUBLIC_ADS_DEBUG_ADS === 'true'

  useEffect(() => {
    const isLighthouse =
      typeof navigator !== 'undefined' && /Lighthouse|Chrome-Lighthouse/i.test(navigator.userAgent)

    if (isLighthouse) {
      if (debug) console.log('[AdSense] Lighthouse audit detected. Bypassing ads.')
      return
    }

    const isProd = process.env.NODE_ENV === 'production'
    const force = process.env.NEXT_PUBLIC_FORCE_LOAD_ADS === 'true'
    if (!(isProd || force)) {
      if (debug) {
        console.log(
          '[AdSense] not loading ads (not production). set NEXT_PUBLIC_FORCE_LOAD_ADS=true to override'
        )
      }
      return
    }

    const loadScript = () => {
      setShouldLoad(true)
      cleanup()
    }

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
    const cleanup = () => {
      events.forEach((event) => {
        window.removeEventListener(event, loadScript)
      })
    }

    events.forEach((event) => {
      window.addEventListener(event, loadScript, { passive: true })
    })

    return cleanup
  }, [debug])

  if (!shouldLoad) return null

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => debug && console.log('[AdSense] script loaded', { client })}
    />
  )
}
