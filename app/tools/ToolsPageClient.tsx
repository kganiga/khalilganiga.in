'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { allTools } from 'contentlayer/generated'
import type { Tool } from 'contentlayer/generated'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Bot,
  CalendarDays,
  ExternalLink,
  Globe,
  Laptop,
  Puzzle,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react'

// Helper to determine tool category and external link if not explicitly in frontmatter
function getToolMeta(tool: Tool) {
  const slug = tool.slug.toLowerCase()
  const title = tool.title.toLowerCase()
  const tags = (tool.tags || []).map((t) => t.toLowerCase())

  if (slug.includes('oak-index') || title.includes('oak index')) {
    return {
      category: 'Web App',
      icon: Globe,
      color:
        'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/70 border-sky-200 dark:border-sky-900',
      actionUrl: tool.toolUrl || 'https://oak-index-studio.netlify.app/',
      actionLabel: 'Launch App',
    }
  }

  if (slug.includes('aem-docs') || slug.includes('i-got-tired-of-checking')) {
    return {
      category: 'Telegram Bot',
      icon: Bot,
      color:
        'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-900',
      actionUrl: tool.toolUrl || 'https://t.me/aem_docs_monitor_bot',
      actionLabel: 'Open Bot',
    }
  }

  if (slug.includes('movie-maven') || title.includes('movie maven')) {
    return {
      category: 'Telegram Bot',
      icon: Bot,
      color:
        'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/70 border-violet-200 dark:border-violet-900',
      actionUrl: tool.toolUrl || 'https://t.me/MovieMvnBot',
      actionLabel: 'Open Bot',
    }
  }

  if (slug.includes('horoscope') || title.includes('horoscope')) {
    return {
      category: 'Telegram Bot',
      icon: Bot,
      color:
        'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-900',
      actionUrl: tool.toolUrl || 'https://t.me/AstroHoroBot',
      actionLabel: 'Open Bot',
    }
  }

  if (slug.includes('quicklink-navigator') || tags.includes('browser extension')) {
    return {
      category: 'Browser Extension',
      icon: Puzzle,
      color:
        'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-900',
      actionUrl:
        tool.toolUrl ||
        'https://microsoftedge.microsoft.com/addons/detail/eejciahagkecklgligbmckkdobklfgng',
      actionLabel: 'Get Extension',
    }
  }

  if (slug.includes('bookmarklet') || tags.includes('bookmarklet')) {
    return {
      category: 'Bookmarklet',
      icon: Bookmark,
      color:
        'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/70 border-pink-200 dark:border-pink-900',
      actionUrl: undefined,
      actionLabel: undefined,
    }
  }

  if (
    slug.includes('decompiler') ||
    slug.includes('autoclicker') ||
    tags.includes('application') ||
    tags.includes('utilities')
  ) {
    return {
      category: 'Desktop Utility',
      icon: Laptop,
      color:
        'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-900',
      actionUrl: undefined,
      actionLabel: undefined,
    }
  }

  return {
    category: 'Developer Tool',
    icon: Wrench,
    color:
      'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/70 border-primary-200 dark:border-primary-900',
    actionUrl: tool.toolUrl || undefined,
    actionLabel: 'Open Tool',
  }
}

export default function ToolsPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const sortedTools = useMemo(
    () =>
      allTools
        .filter((tool) => tool.draft !== true)
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  )

  const categories = useMemo(() => {
    const set = new Set<string>()
    sortedTools.forEach((tool) => {
      const { category } = getToolMeta(tool)
      set.add(category)
    })
    return ['All', ...Array.from(set)]
  }, [sortedTools])

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return sortedTools.filter((tool) => {
      const { category } = getToolMeta(tool)

      if (selectedCategory !== 'All' && category !== selectedCategory) {
        return false
      }

      if (!q) return true

      const searchContent = [tool.title, tool.summary, category, ...(tool.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchContent.includes(q)
    })
  }, [sortedTools, searchQuery, selectedCategory])

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(date))

  return (
    <div className="space-y-12 pb-16">
      {/* Header / Hero Section */}
      <section className="relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(14,165,233,0.08)_45%,rgba(99,102,241,0.12))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(14,165,233,0.08)_45%,rgba(99,102,241,0.12))]" />
        <div className="px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-900/80 dark:bg-emerald-950/70 dark:text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Custom Utilities, Bots & Extensions
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              Tools Created
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              A curated catalog of standalone developer tools, automation bots, desktop utilities,
              and browser extensions built to eliminate repetitive work and boost engineering
              productivity.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {sortedTools.length}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Total Tools
                </div>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {categories.length - 1}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Categories
                </div>
              </div>
              <div className="col-span-2 rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70 sm:col-span-1">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  Free
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Open & Free
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'border border-primary-600 bg-primary-600 text-white shadow-sm dark:border-primary-500 dark:bg-primary-500'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary-900 dark:hover:text-primary-400'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              aria-label="Search tools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools & bots..."
              className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm text-gray-950 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-primary-800 dark:focus:ring-primary-950"
            />
          </div>
        </div>

        {/* Tools List View */}
        <div className="space-y-4">
          {filteredTools.length === 0 ? (
            <Card className="p-12 text-center">
              <Wrench className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-3 text-lg font-semibold text-gray-950 dark:text-white">
                No tools found
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Try searching for a different keyword or select another category.
              </p>
            </Card>
          ) : (
            filteredTools.map((tool) => {
              const {
                category,
                icon: CategoryIcon,
                color,
                actionUrl,
                actionLabel,
              } = getToolMeta(tool)

              return (
                <Card
                  key={tool.slug}
                  className="group overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:hover:border-primary-900"
                >
                  <div className="grid gap-0 md:grid-cols-[auto_1fr_auto]">
                    {/* Icon / Category Indicator */}
                    <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/40 md:w-36 md:flex-col md:justify-center md:border-b-0 md:border-r md:p-6 md:text-center">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border ${color} shadow-sm`}
                      >
                        <CategoryIcon className="h-6 w-6" />
                      </div>
                      <span className="rounded-md px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300 md:mt-2">
                        {category}
                      </span>
                    </div>

                    {/* Main Content Info */}
                    <div className="flex flex-col justify-between p-5 sm:p-6">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="inline-flex items-center gap-1.5 font-medium">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <time dateTime={tool.date}>{formatDate(tool.date)}</time>
                          </div>
                        </div>

                        <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-950 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                          <Link href={`/tools/${tool.slug}`} className="hover:underline">
                            {tool.title}
                          </Link>
                        </h2>

                        <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {tool.summary}
                        </p>
                      </div>

                      {tool.tags && tool.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {tool.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions Column */}
                    <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800/60 dark:bg-gray-900/20 md:w-56 md:flex-col md:justify-center md:border-l md:border-t-0 md:p-6">
                      {actionUrl && actionLabel ? (
                        <Button
                          asChild
                          size="sm"
                          className="w-full justify-center gap-1.5 shadow-sm"
                        >
                          <a href={actionUrl} target="_blank" rel="noopener noreferrer">
                            <span>{actionLabel}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      ) : null}

                      <Button
                        asChild
                        size="sm"
                        variant={actionUrl ? 'outline' : 'default'}
                        className="w-full justify-center gap-1.5"
                      >
                        <Link href={`/tools/${tool.slug}`}>
                          <span>Read Guide</span>
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
