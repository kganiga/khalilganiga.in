import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'
import { allStories } from 'contentlayer/generated'
import type { Story } from 'contentlayer/generated'
import Image from 'next/image'
import React from 'react'
import PageHeader from '@/components/PageHeader'

export default function StoriesPage() {
  // Ensure sorting by date in descending order
  const sortedStories = allStories
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <>
      <PageHeader
        title="Musings"
        subtitle="Dive into stories, reflections, and creative narratives."
        style="text-4xl font-bold  dark:text-primary-700"
      />
      <div className="mx-auto max-w-screen-xl p-5 sm:p-10 md:p-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {sortedStories.map((story: Story) => {
            let imageList: string[] = []
            if (story.images) {
              imageList = typeof story.images === 'string' ? [story.images] : story.images
            }
            const imageUrl = imageList.length > 0 ? imageList[0] : null

            return story.slug ? (
              <div key={story.slug} className="overflow-hidden rounded shadow-lg">
                {imageUrl && (
                  <div className="relative">
                    <Link href={`/stories/${story.slug}`} className="block">
                      <Image
                        className="w-full"
                        src={imageUrl}
                        alt={story.title}
                        width={500}
                        height={300}
                        objectFit="cover"
                        priority={false}
                      />
                      <div className="absolute bottom-0 left-0 right-0 top-0 bg-gray-900 opacity-25 transition duration-300 hover:bg-transparent"></div>
                    </Link>
                  </div>
                )}
                <div className="px-6 py-4">
                  <Link
                    href={`/stories/${story.slug}`}
                    className="inline-block text-lg font-semibold transition duration-500 ease-in-out hover:text-indigo-600"
                  >
                    {story.title}
                  </Link>
                  <p className="mt-2 text-sm text-gray-500">{story.summary}</p>
                </div>
              </div>
            ) : null
          })}
        </div>
      </div>
    </>
  )
}
