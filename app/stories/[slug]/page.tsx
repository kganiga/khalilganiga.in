import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { allCoreContent } from 'pliny/utils/contentlayer'
import { allStories, allAuthors } from 'contentlayer/generated'
import type { Authors, Story } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

// ✅ Fix: Properly generate metadata for stories
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug)
  const story = allStories.find((s) => s.slug === slug)

  if (!story) return notFound()

  const authorList = story.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return authorResults || { name: 'Unknown' }
  })

  const publishedAt = new Date(story.date).toISOString()
  const modifiedAt = new Date(story.lastmod || story.date).toISOString()
  const authors = authorDetails.map((author) => author.name)

  let imageList = [siteMetadata.socialBanner]
  if (story.images) {
    imageList = typeof story.images === 'string' ? [story.images] : story.images
  }

  return {
    title: story.title,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: `${siteMetadata.siteUrl}/stories/${slug}`,
      images: imageList.map((img) => ({
        url: img.includes('http') ? img : siteMetadata.siteUrl + img,
      })),
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.title,
      description: story.summary,
      images: imageList,
    },
  }
}

// ✅ Fix: Generate static params properly
export const generateStaticParams = async () => {
  return allStories.map((story) => ({ slug: story.slug }))
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const slug = decodeURI(params.slug)

  // ✅ Fix: Ensure sorting by publish date
  const sortedCoreContents = allCoreContent(
    allStories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  )
 console.log(allStories.map((s) => ({ slug: s.slug, date: s.date })));

  const storyIndex = sortedCoreContents.findIndex((s) => s.slug === slug)
  if (storyIndex === -1) return notFound()

  const prev = sortedCoreContents[storyIndex + 1] || null
  const next = sortedCoreContents[storyIndex - 1] || null
  const story = allStories.find((s) => s.slug === slug) as Story
  const authorList = story?.authors || ['default']

  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return authorResults || { name: 'Unknown' }
  })

  const mainContent = story

  // ✅ Fix: Ensure structuredData exists before modifying
  const jsonLd = story.structuredData || {}
  jsonLd['author'] = (authorDetails || []).map((author) => ({
    '@type': 'Person',
    name: author?.name || 'Unknown',
  }))

  const Layout = layouts[story.layout || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={story.body.code} components={components} toc={story.toc} />
      </Layout>
    </>
  )
}
