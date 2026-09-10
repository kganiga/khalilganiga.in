import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { allBlogs } from 'contentlayer/generated'
import { formatDate } from 'pliny/utils/formatDate'
import Link from '@/components/Link'
import Card from '@/components/ui/Card'
import siteMetadata from '@/data/siteMetadata'
import { aemHubs, getHubBySlug } from '@/data/aemHubs'

export async function generateMetadata(props: {
  params: Promise<{ hub: string }>
}): Promise<Metadata> {
  const params = await props.params
  const hub = getHubBySlug(params.hub)
  if (!hub) return {}

  const canonicalUrl = `${siteMetadata.siteUrl}/blog/topics/${hub.slug}`
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${hub.title} | ${siteMetadata.title}`,
      description: hub.description,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'website',
      url: canonicalUrl,
      images: [siteMetadata.socialBanner],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${hub.title} | ${siteMetadata.title}`,
      description: hub.description,
      images: [siteMetadata.socialBanner],
    },
  }
}

export const generateStaticParams = async () => aemHubs.map((hub) => ({ hub: hub.slug }))

export default async function HubPage(props: { params: Promise<{ hub: string }> }) {
  const params = await props.params
  const hub = getHubBySlug(params.hub)
  if (!hub) return notFound()

  const totalArticles = hub.sections.reduce((sum, section) => sum + section.articleSlugs.length, 0)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteMetadata.siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteMetadata.siteUrl}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: hub.shortTitle,
        item: `${siteMetadata.siteUrl}/blog/topics/${hub.slug}`,
      },
    ],
  }

  return (
    <div className="space-y-12 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600 dark:text-primary-400">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{' '}
          / Topic Guide
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-4xl">
          {hub.title}
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {totalArticles} articles
        </p>
        <div className="mt-5 space-y-4 text-base leading-7 text-gray-700 dark:text-gray-300">
          {hub.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {hub.sections.map((section) => {
        const posts = section.articleSlugs
          .map((slug) => allBlogs.find((post) => post.slug === slug && post.draft !== true))
          .filter((post): post is NonNullable<typeof post> => Boolean(post))

        if (posts.length === 0) return null

        return (
          <section key={section.heading}>
            <h2 className="mb-5 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              {section.heading}
            </h2>
            <div className="space-y-4">
              {posts.map((post, index) => (
                <Card key={post.slug} className="overflow-hidden p-0">
                  <Link href={`/${post.path}`} className="group block p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold leading-snug text-gray-950 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                          {post.summary}
                        </p>
                        <time
                          dateTime={post.date}
                          className="mt-3 block text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
                        >
                          {formatDate(post.date, siteMetadata.locale)}
                        </time>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
