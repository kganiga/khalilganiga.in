'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export default function AdSense({ client = 'ca-pub-9693146779273135' }: { client?: string }) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Load ads on all devices (including mobile). Keep this client-only so it doesn't
    // affect server rendering or initial HTML. If you later want to restrict ads on
    // very slow connections, we can add a connection check here.
    setShouldLoad(true)
  }, [])

  if (!shouldLoad) return null

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
