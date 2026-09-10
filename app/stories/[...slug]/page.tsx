import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent } from 'pliny/utils/contentlayer'
import { allStories, allAuthors } from 'contentlayer/generated'
import type { Authors, Story } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import RelatedStories from '@/components/RelatedStories'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { slug as slugify } from 'github-slugger'
import storyTagData from 'app/story-tag-data.json'

const twitterHandle = siteMetadata.twitter ? `@${siteMetadata.twitter.split('/').pop()}` : undefined
const isProduction = process.env.NODE_ENV === 'production'
const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

// queens-well.mdx is the English translation of raani-baavi.mdx, the only bilingual
// pair in the stories section - cross-declare them so search engines see them as
// language alternates of the same story rather than unrelated pages.
const TRANSLATION_PAIRS: Record<string, { hrefLang: string; slug: string }> = {
  'raani-baavi': { hrefLang: 'en-IN', slug: 'queens-well' },
  'queens-well': { hrefLang: 'te-IN', slug: 'raani-baavi' },
}

// A theme tag only gets its own /stories/tags page (and becomes clickable) once at
// least one other story shares it - otherwise it would be a page listing one item.
const MIN_STORIES_PER_THEME_PAGE = 2
const storyThemeTags = (tags?: string[]) =>
  (tags || [])
    .map((t) => slugify(t))
    .filter(
      (t) =>
        t !== 'stories' && (storyTagData as Record<string, number>)[t] >= MIN_STORIES_PER_THEME_PAGE
    )

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allStories.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => (img.includes('http') ? img : siteMetadata.siteUrl + img))

  const canonicalUrl =
    post.canonicalUrl && post.canonicalUrl.trim()
      ? post.canonicalUrl.startsWith('http')
        ? post.canonicalUrl
        : `${siteMetadata.siteUrl}/${post.canonicalUrl.replace(/^\//, '')}`
      : `${siteMetadata.siteUrl}/${post.path}`

  const translation = TRANSLATION_PAIRS[post.slug]
  const translatedPost = translation
    ? allStories.find((p) => p.slug === translation.slug)
    : undefined

  return {
    title: `${post.title}`,
    description: post.summary,
    authors:
      authors.length > 0
        ? authors.map((name) => ({ name, url: `${siteMetadata.siteUrl}/about` }))
        : undefined,
    robots: post.draft ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages:
        translation && translatedPost
          ? { [translation.hrefLang]: `${siteMetadata.siteUrl}/${translatedPost.path}` }
          : undefined,
    },
    openGraph: {
      title: `${post.title} | ${siteMetadata.title}`,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: post.language === 'en' ? 'en_US' : 'te_IN',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonicalUrl,
      images: ogImages.map((url) => ({ url })),
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${siteMetadata.title}`,
      description: post.summary,
      images: ogImages,
      site: twitterHandle,
      creator: twitterHandle,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allStories.map((p) => ({ slug: p.slug.split('/') }))

  return paths
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const sortedPosts = sortPosts(allStories) as Story[]
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prev = coreContent(sortedPosts[postIndex + 1])
  const next = coreContent(sortedPosts[postIndex - 1])
  const post = sortedPosts.find((p) => p.slug === slug) as Story
  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
      url: `${siteMetadata.siteUrl}/about`,
    }
  })
  jsonLd['publisher'] = {
    '@type': 'Organization',
    name: siteMetadata.author,
    logo: {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${siteMetadata.image}`,
    },
  }

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
        name: post.title,
        item: `${siteMetadata.siteUrl}/${post.path}`,
      },
    ],
  }

  const Layout = layouts[post.layout || defaultLayout]

  const themeTags = storyThemeTags(post.tags).map((tag) => ({
    text: tag
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    href: `/stories/tags/${tag}`,
  }))

  return (
    <>
      {isProduction && post && 'draft' in post && post.draft === true ? (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      ) : (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
          <Layout
            content={mainContent}
            authorDetails={authorDetails}
            titleLang={post.language}
            themeTags={themeTags}
            relatedContent={<RelatedStories tags={post.tags} currentSlug={post.slug} />}
            next={next}
            prev={prev}
            rawText={post.body.raw}
          >
            <div lang={post.language}>
              <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
            </div>
          </Layout>
        </>
      )}
    </>
  )
}
