import { slug } from 'github-slugger'
import { allBlogs, allTools } from 'contentlayer/generated'
import Link from '@/components/Link'

interface RelatedPostsProps {
  tags: string[]
  currentSlug: string
}

const MAX_RELATED = 5

const RelatedPosts = ({ tags, currentSlug }: RelatedPostsProps) => {
  if (!tags || tags.length === 0) {
    return null
  }

  const currentTags = tags.map((t) => slug(t))

  // Blog + Tools share the same technical audience, so they can reasonably link
  // to each other; Stories are a deliberately separate audience and are excluded
  // (see the Telugu-stories related-content component instead).
  const pool = [...allBlogs, ...(allTools || [])]
  const relatedContent = pool
    .filter((item) => item.slug !== currentSlug && item.draft !== true)
    .map((item) => {
      const itemTags = (item.tags || []).map((t) => slug(t))
      const overlap = itemTags.filter((t) => currentTags.includes(t)).length
      return { item, overlap }
    })
    .filter(({ overlap }) => overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap || new Date(b.item.date).getTime() - new Date(a.item.date).getTime()
    )
    .slice(0, MAX_RELATED)
    .map(({ item }) => item)

  if (relatedContent.length === 0) {
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
