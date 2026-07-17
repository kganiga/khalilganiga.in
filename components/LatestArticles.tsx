import Link from '@/components/Link'
import Card from '@/components/ui/Card'
import { ArrowUpRight, CalendarIcon } from 'lucide-react'

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
    <div className="space-y-4">
      {posts.slice(0, 6).map((post) => {
        const { slug, date, title, summary, tags } = post
        return (
          <Card
            key={slug}
            className="group overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:hover:border-primary-900"
          >
            <div className="grid gap-0 md:grid-cols-[9rem_1fr]">
              <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/70 md:block md:border-b-0 md:border-r md:text-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 md:mx-auto" />
                <time
                  dateTime={date}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mt-2"
                >
                  {formatDate(date)}
                </time>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold capitalize leading-snug text-gray-950 dark:text-white md:text-xl">
                    <Link
                      href={`/blog/${slug}`}
                      className="hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {title}
                    </Link>
                  </h3>
                  <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-gray-400 transition group-hover:text-primary-500" />
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags?.slice(0, 4).map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag.replace(/\s+/g, '-').toLowerCase()}`}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-primary-900 dark:hover:text-primary-400"
                    >
                      {tag.replace(/-/g, ' ')}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default LatestArticles
