'use client'

import React, { useState, useEffect, CSSProperties, memo } from 'react'

const CHARACTER_POOL = [
  '{}',
  '=>',
  '()',
  '[]',
  '<>',
  '/>',
  ';',
  ':',
  '!',
  '#',
  '&&',
  '||',
  '===',
  '!=',
  'అ',
  'ఆ',
  'ఇ',
  'ఈ',
  'ఉ',
  'ఊ',
  'క',
  'ఖ',
  'గ',
  'ఘ',
  'త',
  'థ',
  'ద',
  'ధ',
  'న',
  'ప',
  'ఫ',
  'బ',
  'భ',
  'మ',
  'య',
  'ర',
  'ల',
  'వ',
]

const COLOR_CLASSES = [
  'text-sky-500/80 dark:text-sky-400/80',
  'text-indigo-500/80 dark:text-indigo-400/80',
  'text-green-500/80 dark:text-green-400/80',
  'text-pink-500/80 dark:text-pink-400/80',
  'text-amber-500/80 dark:text-amber-400/80',
  'text-gray-500/80 dark:text-gray-400/80',
]

interface Character {
  id: number
  char: string
  colorClass: string
  style: CSSProperties
}

const BackgroundAnimation = memo(() => {
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    const generatedChars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      char: CHARACTER_POOL[Math.floor(Math.random() * CHARACTER_POOL.length)],
      colorClass: COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)],
      style: {
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 1.5 + 0.5}rem`,
        animationDuration: `${Math.random() * 20 + 25}s`,
        animationDelay: `-${Math.random() * 40}s`,
      },
    }))
    setCharacters(generatedChars)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 blur-[1px] filter">
      {characters.map((item) => (
        <span
          key={item.id}
          className={`animate-flow absolute top-0 ${item.colorClass}`}
          style={item.style}
        >
          {item.char}
        </span>
      ))}
    </div>
  )
})

BackgroundAnimation.displayName = 'BackgroundAnimation'

export default BackgroundAnimation
