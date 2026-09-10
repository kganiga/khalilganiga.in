import { slug as slugify } from 'github-slugger'
import { allStories } from 'contentlayer/generated'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import Link from '@/components/Link'
import Card from '@/components/ui/Card'
import storyTagData from 'app/story-tag-data.json'

// Themes with only one story don't get a page of their own - a hub listing a single
// item isn't a useful page, it's just the story itself with extra steps.
const MIN_STORIES_PER_THEME_PAGE = 2

const formatTheme = (tag: string) =>
  tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const theme = formatTheme(tag)
  return {
    title: `${theme} Telugu Stories`,
    description: `Telugu short stories on ${siteMetadata.title} about ${theme.toLowerCase()}.`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/stories/tags/${tag}`,
    },
  }
}

export const generateStaticParams = async () => {
  const tagCounts = storyTagData as Record<string, number>
  return Object.keys(tagCounts)
    .filter((tag) => tagCounts[tag] >= MIN_STORIES_PER_THEME_PAGE)
    .map((tag) => ({ tag }))
}

export default async function StoryTagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const tagCounts = storyTagData as Record<string, number>
  if (!tagCounts[tag] || tagCounts[tag] < MIN_STORIES_PER_THEME_PAGE) {
    return notFound()
  }

  const theme = formatTheme(tag)
  const matchingStories = allCoreContent(
    sortPosts(
      allStories.filter(
        (story) => story.draft !== true && story.tags?.map((t) => slugify(t)).includes(tag)
      )
    )
  )

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Musings',
        item: `${siteMetadata.siteUrl}/stories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: theme,
        item: `${siteMetadata.siteUrl}/stories/tags/${tag}`,
      },
    ],
  }

  return (
    <div className="space-y-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
          <Link href="/stories" className="hover:underline">
            Musings
          </Link>{' '}
          / Theme
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          {theme} Telugu Stories
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
          {matchingStories.length} Telugu short {matchingStories.length === 1 ? 'story' : 'stories'}{' '}
          on {siteMetadata.title} touching on {theme.toLowerCase()}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matchingStories.map((story) => (
          <Card key={story.slug} className="p-5">
            <h2 className="text-lg font-semibold capitalize leading-snug text-gray-950 dark:text-white">
              <Link
                href={`/${story.path}`}
                lang={story.language}
                className="hover:text-primary-600 dark:hover:text-primary-400"
              >
                {story.title}
              </Link>
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {story.summary}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
