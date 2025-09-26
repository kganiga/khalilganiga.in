'use client'

interface LogoProps {
  className?: string
  title?: string
}

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Logo({ className, title }: LogoProps) {
  // Render a non-anchor wrapper to avoid nested <a> when callers wrap Logo with a Link
  return (
    <span
      className={cn('group relative inline-flex select-none', className)}
      aria-label={title}
      title={title}
    >
      <div className="relative inline-flex items-center">
        <span className="flex items-center font-mono text-3xl font-semibold text-gray-900 transition-colors dark:text-gray-100">
          {'{'}
          <span className="mx-1 text-primary-600 transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-primary-400">
            _
          </span>
          <span className="text-[1.4em] font-[Noto_Sans_Telugu] text-primary-500 transition-colors group-hover:text-primary-600 dark:text-primary-400 dark:group-hover:text-primary-300">
            ఖ
          </span>
          {'}'}
        </span>
        <div className="absolute -bottom-1.5 left-0 h-[2px] w-0 bg-gradient-to-r from-primary-500/0 via-primary-500 to-primary-500/0 transition-all duration-300 ease-in-out group-hover:w-full dark:from-primary-400/0 dark:via-primary-400 dark:to-primary-400/0" />
      </div>
      {title && <span className="sr-only">{title}</span>}
    </span>
  )
}

export default Logo
