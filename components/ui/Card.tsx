import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded border bg-white p-4 shadow-sm dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  )
}
