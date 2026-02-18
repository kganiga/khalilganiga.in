'use client'

import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import { allStories } from 'contentlayer/generated'
import type { Story } from 'contentlayer/generated'
import Image from 'next/image'
import React from 'react'
import PageHeader from '@/components/PageHeader'

export default function StoriesPage() {
  const storiesPerPage = 5
  const [pagesLoaded, setPagesLoaded] = React.useState(1)
  const totalPages = Math.ceil(allStories.length / storiesPerPage)

  const sortedStories = React.useMemo(
    () =>
      allStories.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    []
  )

  const visibleStories = React.useMemo(
    () => sortedStories.slice(0, pagesLoaded * storiesPerPage),
    [sortedStories, pagesLoaded]
  )

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

  return (
    <>
      <PageHeader
        title="Musings"
        subtitle="Dive into stories, reflections, and creative narratives."
        style="text-4xl font-bold dark:text-primary-700"
      />
      <div className="mx-auto max-w-screen-xl p-5 sm:p-10 md:p-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleStories.map((story: Story) => {
            const imageList = story.images
              ? typeof story.images === 'string'
                ? [story.images]
                : story.images
              : []
            const imageUrl = imageList.length > 0 ? imageList[0] : '/static/placeholder.jpg'

            return (
              <div
                key={story.slug}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <Link href={`/stories/${story.slug}`} className="group block">
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={story.title}
                      width={500}
                      height={300}
                      className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {story.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                      {story.summary}
                    </p>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          {pagesLoaded < totalPages ? (
            <div className="py-4 text-sm text-gray-600 dark:text-gray-300">Loading more…</div>
          ) : (
            <div className="py-4 text-sm text-gray-600 dark:text-gray-300">No more stories</div>
          )}
        </div>
      </div>
    </>
  )
}
