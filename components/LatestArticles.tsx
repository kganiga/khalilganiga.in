import Link from '@/components/Link'
import { CalendarIcon } from 'lucide-react'

const LatestArticles = ({ posts }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(dateString))
  }

  return (
    <div className="space-y-8">
      {posts.slice(0, 6).map((post) => {
        const { slug, date, title, summary, tags } = post
        return (
          <div
            key={slug}
            className="flex h-auto flex-col items-start rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 md:h-64 md:flex-row md:items-center"
          >
            <div className="w-full flex-shrink-0 border-b border-gray-200 p-4 text-center dark:border-gray-700 md:w-32 md:border-b-0 md:border-r">
              <CalendarIcon className="mx-auto h-6 w-6 text-gray-500 dark:text-gray-400" />
              <time
                dateTime={date}
                className="mt-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {formatDate(date)}
              </time>
            </div>
            <div className="flex-grow p-6">
              <h3 className="text-lg font-semibold capitalize text-gray-900 dark:text-gray-100 md:text-xl">
                <Link href={`/blog/${slug}`}>{title}</Link>
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                {summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
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
          </div>
        )
      })}
    </div>
  )
}

export default LatestArticles
