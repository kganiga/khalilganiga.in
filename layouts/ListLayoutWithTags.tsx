'use client'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import type { Blog } from 'contentlayer/generated'
import { slug } from 'github-slugger'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookMarked,
  CalendarDays,
  Search,
  Sparkles,
  Tags,
} from 'lucide-react'
import Link from '@/components/Link'
import { usePathname } from 'next/navigation'
import { CoreContent } from 'pliny/utils/contentlayer'
import { formatDate } from 'pliny/utils/formatDate'
import { useMemo, useState } from 'react'

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function formatTag(tag: string) {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <nav className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
      {prevPage ? (
        <Button asChild variant="outline">
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="gap-2 break-normal"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Link>
        </Button>
      ) : (
        <Button disabled variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
      )}

      <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      {nextPage ? (
        <Button asChild variant="outline">
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="gap-2 break-normal"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button disabled variant="outline">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState('')
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const topTags = sortedTags.slice(0, 14)

  const featuredPost = useMemo(
    () => posts.find((post) => post.isfeatured && !post.tags?.includes('stories')) || posts[0],
    [posts]
  )

  const filteredBlogPosts = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLowerCase()
    if (!normalizedQuery) return posts

    return posts.filter((post) => {
      const searchContent = [post.title, post.summary, post.tags?.join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchContent.includes(normalizedQuery)
    })
  }, [posts, searchValue])

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <div className="space-y-12 pb-16">
      <section className="relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(99,102,241,0.08)_45%,rgba(16,185,129,0.12))] dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(99,102,241,0.08)_45%,rgba(16,185,129,0.12))]" />
        <div className="grid gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800 dark:border-sky-900/80 dark:bg-sky-950/70 dark:text-sky-200">
              <Sparkles className="h-4 w-4" />
              Engineering notes and practical guides
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              {title === 'All Posts' ? 'Blog' : title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              Field notes on AEM, Java, web development, performance, tooling, and the little fixes
              that save future-you an afternoon.
            </p>

            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {posts.length}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Articles
                </div>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {Object.keys(tagCounts).length}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Topics
                </div>
              </div>
              <div className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70">
                <div className="text-2xl font-bold text-gray-950 dark:text-white">
                  {posts.filter((post) => post.isfeatured).length}
                </div>
                <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                  Featured
                </div>
              </div>
            </div>
          </div>

          {featuredPost && (
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <BookMarked className="h-4 w-4" />
                Featured article
              </div>
              <Link
                href={`/${featuredPost.path}`}
                className="text-2xl font-semibold capitalize leading-tight text-gray-950 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
              >
                {featuredPost.title}
              </Link>
              <p className="mt-4 line-clamp-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {featuredPost.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {featuredPost.tags?.slice(0, 4).map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${slug(tag)}`}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary-900 dark:hover:text-primary-400"
                  >
                    {formatTag(tag)}
                  </Link>
                ))}
              </div>
              <Button asChild className="mt-6 gap-2" variant="outline">
                <Link href={`/${featuredPost.path}`} className="break-normal">
                  Read featured
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card>
          )}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[17rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-950 dark:text-white">
              <Tags className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              Popular Topics
            </div>
            <nav className="flex flex-wrap gap-2 lg:flex-col">
              {topTags.map((tag) => {
                const href = `/tags/${slug(tag)}`
                const active = pathname === href
                return (
                  <Link
                    key={tag}
                    href={href}
                    className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-900 dark:bg-primary-950 dark:text-primary-300'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary-900 dark:hover:text-primary-400'
                    }`}
                    aria-label={`View posts tagged ${tag}`}
                  >
                    <span>{formatTag(tag)}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {tagCounts[tag]}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </Card>
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
                Browse the archive
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                Latest Articles
              </h2>
            </div>
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                aria-label="Search articles"
                value={searchValue}
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="h-11 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-950 shadow-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:border-primary-800 dark:focus:ring-primary-950"
              />
            </div>
          </div>

          <div className="space-y-4">
            {!displayPosts.length && (
              <Card className="p-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300">No posts found.</p>
              </Card>
            )}

            {displayPosts.map((post) => {
              const { path, date, title, summary, tags } = post
              return (
                <Card
                  key={path}
                  className="group overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:hover:border-primary-900"
                >
                  <article className="grid gap-0 md:grid-cols-[9rem_1fr]">
                    <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70 md:block md:border-b-0 md:border-r md:text-center">
                      <CalendarDays className="h-5 w-5 text-gray-500 dark:text-gray-400 md:mx-auto" />
                      <time
                        dateTime={date}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mt-2"
                      >
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-semibold capitalize leading-snug text-gray-950 dark:text-white">
                          <Link
                            href={`/${path}`}
                            className="hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            {title}
                          </Link>
                        </h3>
                        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-gray-400 transition group-hover:text-primary-500" />
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                        {summary}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags?.slice(0, 5).map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${slug(tag)}`}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary-900 dark:hover:text-primary-400"
                          >
                            {formatTag(tag)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </article>
                </Card>
              )
            })}
          </div>

          {pagination && pagination.totalPages > 1 && !searchValue && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </section>
    </div>
  )
}
