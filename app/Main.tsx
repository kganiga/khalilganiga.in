import FeaturedArticles from '@/components/FeaturedArticles'
import LatestArticles from '@/components/LatestArticles'
import Link from '@/components/Link'
import PopularTags from '@/components/PopularTags'
import SocialIcons from '@/components/SocialIcons'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import tagData from 'app/tag-data.json'
import { allStories } from 'contentlayer/generated'
import { ArrowRight, BookOpenText, Code2, PenLine, Sparkles } from 'lucide-react'
import Image from 'next/image'

const MAX_DISPLAY = 6
const MAX_FEATURED_STORIES = 5

export default function Home({ posts }) {
  const tagCounts = tagData as Record<string, number>
  const sortedStories = allStories
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const featuredStories = sortedStories.filter((story) => story.isfeatured)
  const remainingStories = sortedStories.filter((story) => !story.isfeatured)
  const finalStories = [...featuredStories, ...remainingStories].slice(0, MAX_FEATURED_STORIES)
  const featuredPost =
    posts.find((post) => post.isfeatured && !post.tags?.includes('stories')) || posts[0]
  const stats = [
    { label: 'Technical notes', value: posts.length },
    { label: 'Stories', value: allStories.length },
    { label: 'Topics', value: Object.keys(tagCounts).length },
  ]

  return (
    <div className="space-y-16 pb-16">
      <section className="relative isolate overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(16,185,129,0.08)_45%,rgba(245,158,11,0.12))] dark:bg-[linear-gradient(135deg,rgba(14,165,233,0.16),rgba(16,185,129,0.08)_45%,rgba(245,158,11,0.12))]" />
        <div className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-800 dark:border-sky-900/80 dark:bg-sky-950/70 dark:text-sky-200">
              <Sparkles className="h-4 w-4" />
              Code, essays, and Telugu fiction
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-gray-950 dark:text-white sm:text-5xl lg:text-6xl">
              Logic by design, imagination by heart.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-700 dark:text-gray-300 sm:text-lg">
              I am Khalil Ganiga. This is my digital notebook for AEM engineering, useful web tools,
              experiments, and stories that wander a little farther from the terminal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="gap-2" size="lg">
                <Link href="/blog" className="break-normal">
                  Read articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="gap-2" size="lg" variant="outline">
                <Link href="/stories" className="break-normal">
                  Explore stories
                  <BookOpenText className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-gray-800/80 dark:bg-gray-900/70"
                >
                  <div className="text-2xl font-bold text-gray-950 dark:text-white">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid content-center gap-4">
            <Card className="overflow-hidden p-0">
              <div className="relative h-72">
                <Image
                  src="/static/images/author.jpg"
                  alt="Khalil Ganiga"
                  fill
                  className="object-cover grayscale"
                  priority
                />
              </div>
              <div className="border-t border-gray-200 p-5 dark:border-gray-800">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">
                  <Code2 className="h-4 w-4" />
                  Adobe Experience Manager developer
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Writing practical guides for builders and small fictional worlds for readers.
                </p>
              </div>
            </Card>
            {featuredPost && (
              <Card className="p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-300">
                  <PenLine className="h-4 w-4" />
                  Featured read
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="text-lg font-semibold capitalize leading-snug text-gray-950 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                >
                  {featuredPost.title}
                </Link>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {featuredPost.summary}
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
                Fresh from the notebook
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                Latest Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <LatestArticles posts={posts.slice(0, MAX_DISPLAY)} />
        </div>

        <aside className="hidden space-y-5 lg:sticky lg:top-24 lg:block lg:self-start">
          <Card className="p-6 text-center">
            <SocialIcons />
          </Card>
          <Card className="p-3 text-center">
            <FeaturedArticles posts={posts} />
          </Card>
          <Card className="p-3 text-center">
            <PopularTags tagCounts={tagCounts} />
          </Card>
        </aside>
      </section>

      <section className="hidden md:block">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
              Fiction and reflections
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
              Featured Musings
            </h2>
          </div>
          <Link
            href="/stories"
            className="hidden items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 sm:flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {finalStories.length > 0 && (
            <Card key={finalStories[0].slug} className="overflow-hidden p-0 md:col-span-2">
              {finalStories[0].images?.length > 0 && (
                <Link href={`/stories/${finalStories[0].slug}`} className="block">
                  <Image
                    className="h-80 w-full object-cover sm:h-96"
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
                  className="text-2xl font-semibold capitalize leading-tight tracking-tight text-gray-950 hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
                >
                  {finalStories[0].title}
                </Link>
                <p className="mt-3 max-w-3xl leading-7 text-gray-600 dark:text-gray-300">
                  {finalStories[0].summary}
                </p>
              </div>
            </Card>
          )}

          {finalStories.slice(1).map((story) => (
            <Card key={story.slug} className="overflow-hidden p-0">
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
                  className="font-semibold capitalize leading-tight tracking-tight text-gray-950 hover:text-primary-600 dark:text-white dark:hover:text-primary-400 sm:text-lg md:text-xl"
                >
                  {story.title}
                </Link>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {story.summary}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
