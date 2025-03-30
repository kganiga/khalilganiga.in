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
  // Filter for stories first
  const storyPosts = posts.filter((post) => post.tags?.includes('stories'))

  if (storyPosts.length === 0) return null

  // Select the first featured story, fallback to the first story if none are featured
  const featuredStory = storyPosts.find((post) => post.isfeatured) || storyPosts[0]

  // Get remaining stories (excluding the featured one)
  const remainingStories = storyPosts.filter((post) => post.slug !== featuredStory.slug).slice(0, 4)

  return (
    <section className="py-6">
      <h2 className="pb-4 text-left text-2xl font-bold text-gray-900 dark:text-gray-100">
        Featured Musings
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Left Side - Big Featured Story */}
        <div className="md:col-span-2">
          <Link href={`/blog/${featuredStory.slug}`} className="group">
            <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
              <Image
                src={featuredStory.images?.[0] || '/static/placeholder.jpg'}
                alt={featuredStory.title}
                width={800}
                height={500}
                priority
                className="h-full w-full object-cover transition-opacity duration-300 ease-in-out"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 text-white">
                <h2 className="text-2xl font-bold">{featuredStory.title}</h2>
                <p className="text-sm">{featuredStory.excerpt}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Side - Fixed 4 Small Stories */}
        <div className="flex flex-col gap-4">
          {remainingStories.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="relative h-[90px] w-full overflow-hidden rounded-lg">
                <Image
                  src={post.images?.[0] || '/static/placeholder.jpg'}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="h-full w-full object-cover transition-opacity duration-300 ease-in-out"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 text-white">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
