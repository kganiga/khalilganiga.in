import React from 'react'
import Link from '@/components/Link'
import Img from '@/components/Image'

interface PostMetaProps {
  date: string
  readingTime?: string
  author?: { name: string; href?: string; avatar?: string }
}

export default function PostMeta({ date, readingTime, author }: PostMetaProps) {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
      <time dateTime={date}>{date}</time>
      {readingTime && <span>• {readingTime}</span>}
      {author && (
        <span className="flex items-center gap-2">
          {author.avatar && (
            <Img
              src={author.avatar}
              alt={author.name}
              className="h-7 w-7 rounded-full object-cover"
              width={40}
              height={40}
            />
          )}
          {author.href ? (
            <Link
              href={author.href}
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {author.name}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {author.name}
            </span>
          )}
        </span>
      )}
    </div>
  )
}
