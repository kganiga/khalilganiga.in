'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  title: string
  slug: string
  images?: string[]
  excerpt: string
  tags: string[]
  isfeatured?: boolean
}

interface StorySliderProps {
  posts: Post[]
}

export default function FeaturedMusings({ posts }: StorySliderProps) {
  const storyPosts = posts.filter((post) => post.tags?.includes('stories'))

  if (storyPosts.length === 0) return null

  const featuredStory = storyPosts.find((post) => post.isfeatured) || storyPosts[0]
  const remainingStories = storyPosts.filter((post) => post.slug !== featuredStory.slug).slice(0, 4)

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 dark:from-gray-800 dark:to-gray-900">
      <h2 className="pb-8 text-center text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        Featured Musings
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Featured Story */}
        <div className="md:col-span-2">
          <Link
            href={`/blog/${featuredStory.slug}`}
            className="group block overflow-hidden rounded-xl shadow-lg dark:shadow-xl dark:ring-1 dark:ring-gray-700"
          >
            <div className="relative h-[450px] w-full">
              <Image
                src={featuredStory.images?.[0] || '/static/placeholder.jpg'}
                alt={featuredStory.title}
                width={800}
                height={500}
                priority
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 text-white">
                <h3 className="text-3xl font-bold">{featuredStory.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm">{featuredStory.excerpt}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Smaller Stories */}
        <div className="flex flex-col gap-6">
          {remainingStories.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-lg shadow-md hover:shadow-lg dark:shadow-lg dark:ring-1 dark:ring-gray-700"
            >
              <div className="relative h-[150px] w-full">
                <Image
                  src={post.images?.[0] || '/static/placeholder.jpg'}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
                  <h4 className="text-xl font-semibold">{post.title}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
