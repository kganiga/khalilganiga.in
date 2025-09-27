'use client'

import React, { useState, useEffect, CSSProperties, memo } from 'react'
import Link from 'next/link'

// --- CONSTANTS (Moved outside the component for performance) ---

const TAGLINES = [
  {
    h1: 'Logic by Design, Imagination by Heart',
    p: 'Essays on technology, tales in Telugu — crafted with equal measure of reason and wonder.',
  },
  {
    h1: 'The Syntax of Thought, The Rhythm of Emotion',
    p: 'Explore structured code and unstructured musings, living in harmony.',
  },
  {
    h1: 'Compilers & Characters',
    p: 'One world built with rules, the other with freedom — both shaping meaning.',
  },
  {
    h1: 'When Systems Think and Stories Feel',
    p: 'A home for tech blogs and Telugu storytelling.',
  },
  {
    h1: 'Equations of Logic, Equations of the Heart',
    p: 'Because every formula has a story, and every story has its own design.',
  },
  {
    h1: 'Imagination in Brackets, Logic in Verses',
    p: 'A blend of structured reasoning and unbounded creativity.',
  },
]

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

// Colors that work well on both light and dark backgrounds
const COLOR_CLASSES = [
  'text-sky-500/80 dark:text-sky-400/80',
  'text-indigo-500/80 dark:text-indigo-400/80',
  'text-green-500/80 dark:text-green-400/80',
  'text-pink-500/80 dark:text-pink-400/80',
  'text-amber-500/80 dark:text-amber-400/80',
  'text-gray-500/80 dark:text-gray-400/80',
]

// Static CSS for the animation, defined once
const ANIMATION_STYLES = (
  <style>
    {`
      @keyframes flow {
        0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
        10%, 90% { opacity: 1; }
        100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
      }
      .animate-flow {
        animation: flow linear infinite;
        will-change: transform, opacity;
      }
    `}
  </style>
)

// --- TYPE DEFINITIONS ---

interface Character {
  id: number
  char: string
  colorClass: string
  style: CSSProperties
}

interface Tagline {
  h1: string
  p: string
}

// --- SUB-COMPONENTS (Memoized for performance) ---

/**
 * Renders the floating, blurred characters in the background.
 * Memoized to ensure it only renders once.
 */
const BackgroundAnimation = memo(() => {
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    const generatedChars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      char: CHARACTER_POOL[Math.floor(Math.random() * CHARACTER_POOL.length)],
      colorClass: COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)],
      style: {
        left: `${Math.random() * 100}%`,
        fontSize: `${Math.random() * 1.5 + 0.5}rem`,
        animationDuration: `${Math.random() * 20 + 25}s`,
        // NEW: Negative delay makes the animation start immediately in a random state
        animationDelay: `-${Math.random() * 40}s`,
      },
    }))
    setCharacters(generatedChars)
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    // NEW: Added `filter blur-sm` for a depth-of-field effect
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

/**
 * Renders the main hero content.
 * Memoized to prevent re-renders.
 */
const HeroContent = memo(({ tagline }: { tagline: Tagline }) => (
  <div className="relative z-10 w-full max-w-7xl px-4 text-center sm:px-8">
    <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 md:text-xl">
      Hi, I am{' '}
      <span className="font-bold text-primary-600 dark:text-primary-400">Khalil Ganiga</span>.
      Welcome to my space.
    </p>
    <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl">
      {tagline.h1}
    </h1>
    <p className="mx-auto mt-6 max-w-3xl text-base text-gray-700 dark:text-gray-300 md:text-lg">
      {tagline.p}
    </p>
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Link
        href="/blog"
        className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-300 hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
      >
        Tech Articles
      </Link>
      <Link
        href="/stories"
        className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 shadow-md transition-colors duration-300 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
      >
        Telugu Stories
      </Link>
    </div>
    <div className="mt-20 animate-bounce">
      <svg
        className="mx-auto h-8 w-8 text-gray-600 dark:text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
))

HeroContent.displayName = 'HeroContent'

// --- MAIN COMPONENT (Corrected for Hydration) ---

const Hero = () => {
  const [tagline, setTagline] = useState<Tagline>(TAGLINES[0])

  useEffect(() => {
    const randomTagline = TAGLINES[Math.floor(Math.random() * TAGLINES.length)]
    setTagline(randomTagline)
  }, [])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-white font-sans transition-colors duration-500 dark:bg-gray-900">
      {ANIMATION_STYLES}
      <BackgroundAnimation />
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center px-4 py-8 text-center sm:px-8 sm:py-12">
        <div className="mb-6">
          <img
            src="/static/images/author.jpg"
            alt="Khalil Ganiga"
            className="h-64 w-64 rounded-full shadow-lg grayscale filter"
          />
        </div>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300 md:text-xl">
          Hi, I am{' '}
          <span className="font-bold text-primary-600 dark:text-primary-400">Khalil Ganiga</span>.
          Welcome to my space.
        </p>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl">
          {tagline.h1}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base text-gray-700 dark:text-gray-300 md:text-lg">
          {tagline.p}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/blog"
            className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-300 hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            Tech Articles
          </Link>
          <Link
            href="/stories"
            className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 shadow-md transition-colors duration-300 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Telugu Stories
          </Link>
        </div>
        <div className="mt-10 animate-bounce">
          <svg
            className="mx-auto h-8 w-8 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Hero
