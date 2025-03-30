import React, { FC, memo } from 'react'
import Link from '@/components/Link'
interface FeaturedArticlesProps {
  posts: {
    slug: string
    title: string
    isfeatured: boolean
    tags: string[]
  }[]
}

const FeaturedArticles: FC<FeaturedArticlesProps> = memo(({ posts }) => {
  const featuredPosts = posts.filter((post) => post.isfeatured && !post.tags.includes('stories'))

  return (
    <div className="mb-5 rounded-md p-4">
      <h2 className="mb-3 px-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Popular Articles
      </h2>
      <hr className="my-4" />
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {featuredPosts.length === 0 && <li>No featured articles found.</li>}
          {featuredPosts.map((post) => (
            <li key={post.slug} className="mb-4">
              <div className="flex">
                <Link
                  href={`/blog/${post.slug}`}
                  className="ml-2 mt-2 text-left text-sm font-medium text-primary-700 transition-colors duration-200 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                  aria-label={`View post ${post.title}`}
                >
                  {post.title}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})

FeaturedArticles.displayName = 'FeaturedArticles'

export default FeaturedArticles
