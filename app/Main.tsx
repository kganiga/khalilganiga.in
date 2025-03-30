import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { ArrowRight } from 'lucide-react'
import Hero from '@/components/Hero'
import SocialIcons from '@/components/SocialIcons'
import PopularTags from '@/components/PopularTags'
import tagData from 'app/tag-data.json'
import FeaturedArticles from '@/components/FeaturedArticles'
import FeaturedMusings from '@/components/FeaturedMusings'
import { allStories } from 'contentlayer/generated'
import Image from 'next/image'

const MAX_DISPLAY = 5
const MAX_FEATURED_STORIES = 5

export default function Home({ posts }) {
  const tagCounts = tagData as Record<string, number>
  const sortedStories = allStories
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const featuredStories = sortedStories.filter((story) => story.isfeatured)
  const remainingStories = sortedStories.filter((story) => !story.isfeatured)
  const finalStories = [...featuredStories, ...remainingStories].slice(0, MAX_FEATURED_STORIES)

  return (
    <>
      <div className="my-6 flex flex-col gap-x-12 lg:mb-12 lg:flex-row">
        <Hero />
      </div>
      <hr className="my-4 dark:border-gray-700" />
      <div className="order-1 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-2 pb-8 pt-6 md:space-y-5">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Latest Writing
            </h2>
          </div>

          <div className="divide-y divide-gray-200 pr-8 dark:divide-gray-700">
            {!posts.length && (
              <li className="py-4">
                <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
              </li>
            )}
            {posts.slice(0, MAX_DISPLAY).map((post) => {
              const { slug, date, title, summary, tags } = post
              return (
                <div key={slug} className="py-12">
                  <article>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            <Link href={`/blog/${slug}`}>{title}</Link>
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 5).map((tag) => (
                              <Link
                                key={tag}
                                href={`/tags/${tag.replace(/\s+/g, '-').toLowerCase()}`}
                                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                {tag.replace(/-/g, ' ')}
                              </Link>
                            ))}
                          </div>
                        </div>
                        <p className="max-w-4xl text-gray-600 dark:text-gray-400">{summary}</p>
                      </div>
                    </div>
                  </article>
                </div>
              )
            })}
            {posts.length > MAX_DISPLAY && (
              <div className="flex justify-end pt-6">
                <Link
                  href="/blog"
                  className="group inline-flex items-center text-sm transition-colors"
                >
                  View archive
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="order-3 hidden space-y-6 lg:block">
          <div className="rounded-md border border-solid border-gray-300 p-6 text-center dark:border-gray-700">
            <SocialIcons />
          </div>
          <div className="rounded-md border border-solid border-gray-300 p-3 text-center dark:border-gray-700">
            <FeaturedArticles posts={posts} />
          </div>
          <div className="rounded-md border border-solid border-gray-300 p-3 text-center dark:border-gray-700">
            <PopularTags tagCounts={tagCounts} />
          </div>
        </div>
      </div>
      <div className="order-2 mt-12 divide-y divide-gray-200 dark:divide-gray-700 lg:order-3">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h2 className="font-mono text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Featured Stories
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {finalStories.length > 0 && (
            <div
              key={finalStories[0].slug}
              className="overflow-hidden rounded-lg shadow-lg md:col-span-2"
            >
              {finalStories[0].images?.length > 0 && (
                <Link href={`/stories/${finalStories[0].slug}`} className="block">
                  <Image
                    className="h-96 w-full object-cover"
                    src={finalStories[0].images[0]}
                    alt={finalStories[0].title}
                    width={1200}
                    height={600}
                    priority={true}
                  />
                </Link>
              )}
              <div className="p-6">
                <Link
                  href={`/stories/${finalStories[0].slug}`}
                  className="text-2xl font-bold text-gray-900 hover:text-indigo-600 dark:text-gray-100"
                >
                  {finalStories[0].title}
                </Link>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{finalStories[0].summary}</p>
              </div>
            </div>
          )}

          {finalStories.slice(1).map((story) => (
            <div key={story.slug} className="overflow-hidden rounded-lg shadow-md">
              {story.images?.length > 0 && (
                <Link href={`/stories/${story.slug}`} className="block">
                  <Image
                    className="h-48 w-full object-cover"
                    src={story.images[0]}
                    alt={story.title}
                    width={600}
                    height={300}
                    priority={false}
                  />
                </Link>
              )}
              <div className="p-4">
                <Link
                  href={`/stories/${story.slug}`}
                  className="text-lg font-semibold text-gray-900 hover:text-indigo-600 dark:text-gray-100"
                >
                  {story.title}
                </Link>
                <p className="mt-2 text-sm text-gray-500">{story.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
