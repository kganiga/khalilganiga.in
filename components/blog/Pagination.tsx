import React from 'react'
import Link from '@/components/Link'

interface PaginationProps {
  current: number
  total: number
  basePath?: string
}

export default function Pagination({ current, total, basePath = '' }: PaginationProps) {
  const prev = current > 1 ? `${basePath}/page/${current - 1}` : null
  const next = current < total ? `${basePath}/page/${current + 1}` : null

  return (
    <nav className="flex items-center justify-between">
      <div>
        {prev ? (
          <Link
            href={prev}
            className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800"
          >
            ← Newer
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page {current} of {total}
      </div>
      <div>
        {next ? (
          <Link
            href={next}
            className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800"
          >
            Older →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  )
}
