'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function AdSense({ client = 'ca-pub-9693146779273135' }: { client?: string }) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const debug = process.env.NEXT_PUBLIC_ADS_DEBUG_ADS === 'true'

  useEffect(() => {
    // Load ads only in production by default. Use NEXT_PUBLIC_FORCE_LOAD_ADS=true
    // to force loading in development for testing.
    const isProd = process.env.NODE_ENV === 'production'
    const force = process.env.NEXT_PUBLIC_FORCE_LOAD_ADS === 'true'
    if (isProd || force) {
      setShouldLoad(true)
    } else if (debug) {
      // allow debug logs but don't load the script
      console.log(
        '[AdSense] not loading ads (not production). set NEXT_PUBLIC_FORCE_LOAD_ADS=true to override'
      )
    }
  }, [])

  if (!shouldLoad) return null

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
      onLoad={() => debug && console.log('[AdSense] script loaded', { client })}
    />
  )
}
