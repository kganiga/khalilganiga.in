import React from 'react'
import Link from '@/components/Link'

interface TagProps {
  text: string
  href?: string
}

export default function Tag({ text, href }: TagProps) {
  const inner = (
    <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
      {text}
    </span>
  )
  if (href) return <Link href={href}>{inner}</Link>
  return inner
}
