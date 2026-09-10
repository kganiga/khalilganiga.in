import { allBlogs } from 'contentlayer/generated'
import Link from '@/components/Link'
import { getHubBySlug, getHubNeighbors } from '@/data/aemHubs'

interface RelatedHubArticlesProps {
  hubSlug: string
  currentSlug: string
}

const findPosts = (slugs: string[]) =>
  slugs
    .map((slug) => allBlogs.find((post) => post.slug === slug && post.draft !== true))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))

const ArticleList = ({ posts }: { posts: ReturnType<typeof findPosts> }) => (
  <ul className="mt-3 space-y-2 text-left">
    {posts.map((post) => (
      <li key={post.slug}>
        <Link
          href={`/${post.path}`}
          className="text-base font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          {post.title}
        </Link>
      </li>
    ))}
  </ul>
)

const RelatedHubArticles = ({ hubSlug, currentSlug }: RelatedHubArticlesProps) => {
  const hub = getHubBySlug(hubSlug)
  if (!hub) return null

  const { before, after } = getHubNeighbors(hub, currentSlug)
  const priorArticles = findPosts(before)
  const nextArticles = findPosts(after)

  if (priorArticles.length === 0 && nextArticles.length === 0) return null

  return (
    <div className="space-y-6 pb-10 pt-6">
      {priorArticles.length > 0 && (
        <div>
          <h2 className="text-left text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Prerequisite reading
          </h2>
          <ArticleList posts={priorArticles} />
        </div>
      )}
      {nextArticles.length > 0 && (
        <div>
          <h2 className="text-left text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Continue this guide
          </h2>
          <ArticleList posts={nextArticles} />
        </div>
      )}
      <Link
        href={`/blog/topics/${hub.slug}`}
        className="inline-block text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
      >
        View the full {hub.shortTitle} →
      </Link>
    </div>
  )
}

export default RelatedHubArticles
