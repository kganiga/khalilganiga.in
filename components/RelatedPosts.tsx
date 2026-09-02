import { slug } from 'github-slugger'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allStories, allTools } from 'contentlayer/generated'
import Link from '@/components/Link'

interface RelatedPostsProps {
  tags: string[]
  currentSlug: string
}

const RelatedPosts = ({ tags, currentSlug }: RelatedPostsProps) => {
  if (!tags || tags.length === 0) {
    console.error('No tags provided.')
    return null
  }

  const tag = slug(tags[0]) // Ensure the tag is properly slugged

  // Merge and filter blogs, stories, and tools based on the slugged tag and exclude the current post
  const pool = [...allBlogs, ...(allStories || []), ...(allTools || [])]
  const relatedContent = allCoreContent(
    sortPosts(
      pool.filter(
        (item) =>
          item.tags && item.tags.map((t) => slug(t)).includes(tag) && item.slug !== currentSlug
      )
    )
  ).slice(0, 5) // Limit to 5 related items

  if (relatedContent.length === 0) {
    console.error('No related content found.')
    return null
  }

  return (
    <div className="pb-10 pt-6">
      <h2 className="pt-6 text-left text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        You might also like to read
      </h2>

      <ul className="max-w mx-auto mt-4 space-y-3 text-left">
        {relatedContent.map((item, index) => (
          <li key={item.slug} className="flex items-start">
            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">{index + 1}.</span>
            <Link
              href={`/${item.path}`}
              className="text-base font-medium capitalize text-primary-600 hover:underline dark:text-primary-400"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RelatedPosts
