import React from 'react'
import Link from '@/components/Link'
import Img from '@/components/Image'

interface AuthorCardProps {
  name: string
  bio?: string
  avatar?: string
  href?: string
}

export default function AuthorCard({ name, bio, avatar, href }: AuthorCardProps) {
  const content = (
    <div className="flex items-center gap-4">
      {avatar && (
        <Img
          src={avatar}
          alt={name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover"
        />
      )}
      <div>
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</div>
        {bio && <div className="text-sm text-gray-600 dark:text-gray-400">{bio}</div>}
      </div>
    </div>
  )

  if (href) return <Link href={href}>{content}</Link>
  return content
}
