'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface LogoProps {
  className?: string
  title?: string
}

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Logo({ className, title }: LogoProps) {
  const pathname = usePathname() || ''
  const isTech = pathname.startsWith('/blog') || pathname.startsWith('/tags')
  const [stage, setStage] = useState<'K' | 'disintegrateToKha' | 'Kha' | 'disintegrateToK'>('K')

  useEffect(() => {
    if (pathname !== '/') return

    let active = true

    const runCycle = async () => {
      while (active) {
        // Show K for 2.5s
        await new Promise((resolve) => setTimeout(resolve, 2500))
        if (!active) break
        setStage('disintegrateToKha')

        // Transition to Kha (800ms)
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (!active) break
        setStage('Kha')

        // Show Kha for 2.5s
        await new Promise((resolve) => setTimeout(resolve, 2500))
        if (!active) break
        setStage('disintegrateToK')

        // Transition to K (800ms)
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (!active) break
        setStage('K')
      }
    }

    runCycle()

    return () => {
      active = false
    }
  }, [pathname])

  // Render a non-anchor wrapper to avoid nested <a> when callers wrap Logo with a Link
  return (
    <span
      className={cn('group relative inline-flex select-none', className)}
      aria-label={title}
      title={title}
    >
      <style>{`
        @keyframes thanos-dust {
          0% {
            opacity: 1;
            filter: blur(0px);
            transform: translate(0, 0) scale(1);
            text-shadow: none;
          }
          50% {
            opacity: 0.8;
            filter: blur(1px);
            text-shadow: 
              0px 0px 4px rgba(139, 92, 246, 0.6),
              2px -2px 8px rgba(139, 92, 246, 0.4);
          }
          100% {
            opacity: 0;
            filter: blur(4px);
            transform: translate(15px, -15px) scale(1.3);
            text-shadow: 
              12px -12px 16px rgba(139, 92, 246, 0),
              -12px 12px 20px rgba(139, 92, 246, 0);
          }
        }
        @keyframes assemble-in {
          0% {
            opacity: 0;
            filter: blur(6px);
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
        }
        .animate-thanos {
          animation: thanos-dust 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-assemble {
          animation: assemble-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      <div className="relative inline-flex items-center">
        <span className="flex items-center font-mono text-3xl font-semibold text-gray-900 transition-colors dark:text-gray-100">
          {'{'}
          <span className="mx-1 text-primary-600 transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-primary-400">
            _
          </span>
          {pathname === '/' ? (
            <>
              {stage === 'K' && (
                <span className="mx-0.5 font-sans text-[1.25em] font-bold text-primary-500 transition-colors group-hover:text-primary-600 dark:text-primary-400 dark:group-hover:text-primary-300">
                  K
                </span>
              )}
              {stage === 'disintegrateToKha' && (
                <span className="relative inline-flex items-center justify-center">
                  <span className="animate-thanos absolute left-0 top-1/2 mx-0.5 -translate-y-1/2 font-sans text-[1.25em] font-bold text-primary-500">
                    K
                  </span>
                  <span className="animate-assemble text-[1.4em] font-[Noto_Sans_Telugu] text-primary-500">
                    ఖ
                  </span>
                </span>
              )}
              {stage === 'Kha' && (
                <span className="text-[1.4em] font-[Noto_Sans_Telugu] text-primary-500 transition-colors group-hover:text-primary-600 dark:text-primary-400 dark:group-hover:text-primary-300">
                  ఖ
                </span>
              )}
              {stage === 'disintegrateToK' && (
                <span className="relative inline-flex items-center justify-center">
                  <span className="animate-thanos absolute left-0 top-1/2 -translate-y-1/2 text-[1.4em] font-[Noto_Sans_Telugu] text-primary-500">
                    ఖ
                  </span>
                  <span className="animate-assemble mx-0.5 font-sans text-[1.25em] font-bold text-primary-500">
                    K
                  </span>
                </span>
              )}
            </>
          ) : isTech ? (
            <span className="mx-0.5 font-sans text-[1.25em] font-bold text-primary-500 transition-colors group-hover:text-primary-600 dark:text-primary-400 dark:group-hover:text-primary-300">
              K
            </span>
          ) : (
            <span className="text-[1.4em] font-[Noto_Sans_Telugu] text-primary-500 transition-colors group-hover:text-primary-600 dark:text-primary-400 dark:group-hover:text-primary-300">
              ఖ
            </span>
          )}
          {'}'}
        </span>
        <div className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary-500/0 via-primary-500 to-primary-500/0 transition-all duration-300 ease-in-out group-hover:w-full dark:from-primary-400/0 dark:via-primary-400 dark:to-primary-400/0" />
      </div>
      {title && <span className="sr-only">{title}</span>}
    </span>
  )
}

export default Logo
