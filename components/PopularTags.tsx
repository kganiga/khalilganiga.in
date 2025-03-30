import Link from '@/components/Link'
import { slug } from 'github-slugger'

interface PopularTagsProps {
  tagCounts: Record<string, number>
}

function PopularTags({ tagCounts }: PopularTagsProps) {
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const topTags = sortedTags.slice(0, 10)

  if (topTags.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">No popular tags found.</div>
  }

  // Format tags: replace hyphens with spaces & capitalize words
  const formatTag = (tag: string): string =>
    tag
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  return (
    <>
      <h2 className="mb-3 px-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Trending Categories
      </h2>
      <hr className="my-4" />
      <ul className="bg-base-100 p-4">
        {topTags.map((t, index) => (
          <li
            key={t}
            className="flex items-center gap-3  py-2 last:border-b-0 dark:border-gray-700"
          >
            <div className="text-2xl font-thin tabular-nums opacity-30">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="list-col-grow">
              <Link
                href={`/tags/${slug(t)}`}
                className="text-sm font-medium text-primary-700 transition-colors duration-200 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                aria-label={`View posts tagged ${t}`}
              >
                {formatTag(t)}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default PopularTags
