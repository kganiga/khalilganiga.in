'use client'

import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import { allStories } from 'contentlayer/generated'
import type { Story } from 'contentlayer/generated'
import Image from 'next/image'
import React from 'react'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'

export default function StoriesPage() {
  const storiesPerPage = 5
  const [currentPage, setCurrentPage] = React.useState(1)
  const totalPages = Math.ceil(allStories.length / storiesPerPage)

  const sortedStories = allStories
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const paginatedStories = sortedStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  )

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <PageHeader
        title="Musings"
        subtitle="Dive into stories, reflections, and creative narratives."
        style="text-4xl font-bold dark:text-primary-700"
      />
      <div className="mx-auto max-w-screen-xl p-5 sm:p-10 md:p-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedStories.map((story: Story) => {
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/stories"
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}
