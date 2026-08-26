'use client'

import Link from '@/components/Link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import tagData from 'app/tag-data.json'
import { slug } from 'github-slugger'
import { ArrowRight, Hash, Search, Sparkles, Tags } from 'lucide-react'
import { useMemo, useState } from 'react'

function formatTag(tag: string) {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function TagsPageClient() {
  const [query, setQuery] = useState('')
  const tagCounts = tagData as Record<string, number>
  const sortedTags = useMemo(
    () => Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]),
    [tagCounts]
  )
  const filteredTags = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return sortedTags

    return sortedTags.filter((tag) => formatTag(tag).toLowerCase().includes(normalizedQuery))
  }, [query, sortedTags])
  const featuredTags = sortedTags.slice(0, 6)
  const totalPosts = Object.values(tagCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-12 pb-16">
      <section className="relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(99,102,241,0.08)_45%,rgba(16,185,129,0.12))] dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(99,102,241,0.08)_45%,rgba(16,185,129,0.12))]" />
        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800 dark:border-sky-900/80 dark:bg-sky-950/70 dark:text-sky-200">
              <Sparkles className="h-4 w-4" />
              Topic map
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              Tags
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              Browse the ideas, tools, frameworks, and recurring themes behind the technical notes
              on this site.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {sortedTags.length}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Topics
                </div>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">{totalPosts}</div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Tag uses
                </div>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {tagCounts[sortedTags[0]] || 0}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Top tag
                </div>
              </div>
            </div>
          </div>

          <Card className="p-6">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">
              <Tags className="h-4 w-4" />
              Popular topics
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${slug(tag)}`}
                  className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary-900 dark:hover:text-primary-400"
                  aria-label={`View posts tagged ${tag}`}
                >
                  <span className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    {formatTag(tag)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{tagCounts[tag]}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
              Browse all
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
              Topic Directory
            </h2>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tags"
              className="h-11 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-950 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-primary-800 dark:focus:ring-primary-950"
            />
          </div>
        </div>

        {filteredTags.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTags.map((tag) => (
              <Card
                key={tag}
                className="group p-5 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:hover:border-primary-900"
              >
                <Link href={`/tags/${slug(tag)}`} aria-label={`View posts tagged ${tag}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                        <Hash className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-950 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                        {formatTag(tag)}
                      </h3>
                    </div>
                    <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      {tagCounts[tag]}
                    </span>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                    View posts
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">No tags matched your search.</p>
            <Button className="mt-4" variant="outline" onClick={() => setQuery('')}>
              Clear search
            </Button>
          </Card>
        )}
      </section>
    </div>
  )
}
