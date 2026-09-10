import { slug as slugify } from 'github-slugger'
import { allStories } from 'contentlayer/generated'
import Image from 'next/image'
import Link from '@/components/Link'
import Card from '@/components/ui/Card'

interface RelatedStoriesProps {
  tags: string[]
  currentSlug: string
}

// The generic "stories" marker just identifies the content type, not a theme -
// two stories sharing only that tag aren't actually related to each other.
const EXCLUDED_TAGS = new Set(['stories'])

const themeTagsOf = (tags?: string[]) =>
  (tags || []).map((t) => slugify(t)).filter((t) => !EXCLUDED_TAGS.has(t))

const coverImageOf = (images: unknown) => {
  const list = images ? (typeof images === 'string' ? [images] : (images as string[])) : []
  return list.length > 0 ? list[0] : '/static/images/ocean.jpeg'
}

const RelatedStories = ({ tags, currentSlug }: RelatedStoriesProps) => {
  const currentThemes = themeTagsOf(tags)
  if (currentThemes.length === 0) return null

  const related = allStories
    .filter((story) => story.slug !== currentSlug && story.draft !== true)
    .map((story) => {
      const overlap = themeTagsOf(story.tags).filter((t) => currentThemes.includes(t)).length
      return { story, overlap }
    })
    .filter(({ overlap }) => overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap || new Date(b.story.date).getTime() - new Date(a.story.date).getTime()
    )
    .slice(0, 3)
    .map(({ story }) => story)

  if (related.length === 0) return null

  return (
    <div className="py-6 text-left">
      <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        More Telugu stories like this
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {related.map((story) => (
          <Card
            key={story.slug}
            className="group overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:hover:border-primary-900"
          >
            <Link href={`/${story.path}`} className="group block">
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={coverImageOf(story.images)}
                  alt={story.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3
                  lang={story.language}
                  className="line-clamp-2 text-sm font-semibold capitalize leading-snug text-gray-950 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400"
                >
                  {story.title}
                </h3>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RelatedStories
