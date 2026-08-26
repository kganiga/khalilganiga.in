'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { allStories } from 'contentlayer/generated'
import type { Story } from 'contentlayer/generated'
import { ArrowRight, BookOpenText, CalendarDays, Search, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const STORIES_PER_PAGE = 6

export default function StoriesPage() {
  const [pagesLoaded, setPagesLoaded] = React.useState(1)
  const [query, setQuery] = React.useState('')

  const sortedStories = React.useMemo(
    () =>
      allStories.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  )

  const featuredStory = React.useMemo(
    () => sortedStories.find((story) => story.isfeatured) || sortedStories[0],
    [sortedStories]
  )

  const filteredStories = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return sortedStories

    return sortedStories.filter((story) => {
      const searchableText = [story.title, story.summary, story.tags?.join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [query, sortedStories])

  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE)
  const visibleStories = React.useMemo(
    () => filteredStories.slice(0, pagesLoaded * STORIES_PER_PAGE),
    [filteredStories, pagesLoaded]
  )

  React.useEffect(() => {
    setPagesLoaded(1)
  }, [query])

  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (pagesLoaded >= totalPages) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPagesLoaded((p) => Math.min(p + 1, totalPages))
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [pagesLoaded, totalPages])

  const getImageUrl = (story: Story) => {
    const imageList = story.images
      ? typeof story.images === 'string'
        ? [story.images]
        : story.images
      : []

    return imageList.length > 0 ? imageList[0] : '/static/images/ocean.jpeg'
  }

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(date))

  return (
    <div className="space-y-12 pb-16">
      <section className="relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(14,165,233,0.08)_46%,rgba(244,63,94,0.10))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(14,165,233,0.08)_46%,rgba(244,63,94,0.12))]" />
        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-900/80 dark:bg-emerald-950/70 dark:text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Stories, reflections, and creative notes
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              Musings
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              A collection of short stories and reflective pieces that move between memory,
              imagination, people, and place.
            </p>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {allStories.length}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Musings
                </div>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {sortedStories.filter((story) => story.isfeatured).length}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Featured
                </div>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {new Set(sortedStories.flatMap((story) => story.tags || [])).size}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Themes
                </div>
              </div>
            </div>
          </div>

          {featuredStory && (
            <Card className="overflow-hidden p-0">
              <Link href={`/stories/${featuredStory.slug}`} className="group block">
                <div className="relative h-72 overflow-hidden sm:h-96">
                  <Image
                    src={getImageUrl(featuredStory)}
                    alt={featuredStory.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    <BookOpenText className="h-4 w-4" />
                    Featured musing
                  </div>
                  <h2 className="text-2xl font-semibold capitalize leading-tight text-gray-950 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {featuredStory.title}
                  </h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {featuredStory.summary}
                  </p>
                </div>
              </Link>
            </Card>
          )}
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
              Browse the archive
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
              All Musings
            </h2>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search musings"
              className="h-11 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-950 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-primary-800 dark:focus:ring-primary-950"
            />
          </div>
        </div>

        {visibleStories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleStories.map((story: Story) => (
              <Card
                key={story.slug}
                className="group overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:hover:border-primary-900"
              >
                <Link href={`/stories/${story.slug}`} className="group block">
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={getImageUrl(story)}
                      alt={story.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                      <CalendarDays className="h-4 w-4" />
                      <time dateTime={story.date}>{formatDate(story.date)}</time>
                    </div>
                    <h3 className="text-lg font-semibold capitalize leading-snug text-gray-950 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                      {story.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {story.summary}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                      Read musing
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No musings matched your search.
            </p>
          </Card>
        )}

        <div ref={sentinelRef} className="mt-8 flex justify-center">
          {pagesLoaded < totalPages ? (
            <Button
              variant="outline"
              onClick={() => setPagesLoaded((p) => Math.min(p + 1, totalPages))}
            >
              Load more musings
            </Button>
          ) : (
            visibleStories.length > 0 && (
              <div className="py-4 text-sm text-gray-600 dark:text-gray-300">
                You have reached the end.
              </div>
            )
          )}
        </div>
      </section>
    </div>
  )
}
